use once_cell::sync::Lazy;
use crate::{RoverPic};
use reqwest::Client as ReqwestClient;
use serde_json::{from_value, Value};

// Lazy static HTTP Client
/*
    "once_cell" is used to ensure that the ReqwestClient is lazily initialized and created only once.
    The Lazy::new function takes a closure that initializes the resource, and it is invoked only once when the resource is accessed for the first time.
    The Lazy type ensures thread safety during initialization.

 */
static HTTP_CLIENT: Lazy<ReqwestClient> = Lazy::new(|| ReqwestClient::new()); // A static item is a value which is valid for the entire duration of your program (a 'static lifetime)
static API_CONFIG: Lazy<NasaApiConfig> = Lazy::new(|| NasaApiConfig::new());

struct NasaApiConfig {
    base_url: String,
    api_key: String
}

impl NasaApiConfig {
    // Function to create a new ApiConfig instance
    fn new() -> Self {
        let api_key = std::env::var("NASA_API_KEY").unwrap_or_else(|_| "DEMO_KEY".to_string());
        let base_url = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos".to_string();
        Self { base_url, api_key }
    }

    // Method to construct the URL for fetching photos by date
    fn construct_url_by_date(&self, date: &str) -> String {
        format!("{}?earth_date={}&api_key={}&page=1", self.base_url, date, self.api_key)
    }

    // Add more methods for other types of URLs if necessary
}

#[tauri::command]
pub async fn download_image(img_url: String) -> Result<Vec<u8>, String> {
    if img_url.trim().is_empty() {
        return Err("Invalid img_url".to_string())
    }

    let result = HTTP_CLIENT.get(&img_url)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    // Check if the response status is OK (200) or else Return Error msg
    if result.status() != reqwest::StatusCode::OK {
        return Err(format!("Request failed with status code: {}", result.status()));
    }

    // Read Response
    let img_bytes = result
        .bytes()
        .await
        .map_err(|_| "Failed to convert image to byte array".to_string())?;

    let byte_array = img_bytes.to_vec(); // new Uint8Array(response) behövs i Front end så u8

    Ok(byte_array)
}

#[tauri::command]
pub async fn load_pic_by_date_async(date: String) -> Result<Vec<RoverPic>, String> {

    if date.trim().is_empty() {
        return Err("Invalid date".to_string());
    }

    let url_by_date = API_CONFIG.construct_url_by_date(&date);

    /*
         - In Rust, the '?' operator is used for error propagation - propagate the error if there is one; otherwise, continue with the value.
         - If used outside a function that returns Result or Option, the '?' operator cannot be used.

         - This would be equivalent if not used '?' -> if the Result is an Err, it will short-circuit the function and return early with the error.

            let result = match http_client.get(&url).send() {
                Ok(value) => value,
                Err(err) => return Err(err.to_string()),
            };

         - The await keyword is used to await the completion of the asynchronous future returned by http_client.get(&url).send().
         - Once the future is resolved, the map_err function is applied to handle the conversion of potential errors.

 */
    let result = HTTP_CLIENT
        .get(&url_by_date)
        .send()
        .await
        .map_err(|err| err.to_string())?; // reuse lazy static HTTP CLIENT -> Not creating a new one with each Request


    // Check if the response status is OK (200) or else Return Error msg
    if result.status() != reqwest::StatusCode::OK {
        return Err(format!("Request failed with status code: {}", result.status()));
    }

    // Deserialize JSON Response
    // Value == Represents any valid JSON value.
    let json_result: Value = result.json().await.map_err(|err| err.to_string())?;

    // Check if the "photos" array exists in the JSON response
    // .get() == A string index (key) can be used to access a value in a map, and a usize index can be used to access an element of an array.
    let photos_array = json_result.get("photos").ok_or("Missing 'photos' array in the response")? // Transforms the Option<T> into a [Result<T, E>], mapping Some(v) to Ok(v) and None to Err(err).
        .as_array()
        .cloned() // för att få den till Owned ist lånad Option Vec
        .unwrap_or_default(); // För att få bort Option och bli Vec<Value>

    // Convert to Vec<RoverPic>
    // filter_map() behöver Option, då den mappar och filtrerar bort None's, samt from_value() -> Result som vi kan konvertera till en Option med ok()
    let rover_pics = photos_array.iter()
        .filter_map(|rover_pic| from_value(rover_pic.clone()).ok()) // Konvertera JSON till RoverPic, hover metod för mer info
        .collect();

    Ok(rover_pics)
}

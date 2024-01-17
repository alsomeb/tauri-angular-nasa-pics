// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod http;

use chrono::Local;
use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use once_cell::sync::Lazy;
use reqwest::Client as ReqwestClient;
use http::http_functions::load_pic_by_date_async;

// Lazy static HTTP Client
/*
    "once_cell" is used to ensure that the ReqwestClient is lazily initialized and created only once.
    The Lazy::new function takes a closure that initializes the resource, and it is invoked only once when the resource is accessed for the first time.
    The Lazy type ensures thread safety during initialization.

 */
static HTTP_CLIENT: Lazy<ReqwestClient> = Lazy::new(|| ReqwestClient::new());

#[derive(Serialize, Deserialize, Debug)]
// #[serde(rename_all = "camelCase")]
struct RoverPic {
    id: u32,
    sol: u32,
    camera: Camera,
    img_src: String,
    earth_date: String,
    rover: Rover,
}


#[derive(Serialize, Deserialize, Debug)]
// #[serde(rename_all = "camelCase")]
struct Camera {
    id: u32,
    full_name: String,
}

#[derive(Serialize, Deserialize, Debug)]
// #[serde(rename_all = "camelCase")]
struct Rover {
    id: u32,
    name: String,
    landing_date: String,
    launch_date: String,
    status: String,
    total_photos: u32
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn get_dt() -> String {
    let dt = Local::now();
    format!("{}", dt.format("%a %b %e %Y"))
}


// ------------ THIS ONE IS FOR LEARNING PURPOSE, CHECK http folder for the one being used ------------
// Load pictures taken by the Curiosity rover on a specific date
// This function takes a date parameter as input and returns a Result with either a vector of RoverPic instances or a String representing an error.
// This func is not ASYNC
#[tauri::command]
fn load_pic_by_date(date: String) -> Result<Vec<RoverPic>, String> {
    // Checks if the provided date is empty and returns an error if it is.
    if date.is_empty() {
        return Err("Invalid date".to_string());
    }

    // Retrieves the NASA API key from environment variables or uses a demo key if not found.
    let api_key = std::env::var("NASA_API_KEY").unwrap_or_else(|_| "DEMO_KEY".to_string());

    // Construct the URL for the NASA API with the provided date and API key
    let url = format!(
        "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date={}&api_key={}&page=1",
        date, api_key
    );

    // Makes an HTTP GET request to the NASA API and converts any request error to a String if it occurs.
    // Uses a ref '&' to the Owned String 'url'
    // Maps a Result<T, E> to Result<T, F> by applying a function to a contained Err value, leaving an Ok value untouched
    let response = reqwest::blocking::get(&url).map_err(|err| err.to_string())?;



    // Extracts the "photos" array from the JSON response, creating an owned copy of the vector.
    /*
        - map_err is a method that transforms the Err variant of a Result using a closure. In this case, it takes the err (which is a serde_json::Error) and converts it to a String using to_string().
          This is done to convert the specific error type into a more generic String type, ensuring compatibility with the overall Result type.

        - The ? operator is the "try" operator in Rust. It is used to propagate errors. If the result of the expression is Ok, the value is unwrapped; if it's Err,
          the error is returned early from the function with the ? operator.
          In this case, if an error occurred during the conversion, it will return the error early, and the subsequent code won't be executed.

        - After handling the error, the code accesses the "photos" field of the deserialized JSON.
          This assumes that the JSON structure contains a field named "photos." It's used to extract the relevant part of the JSON response for further processing.
     */
    let photos = response
        .json::<serde_json::Value>() // Represents any valid JSON value.
        .map_err(|err| err.to_string())?["photos"]
        .as_array() // If the Value is an Array, returns the associated vector. Returns None otherwise.
        .cloned() // Cloning the Vec<Value> to create an owned copy
        .unwrap_or_default();



    /*
        Iterates through the photos vector, clones each element to avoid ownership issues, tries to deserialize each cloned element into a RoverPic,
        filters out any deserialization errors using ok(), and finally collects the successfully deserialized RoverPic instances into a new vector called rover_pics.

        This approach ensures that only valid RoverPic instances are collected in the resulting vector,
        and any deserialization errors are gracefully ignored. The use of clone() is essential to handle the ownership model in Rust
        and avoid moving the original photo object during deserialization. The ok() method is then used to filter out None results,
        leaving only the successfully deserialized instances

     */
    let rover_pics: Vec<RoverPic> = photos
        .iter()
        .filter_map(|photo| serde_json::from_value::<RoverPic>(photo.clone()).ok())// Creates a cloned copy of the current photo. This is done to avoid ownership issues when deserializing.
        .collect();

    // Return the successful collected RoverPic instances as a Result
    Ok(rover_pics)
}





fn main() {
    // Load environment variables from the .env file
    dotenv().expect("Should contain .env file in src-tauri folder");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_dt, load_pic_by_date, load_pic_by_date_async])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

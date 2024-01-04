// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use chrono::Local;
use dotenv::dotenv;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
struct RoverPic {
    id: u32,
    sol: u32,
    camera: Camera,
    img_src: String,
    earth_date: String,
    rover: Rover,
}

#[derive(Serialize, Deserialize, Debug)]
struct Camera {
    id: u32,
    full_name: String,
}

#[derive(Serialize, Deserialize, Debug)]
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
    let formatted_string = format!("{}", dt.format("%a %b %e %Y"));
    formatted_string // last row automatically return in rust
}

/*
// test api for future ref
#[tauri::command]
fn get_products() -> Result<Vec<Product>, String> {
    /*
        1. The ? operator is now used with map_err to convert the json() error into a String if it occurs.
        2. The function will either return the successful result or an error.

        3. response.json(): This part of the code attempts to deserialize the HTTP response body into JSON. It's using the json method provided by
           the Response type in reqwest. This method returns a Result where the Ok variant contains the deserialized JSON data.

        4. map_err(|err| err.to_string()): The map_err method is used here to convert the potential error from JSON deserialization into a String.
           This is necessary because the error type from JSON deserialization might not implement ToString.
           This part ensures that if an error occurs during deserialization, it will be transformed into a String error.

        5. The entire expression response.json().map_err(|err| err.to_string()) is wrapped in Ok(...) to ensure that if it succeeds,
           the deserialized JSON data is wrapped in the Ok variant of a Result.

        6. The ? operator is used at the end to propagate any errors that occurred during the JSON deserialization.
           If an error occurs, the function will immediately return Err with the converted error message.

     */

    let resp: Vec<Product> = match reqwest::blocking::get("https://fakestoreapi.com/products") {
        // If response.json() is successful, it returns Ok(deserialized_data).
        Ok(response) => response.json().map_err(|err| err.to_string())?,

        // If an error occurs during JSON deserialization, it transforms the error into a String using map_err(|err| err.to_string()).
        Err(err) => return Err(err.to_string()),
    };

    Ok(resp)
}

 */

#[tauri::command]
fn load_pic_by_date(date: String) -> Result<Vec<RoverPic>, String> {
    let test_url = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2015-6-3&api_key=DEMO_KEY";
    let resp = reqwest::blocking::get(test_url)?;

    // https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2015-6-3&api_key=DEMO_KEY
    // https://chat.openai.com/c/476bf9f3-e34a-43e9-9fe7-9bb67712e258
}
/*
fn main() -> Result<(), reqwest::Error> {
    let test_url = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2015-6-3&api_key=DEMO_KEY";
    let response = reqwest::blocking::get(test_url)?.json::<serde_json::Value>()?;

    let photos = response["photos"].as_array().unwrap_or_default();

    // Collecting RoverPic instances from the photos
    let rover_pics: Vec<RoverPic> = photos
        .iter()
        .filter_map(|photo| serde_json::from_value::<RoverPic>(photo.clone()).ok())
        .collect();

    // Displaying the collected RoverPic instances
    for rover_pic in rover_pics {
        println!("{:?}", rover_pic);
    }

    Ok(())
}
 */

fn main() {
    // Load environment variables from the .env file
    dotenv().expect("Failed to read .env file");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_dt, get_products, load_pic_by_date])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

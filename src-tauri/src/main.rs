// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use chrono::Local;
use dotenv::dotenv;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
struct Product {
    title: String,
    price: f64,
    description: String,
    image: String,
    category: String
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn get_dt() -> String {
    let dt = Local::now();
    let formatted_string = format!("{}", dt.format("%a %b %e %Y"));
    formatted_string // last row automatically return in rust
}

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

#[tauri::command]
fn test_env() -> String {
    let api_key = std::env::var()
}

fn main() {
    // Load environment variables from the .env file
    dotenv.ok();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_dt, get_products])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

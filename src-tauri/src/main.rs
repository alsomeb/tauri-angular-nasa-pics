// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use chrono::Local;
use dotenv::dotenv;

use http::http_functions::load_pic_by_date_async;
use crate::commands::mongo_commands::fetch_all_albums;
use crate::http::http_functions::download_image;

use crate::models::rover_model::RoverPic;
use crate::repository::mongo_repository::MongoRepository;

mod http;
mod models;
mod repository;
mod commands;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn get_dt() -> String {
    let dt = Local::now();
    format!("{}", dt.format("%a %b %e %Y"))
}

#[tokio::main]
async fn main() {
    // Load environment variables from the .env file
    dotenv().expect("Should contain .env file in src-tauri folder");

    // Init MongoDB
    let mongo_db = MongoRepository::init().await; // Behöver annotera main med Tokio

    tauri::Builder::default()
        // method is used to add shared state to the Tauri application,
        // making it accessible from different parts of your application, such as command handlers.
        .manage(mongo_db)
        .invoke_handler(tauri::generate_handler![get_dt, load_pic_by_date_async, fetch_all_albums, download_image])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod http;
mod models;

use chrono::Local;
use dotenv::dotenv;
use http::http_functions::load_pic_by_date_async;
use crate::models::rover_model::RoverPic;


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn get_dt() -> String {
    let dt = Local::now();
    format!("{}", dt.format("%a %b %e %Y"))
}

fn main() {
    // Load environment variables from the .env file
    dotenv().expect("Should contain .env file in src-tauri folder");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_dt, load_pic_by_date_async])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

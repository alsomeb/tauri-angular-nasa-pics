// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use chrono::Local;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn get_dt() -> String {
    let dt = Local::now();
    let formatted_string = format!("{}", dt.format("%a %b %e %Y"));
    formatted_string
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_dt])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
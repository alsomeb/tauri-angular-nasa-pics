use chrono::Local;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
pub fn get_dt() -> String {
    let dt = Local::now();
    format!("{}", dt.format("%a %b %e %Y"))
}

use tauri::State;

use crate::models::album_model::Album;
use crate::repository::mongo_repository::MongoRepository;

#[tauri::command]
pub async fn fetch_all_albums(state: State<'_, MongoRepository>) -> Result<Vec<Album>, String> {
    // Access the managed MongoDB instance, Retrieve a &borrow to the underlying value with a lifetime of 'r.
    let db = state.inner();

    /*
        if get_all_users() encounters an error (e.g., a database connection issue, a query error, etc.),
        that error will be converted to a String containing the error message,
        and this String will be the Err variant of the returned Result from get_dt.
     */
    let albums_result = db.get_all_albums()
        .await
        .map_err(|err| err.to_string()); // Convert from Mongo Error to a String Err Msg

    albums_result
}


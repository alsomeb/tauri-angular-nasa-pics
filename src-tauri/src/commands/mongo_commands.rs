use tauri::State;

use crate::models::user_model::User;
use crate::repository::mongo_repository::MongoRepository;

#[tauri::command]
pub async fn fetch_all_users(state: State<'_, MongoRepository>) -> Result<Vec<User>, String> {
    // Access the managed MongoDB instance, Retrieve a &borrow to the underlying value with a lifetime of 'r.
    let db = state.inner();

    /*
        if get_all_users() encounters an error (e.g., a database connection issue, a query error, etc.),
        that error will be converted to a String containing the error message,
        and this String will be the Err variant of the returned Result from get_dt.
     */
    let users_result = db.get_all_users()
        .await
        .map_err(|err| err.to_string()); // Convert from Mongo Error to a String Err Msg

    users_result
}


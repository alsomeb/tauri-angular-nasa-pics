use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
// #[serde(rename_all = "camelCase")]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")] // om ej rename blir id == null
    pub id: Option<ObjectId>,
    pub email: String,
    pub firebase_id: String
}

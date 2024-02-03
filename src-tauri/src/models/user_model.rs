use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
// #[serde(rename_all = "camelCase")]
pub struct User {
    pub id: Option<ObjectId>,
    pub email: String,
    pub firebase_id: String
}

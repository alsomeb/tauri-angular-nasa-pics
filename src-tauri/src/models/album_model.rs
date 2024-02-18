use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use crate::models::rover_model::RoverPic;

#[derive(Serialize, Deserialize, Debug)]
pub struct Album {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")] // om ej rename blir id == null
    pub id: Option<ObjectId>,
    pub user_id: String,
    pub rover_images: Vec<RoverPic>
}

use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Album {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")] // om ej rename blir id == null
    pub id: Option<ObjectId>,
    pub name: String,
    pub user_id: String,
    pub photos: Vec<RoverAlbumEntry>
}

#[derive(Serialize, Deserialize, Debug)]
pub struct RoverAlbumEntry {
    pub id: u32,
    pub img_src: String
}

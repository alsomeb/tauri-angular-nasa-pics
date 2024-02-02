use serde::{Deserialize, Serialize};
#[derive(Serialize, Deserialize, Debug)]
// #[serde(rename_all = "camelCase")]
pub struct RoverPic {
    id: u32,
    sol: u32,
    camera: Camera,
    img_src: String,
    earth_date: String,
    rover: Rover,
}


#[derive(Serialize, Deserialize, Debug)]
// #[serde(rename_all = "camelCase")]
pub struct Camera {
    id: u32,
    full_name: String,
}

#[derive(Serialize, Deserialize, Debug)]
// #[serde(rename_all = "camelCase")]
pub struct Rover {
    id: u32,
    name: String,
    landing_date: String,
    launch_date: String,
    status: String,
    total_photos: u32
}

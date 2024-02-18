import { Injectable } from '@angular/core';
import {invoke} from "@tauri-apps/api";

/*
#[derive(Serialize, Deserialize, Debug)]
// #[serde(rename_all = "camelCase")]
pub struct User {
    pub id: Option<ObjectId>,
    pub email: String,
    pub firebase_id: String
}

 */

type User = {
  // TODO typa
}

@Injectable({
  providedIn: 'root'
})
export class MongoService {

  constructor() { }

  async fetchAllAlbums() {
    try {
      const data = await invoke('fetch_all_albums');
      console.log(data);
    } catch (e) {
      console.log(e);
      throw e; // Då metoden som kallar på denna service får hantera error
    }
  }
}

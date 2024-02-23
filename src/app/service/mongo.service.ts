import { Injectable } from '@angular/core';
import {invoke} from "@tauri-apps/api";
import {ObjectId} from "mongodb";

export interface Album {
  _id?: ObjectId; // Made optional with '?'
  name: string;
  user_id: string;
  photos: RoverAlbumEntry[];
}

export interface RoverAlbumEntry {
  id: number;
  img_src: string;
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

  async createAlbum(album: Album) {
    try {
      const data = await invoke('create_album', {
        album: album
      });
      console.log(data);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}

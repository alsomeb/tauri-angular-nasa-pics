import {Injectable} from '@angular/core';
import {invoke} from "@tauri-apps/api";

export type RoverPic = {
  id: number,
  sol: number,
  camera: Camera,
  img_src: string,
  earth_date: string,
  rover: Rover,
}

export type Camera = {
  id: number,
  full_name: string
}

export type Rover = {
  id: number,
  name: string,
  landing_date: string,
  launch_date: string,
  status: string,
  total_photos: number
}

@Injectable({
  providedIn: 'root'
})
export class NasaRoverService {

  constructor() { }

  async getRoverPicturesByDate(dateString: string): Promise<RoverPic[]> {
    try {
      const data = await invoke('load_pic_by_date', {
        date: dateString,
      });

      // Assuming data is an array of RoverPic objects, cast them to RoverPic[]
      return data as RoverPic[];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

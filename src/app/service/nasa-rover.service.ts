import {Injectable} from '@angular/core';
import {invoke} from "@tauri-apps/api";
import {BehaviorSubject} from "rxjs";

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
  private currentSelectedRoverPic: BehaviorSubject<RoverPic> = new BehaviorSubject<RoverPic>({
    id: 0,
    sol: 0,
    camera: { id: 0, full_name: '' },
    img_src: '',
    earth_date: '',
    rover: { id: 0, name: '', landing_date: '', launch_date: '', status: '', total_photos: 0 }
  });

  constructor() { }

  getCurrentSelectedRoverPic() {
    return this.currentSelectedRoverPic.asObservable();
  }

  setCurrentSelectedRoverPic(roverPic: RoverPic) {
    this.currentSelectedRoverPic.next(roverPic);
  }

  async getRoverPicturesByDate(dateString: string): Promise<RoverPic[]> {
    try {
      const data = await invoke('load_pic_by_date_async', {
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

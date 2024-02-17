import {Injectable} from '@angular/core';
import {invoke} from "@tauri-apps/api";
import {BehaviorSubject} from "rxjs";
import {downloadDir} from "@tauri-apps/api/path";
import {save} from "@tauri-apps/api/dialog";
import {writeBinaryFile} from "@tauri-apps/api/fs";
import {NgxSpinnerService} from "ngx-spinner";
import {sweetAlertSuccess, sweetAlertError} from "../alerts/alerts";

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
    // Vi sätter ett default object, men det kommer inte användas, hellre detta än null
    private currentSelectedRoverPic: BehaviorSubject<RoverPic> = new BehaviorSubject<RoverPic>({
        id: 0,
        sol: 0,
        camera: {id: 0, full_name: ''},
        img_src: '',
        earth_date: '',
        rover: {id: 0, name: '', landing_date: '', launch_date: '', status: '', total_photos: 0}
    });

    constructor(private spinnerService: NgxSpinnerService) {
    }

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
            throw error;
        }
    }

    async downloadImage(rover: RoverPic) {
        try {
            const byteArray = await this.fetchImageAndConvertToJPG(rover.img_src);
            await this.saveFileUserPrompt(byteArray, rover.id);
        } catch (error) {
            sweetAlertError("Image not saved", "There was an error saving the image, try again or another image")
            throw error;
        }
    }

    private async saveFileUserPrompt(byteArray: Uint8Array, roverID: number) {
        const suggestedFilename = `mars_image_${roverID}.jpg`;

        // Returns the path to the user's download directory, OS Specific
        const downloadsDir = await downloadDir();

        // Save into the downloads directory by default
        const filePath = await save({
            defaultPath: `${downloadsDir}/${suggestedFilename}`,
            filters: [{
                name: "jpg", // Filter name
                extensions: ["jpg"] // Save as .jpg extension
            }]
        });

        // Check if filePath exist, if not user canceled save dialog and no save takes place
        if (filePath) {
            await writeBinaryFile(filePath, byteArray);
            sweetAlertSuccess("Image saved", `We hope you enjoy the image`)
        }
    }

    private async fetchImageAndConvertToJPG(imgUrl: string) {
        try {
            this.spinnerService.show();

            // Invoke the Rust command and await the byte array response
            const byteArray: number[] = await invoke('download_image', {
                imgUrl: imgUrl,
            });

            // Convert the returned byte array from rust backend to a Uint8Array
            return new Uint8Array(byteArray);
        } catch (error) {
            throw error;
        } finally {
            this.spinnerService.hide();
        }
    }


}

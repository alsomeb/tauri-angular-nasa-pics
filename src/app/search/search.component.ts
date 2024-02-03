import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {NasaRoverService, RoverPic} from "../service/nasa-rover.service";
import {NgxSpinnerService} from "ngx-spinner";
import {MatCardModule} from "@angular/material/card";
import {Subscription} from "rxjs";
import { open } from '@tauri-apps/api/shell';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatDividerModule, NgStyle, NgClass, NgIf, MatCardModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit, OnDestroy {
  roverPics: RoverPic[] = []
  searchForm!: FormGroup;
  hasResult: boolean = false;
  currentSelectedRoverPic!: RoverPic;
  currentSelectedRoverPicSub!: Subscription;

  constructor(private fb: FormBuilder, private roverService: NasaRoverService, private spinner: NgxSpinnerService, private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      date: [this.currentDate(), [Validators.required, Validators.pattern(/^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/),
      ]],
    })

    this.currentSelectedRoverPicSub = this.roverService.getCurrentSelectedRoverPic().subscribe((roverPic) => {
      this.currentSelectedRoverPic = roverPic;
    })
  }

  ngOnDestroy(): void {
    this.currentSelectedRoverPicSub.unsubscribe();
  }

  currentDate() {
    return new Date().toISOString().split("T")[0];
  }

  async fetchPicsByDate(date: string) {
    this.spinner.show();
    try {
      this.roverPics = await this.roverService.getRoverPicturesByDate(date);
      this.hasResult = true;
      this.spinner.hide();
    } catch (error) {
      this.hasResult = false;
      this.spinner.hide();
      console.error('Error fetching rover pictures:', error);
    }
  }

   handleSearch() {
    // Blir problem med async tyvärr om ej körs innanför ngZone
     this.ngZone.run(() => {
       // Reset
       this.hasResult = false;

       // Fetch date from reactive form
       const date = this.searchForm.get("date")?.value

       if (date) {
         this.fetchPicsByDate(date);
       }
     })
  }

  showMore(rover: RoverPic) {
    this.roverService.setCurrentSelectedRoverPic(rover);
  }

  async showImageInSystemDefaultBrowser(imageUrl: string) {
    // opens the given URL on the default browser:
    await open(imageUrl);
  }

  /* Funkade ej men kan va värdefullt att ha i framtiden
  async downloadImage(dataUrl: string) {
    const suggestedFilename = `mars_image_${this.currentSelectedRoverPic.id}.png`;

    // Returns the path to the user's download directory, OS Specific
    const downloadsDir = await downloadDir();

    // Save into the default downloads directory, like in the browser
    const filePath = await save({
      defaultPath: downloadsDir + "/" + suggestedFilename,
    });

    // Check if filePath exist (if not user canceled save dialog)
    if(filePath) {
      // Now we can write the file to the disk
      const img = await fetch(dataUrl)
          .then((res) => res.blob());


      // Convert Blob to Uint8Array
      const arrayBuffer = await new Response(img).arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      await writeBinaryFile(filePath, uint8Array);
    }
  }
   */
}

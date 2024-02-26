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
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatDividerModule, NgStyle, NgClass, NgIf, MatCardModule, MatIconModule, MatTooltipModule],
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

  async downloadImage() {
    try {
      await this.roverService.downloadImage(this.currentSelectedRoverPic);
    } catch (error) {
      console.error(`Failed to download image'`, error);
    }
  }

  async showImageInSystemDefaultBrowser(imageUrl: string) {
    // opens the given URL on the default browser:
    await open(imageUrl);
  }
}

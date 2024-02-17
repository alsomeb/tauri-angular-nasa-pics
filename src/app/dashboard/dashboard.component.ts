import {Component, OnDestroy, OnInit} from '@angular/core';
import {NasaRoverService, RoverPic} from "../service/nasa-rover.service";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {NgIf, NgOptimizedImage, NgStyle} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {Subscription} from "rxjs";
import {open} from "@tauri-apps/api/shell";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {ProgressSpinnerModule} from "primeng/progressspinner";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, NgOptimizedImage, RouterLinkActive, RouterLink, NgIf, NgStyle, NgxSkeletonLoaderModule, ProgressSpinnerModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  roverPics: RoverPic[] = []
  isLoading: boolean = true;
  currentSelectedRoverPic!: RoverPic;
  currentSelectedRoverPicSub!: Subscription;

  ngOnInit(): void {
    this.fetchSamplePictures();
    this.currentSelectedRoverPicSub = this.roverService.getCurrentSelectedRoverPic().subscribe((roverPic) => {
      this.currentSelectedRoverPic = roverPic;
    })
  }

  constructor(private roverService: NasaRoverService) {
  }

  async fetchSamplePictures() {
    const monthAgo = this.getDateInPast(25);

    try {
       this.roverPics = await this.roverService.getRoverPicturesByDate(monthAgo);
       this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      console.error('Error fetching rover pictures:', error);
    }
  }

  getDateInPast(amountDaysDeduct: number): string {
    // Get the current date
    const currentDate = new Date();

    // Subtract X Days to collect desired Date in past
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - amountDaysDeduct);

    return date.toISOString().split("T")[0];
  }

  showMore(rover: RoverPic) {
    this.roverService.setCurrentSelectedRoverPic(rover);
  }

  async showImageInSystemDefaultBrowser(imageUrl: string) {
    try {
      // opens the given URL on the default browser:
      await open(imageUrl);
    } catch (error) {
      console.error(`Failed to open the URL '${imageUrl}' in the default browser.`, error);
    }
  }

  async downloadImage() {
    try {
      await this.roverService.downloadImage(this.currentSelectedRoverPic);
    } catch (error) {
      console.error(`Failed to download image'`, error);
    }
  }

  ngOnDestroy(): void {
    this.currentSelectedRoverPicSub.unsubscribe();
  }
}

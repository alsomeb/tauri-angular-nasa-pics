import {Component, OnDestroy, OnInit} from '@angular/core';
import {NasaRoverService, RoverPic} from "../service/nasa-rover.service";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, NgOptimizedImage, RouterLinkActive, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  roverPics: RoverPic[] = []
  isLoading: boolean = true;

  ngOnInit(): void {
    this.roverPics = [];
    this.fetchSamplePictures();
  }

  constructor(private roverService: NasaRoverService) {
  }

  async fetchSamplePictures() {
    const weekAgo = this.getDateAWeekAgo();

    try {
       this.roverPics = await this.roverService.getRoverPicturesByDate(weekAgo);
       this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      console.error('Error fetching rover pictures:', error);
    }
  }

  getDateAWeekAgo(): string {
    // Get the current date
    const currentDate = new Date();

    // Subtract 7 days
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    return  sevenDaysAgo.toISOString().split("T")[0];
  }

  ngOnDestroy(): void {
  }
}

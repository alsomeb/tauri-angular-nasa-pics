import {Component, OnDestroy, OnInit} from '@angular/core';
import {NasaRoverService, RoverPic} from "../service/nasa-rover.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy{

  ngOnInit(): void {
  }

  constructor(private roverService: NasaRoverService) {
  }

  async testFetch() {
    try {
      const roverPics: RoverPic[] = await this.roverService.getRoverPicturesByDate("2023-08-23");
      console.log(roverPics);
    } catch (error) {
      console.error('Error fetching rover pictures:', error);
    }
  }

  ngOnDestroy(): void {
  }
}

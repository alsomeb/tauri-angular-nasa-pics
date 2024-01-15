import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {NasaRoverService, RoverPic} from "../service/nasa-rover.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatDividerModule, NgStyle, NgClass, NgIf],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit, OnDestroy {
  roverPics: RoverPic[] = []
  searchForm!: FormGroup;
  hasResult: boolean = false;

  constructor(private fb: FormBuilder, private roverService: NasaRoverService, private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      date: [this.currentDate(), [Validators.required, Validators.pattern(/^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/),
      ]],
    })
  }

  ngOnDestroy(): void {
  }

  currentDate() {
    return new Date().toISOString().split("T")[0];
  }

  async fetchPicsByDate(date: string) {
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

  async handleSearch() {
    // Reset
    this.spinner.show();
    this.hasResult = false;
    this.roverPics = [];

    // Fetch date from reactive form
    const date = this.searchForm.get("date")?.value

    if (date) {
      await this.fetchPicsByDate(date);
      console.log(this.roverPics);
      console.log(this.hasResult);
    }
  }
}

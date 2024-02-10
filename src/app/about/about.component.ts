import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-about',
  standalone: true,
    imports: [
        NgOptimizedImage,
        RouterLink
    ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

}

// TODO VISA INTE REGISTER OM INLOGGAD
// TODO ÖKA FONT STORLEK

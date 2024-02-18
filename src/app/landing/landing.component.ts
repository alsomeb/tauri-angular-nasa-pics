import {Component, OnDestroy, OnInit} from '@angular/core';
import { version } from '../../../package.json';
import lottie from 'lottie-web';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit, OnDestroy {
  animationPath = "assets/mars_animation.json";

  constructor() {
  }

  loadAnimation(path: string) {
    const animationContainer = document.getElementById('lottie-container');

    if (animationContainer) {
      lottie.loadAnimation({
        container: animationContainer, // the dom element
        path: path, // the path to the animation json
        renderer: 'svg', // Render type: 'canvas', 'html' or 'svg'
        loop: true, // Whether to loop the animation
        autoplay: true, // Whether to start playing the animation on load
      });
    }
  }

  ngOnInit(): void {
    this.loadAnimation(this.animationPath)
  }

  ngOnDestroy(): void {
  }

  protected readonly version = version;
}

import {Component, OnInit} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {invoke} from "@tauri-apps/api";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  sysTime: string = "-"
  ngOnInit(): void {
    this.getSystemTime();
  }

  getSystemTime() {
    invoke('get_dt').then((time) => {
      this.sysTime = time as string;
    })
  }
}

// TODO IF LOGGED IN DONT SHOW REGESITER / LOGIN, SHOW LOGOUT, IMPL LOGOUT LOGIC

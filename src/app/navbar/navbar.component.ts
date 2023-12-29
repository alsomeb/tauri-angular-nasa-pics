import {Component, OnInit} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {invoke} from "@tauri-apps/api";
import {SupaAuthService} from "../service/supa-auth.service";

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
  isLoggedIn: boolean = false;
  sysTime: string = "-"


  constructor(private authService: SupaAuthService) {
  }

  ngOnInit(): void {
    this.getSystemTime();
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn() {
    this.isLoggedIn = this.authService.isLoggedIn();
    console.log(this.isLoggedIn);
  }

  getSystemTime() {
    invoke('get_dt').then((time) => {
      this.sysTime = time as string;
    })
  }
}

// TODO FIX LOG OUT AND CHECK NAVBAR IS CORRECT

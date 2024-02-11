import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {invoke} from "@tauri-apps/api";
import {SupaAuthService} from "../service/supa-auth.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  sysTime: string = "-"

  constructor(private authService: SupaAuthService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.authService.getIsLoggedIn().subscribe((val) => {
      // Blir problem annars vid refresh att Angular inte vet om att man är inloggad förrens man klickar på nav menyn
      this.ngZone.run(() => {
        this.isLoggedIn = val;
      });
    })
    this.getSystemTime();
  }

  async logout() {
    try {
      this.spinner.show()
      const {error} = await this.authService.signOut();

      if (error) {
        throw error;
      }

      this.isLoggedIn = false;
      this.router.navigate(['']);
    } catch (error) {
      this.spinner.hide()
    } finally {
      this.spinner.hide()
    }
  }


  getSystemTime() {
    invoke('get_dt').then((time) => {
      this.sysTime = time as string;
    })
  }

  ngOnDestroy(): void {
  }
}

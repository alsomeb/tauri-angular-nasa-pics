import {Component, OnDestroy, OnInit} from '@angular/core';
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
  isLoggedIn: boolean | undefined = false;
  sysTime: string = "-"

  constructor(private authService: SupaAuthService, private spinner: NgxSpinnerService, private router: Router) {
  }

  ngOnInit(): void {
    this.checkSession();
    this.getSystemTime();
  }

  checkSession() {
    this.authService.getSession().then((session) => {
      const currUser = session.data.session?.user;

      this.isLoggedIn = !!currUser;
    }).catch(() => {
      this.isLoggedIn = false
    })
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

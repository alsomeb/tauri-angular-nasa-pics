import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {invoke} from "@tauri-apps/api";
import {SupaAuthService} from "../service/supa-auth.service";
import {NgxSpinnerService} from "ngx-spinner";
import {AvatarModule} from "primeng/avatar";
import {Subscription} from "rxjs";
import {User} from "@supabase/supabase-js";
import {ButtonModule} from "primeng/button";
import {DockModule} from "primeng/dock";
import { version } from '../../../package.json';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
    NgIf,
    AvatarModule,
    ButtonModule,
    DockModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  sysTime: string = "-"
  currentUser!: User
  subscriptions: Subscription[] = [];
  appVersion = version;

  constructor(private authService: SupaAuthService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private ngZone: NgZone) {
  }

  ngOnInit(): void {
    const loggedInSub = this.authService.getIsLoggedIn().subscribe((val) => {
      // Blir problem annars vid refresh att Angular inte vet om att man är inloggad förrens man klickar på nav menyn
      this.ngZone.run(() => {
        this.isLoggedIn = val;
      });
    })
    this.subscriptions.push(loggedInSub);

    const currentUser = this.authService.getCurrentUser().subscribe((user) => {
      this.ngZone.run(() => {
        this.currentUser = user;
      });
    })
    this.subscriptions.push(currentUser);

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
      this.router.navigate(['/login']);
    } catch (error) {
      this.spinner.hide()
    } finally {
      this.spinner.hide()
    }
  }

  getBadgeLetter() {
    return this.currentUser.email?.charAt(0).toUpperCase() ?? "U";
  }

  getBadgeIcon() {
    return this.currentUser.user_metadata['avatar_url']
  }

  // If this.getBadgeIcon() is truthy (meaning the user has an avatar URL), !!this.getBadgeIcon() evaluates to true.
  // If this.getBadgeIcon() is falsy (meaning there's no avatar URL), !!this.getBadgeIcon() evaluates to false.
  hasBadgePicture() {
    return !!this.getBadgeIcon();
  }

  redirectProfile() {
    this.ngZone.run(() => {
        this.router.navigate(['/profile']);
    });
  }

  getSystemTime() {
    invoke('get_dt').then((time) => {
      this.sysTime = time as string;
    })
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions when the component is destroyed
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}

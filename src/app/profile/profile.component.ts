import {Component, OnDestroy, OnInit} from '@angular/core';
import {SupaAuthService} from "../service/supa-auth.service";
import {Subscription} from "rxjs";
import {User} from "@supabase/supabase-js";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentUserSub!: Subscription;
  currentUser!: User;

  constructor(private authService: SupaAuthService) {
  }

  ngOnInit(): void {
    this.currentUserSub = this.authService.getCurrentUser()
        .subscribe((user) => this.currentUser = user);
  }

  getLastSignedIn() {
    return this.convertStringToDate(this.currentUser.last_sign_in_at ?? "-"); // om undefined så står det bara '-'
  }

  getAccountCreated() {
    return this.convertStringToDate(this.currentUser.created_at ?? "-");
  }

  private convertStringToDate(dateString: string) {
    const isoDate = new Date(dateString);
    return `${isoDate.toLocaleDateString()} ${isoDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })}`
  }

  ngOnDestroy(): void {
    this.currentUserSub.unsubscribe();
  }

}

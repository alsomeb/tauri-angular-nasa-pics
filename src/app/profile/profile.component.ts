import {Component, OnDestroy, OnInit} from '@angular/core';
import {SupaAuthService} from "../service/supa-auth.service";
import {Subscription} from "rxjs";
import {User} from "@supabase/supabase-js";
import {Album, MongoService} from "../service/mongo.service";
import {uuid} from "@supabase/supabase-js/dist/main/lib/helpers";

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

  constructor(private authService: SupaAuthService, private mongoService: MongoService) {
  }

  ngOnInit(): void {
    this.currentUserSub = this.authService.getCurrentUser()
        .subscribe((user) => this.currentUser = user);
  }

  getSignInProviders() {
    const metaData = this.currentUser.app_metadata
    const providers: string[] =  metaData['providers']
    return providers.join(", ");
  }

  getLastSignedIn() {
    return this.convertToLocaleDateTimeString(this.currentUser.last_sign_in_at ?? "-"); // om undefined så står det bara '-'
  }

  getAccountCreated() {
    return this.convertToLocaleDateTimeString(this.currentUser.created_at ?? "-");
  }

  private convertToLocaleDateTimeString(dateString: string) {
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

  async testMongoDBFetchAll() {
    try {
      await this.mongoService.fetchAllAlbums();
    } catch (e) {
      console.log(e)
    }
  }

  async testMongoDBFetchAllUserAlbums() {
    try {
      await this.mongoService.fetchAllAlbumsByUserId(this.currentUser.id);
    } catch (e) {
      console.log(e)
    }
  }

  async testMongoDBCreateRandomAlbum() {
    try {
      const testData: Album = {
        name: "Test Album",
        user_id: uuid(),
        photos: [
          {
            id: 1,
            img_src: "https://mars.nasa.gov/msl-raw-images/msss/01000/mcam/1000ML0044631200305217E01_DXXX.jpg"
          },
          {
            id: 2,
            img_src: "https://mars.nasa.gov/msl-raw-images/msss/01000/mcam/1000ML0044631200305217E01_DXXX.jpg"
          },
          {
            id: 3,
            img_src: "https://mars.nasa.gov/msl-raw-images/msss/01000/mcam/1000ML0044631200305217E01_DXXX.jpg"
          },
        ]
      }

      await this.mongoService.createAlbum(testData);
    } catch (e) {
      console.log(e)
    }
  }
}

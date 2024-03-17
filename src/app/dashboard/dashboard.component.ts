import {Component, OnDestroy, OnInit} from '@angular/core';
import {NasaRoverService, RoverPic} from "../service/nasa-rover.service";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {NgForOf, NgIf, NgOptimizedImage, NgStyle} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {Subscription} from "rxjs";
import {open} from "@tauri-apps/api/shell";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Album, MongoService} from "../service/mongo.service";
import {User} from "@supabase/supabase-js";
import {SupaAuthService} from "../service/supa-auth.service";
import {NgxSpinnerService} from "ngx-spinner";


@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [MatCardModule, MatButtonModule, NgOptimizedImage, RouterLinkActive, RouterLink, NgIf, NgStyle, NgxSkeletonLoaderModule, ProgressSpinnerModule, MatIconModule, MatTooltipModule, ReactiveFormsModule, NgForOf],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
    subs: Subscription[] = [];
    roverPics: RoverPic[] = []
    isLoading: boolean = true;
    currentSelectedRoverPic!: RoverPic;
    currentUser!: User;
    albumForm!: FormGroup;
    albumOptions: Album[] = [];

    ngOnInit(): void {
        this.fetchSamplePictures();
        const currentUserSub = this.authService.getCurrentUser()
            .subscribe((user) => this.currentUser = user);
        this.subs.push(currentUserSub);

        const currentSelectedRoverPicSub = this.roverService.getCurrentSelectedRoverPic().subscribe((roverPic) => {
            this.currentSelectedRoverPic = roverPic;
        })
        this.subs.push(currentSelectedRoverPicSub);


        this.albumForm = this.fb.group({
            albumSelect: [""]
        })
    }

    constructor(private roverService: NasaRoverService, private fb: FormBuilder, private mongoService: MongoService, private authService: SupaAuthService, private spinnerService: NgxSpinnerService) {
    }

    async fetchSamplePictures() {
        const monthAgo = this.getDateInPast(100);

        try {
            this.roverPics = await this.roverService.getRoverPicturesByDate(monthAgo);
            this.isLoading = false;
        } catch (error) {
            this.isLoading = false;
            console.error('Error fetching rover pictures:', error);
        }
    }

    getDateInPast(amountDaysDeduct: number): string {
        // Get the current date
        const currentDate = new Date();

        // Subtract X Days to collect desired Date in past
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - amountDaysDeduct);

        return date.toISOString().split("T")[0];
    }

    showMore(rover: RoverPic) {
        this.roverService.setCurrentSelectedRoverPic(rover);
    }

    async showImageInSystemDefaultBrowser(imageUrl: string) {
        try {
            // opens the given URL on the default browser:
            await open(imageUrl);
        } catch (error) {
            console.error(`Failed to open the URL '${imageUrl}' in the default browser.`, error);
        }
    }

    async downloadImage() {
        try {
            await this.roverService.downloadImage(this.currentSelectedRoverPic);
        } catch (error) {
            console.error(`Failed to download image'`, error);
        }
    }

    private async fetchUserAlbumsOptions() {
        try {
            this.spinnerService.show();
            this.albumOptions = await this.mongoService.fetchAllAlbumsByUserId(this.currentUser.id);
        } catch (e) {
            console.log(e)
        } finally {
            this.spinnerService.hide();
        }
    }

    async handleAddToAlbum(roverPic: RoverPic) {
        await this.fetchUserAlbumsOptions();
        console.log(roverPic);
    }

    handleAlbumOptionSubmit() {
        const albumObjectId = this.albumForm.value;
        // todo add current roverPic to existing album
        console.log(albumObjectId)
    }

    getStringMongoObjectId(objectId: any): string {
        return objectId?.$oid || objectId?.toString() || '';
    }

    onAlbumSelectChange() {
        this.handleAlbumOptionSubmit();
    }

    ngOnDestroy(): void {
        this.subs.forEach((sub) => sub.unsubscribe());
    }
}

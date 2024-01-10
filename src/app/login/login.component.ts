import {AfterViewInit, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {SupaAuthService} from "../service/supa-auth.service";
import {sweetAlertError} from "../alerts/alerts";
import {NgIf} from "@angular/common";
import {Subscription} from "rxjs";

type LoginUser = {
    email: string,
    password: string
}

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterLink,
        NgIf
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
    // with an exclamation mark, indicating that even though it's not assigned initially, it will be assigned a value before it's used.
    loginForm!: FormGroup;
    isLoggedInSub!: Subscription;

    constructor(private fb: FormBuilder,
                private spinner: NgxSpinnerService,
                private authService: SupaAuthService,
                private router: Router,
                private ngZone: NgZone) {
    }

    ngOnDestroy(): void {
        this.isLoggedInSub.unsubscribe();
    }

    ngOnInit(): void {
        // FormBuilder
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
            password: ['', [Validators.required, Validators.minLength(7)]]
        });
    }

    ngAfterViewInit(): void {
        this.isLoggedInSub = this.authService.getIsLoggedIn().subscribe((loggedIn) => {
            // Läs nedan om Angular Zone, har och göra med Angulars Change Detection som trackar och intercept async operations
            this.ngZone.run(() => {
                if (loggedIn) {
                    this.router.navigate(['/dashboard']);
                }
            });
        });
    }

    async handleLogin() {
        try {
            this.spinner.show();
            const loginUser: LoginUser = this.loginForm.value;
            const {error} = await this.authService.login(loginUser.email, loginUser.password);

            if (error) {
                throw error;
            }

            /*
                By using NgZone's run method, you ensure that the provided code runs inside Angular's zone,
                which allows Angular to track the changes and trigger change detection appropriately.
                It's a way to make sure that asynchronous operations are properly handled by Angular.

                Wrapping code in this ensures that they happen within Angular's zone and helps prevent issues related to change detection and state synchronization.
             */

            this.ngZone.run(() => {
                this.router.navigate(['/dashboard'])
            })

        } catch (error) {
            this.spinner.hide()
            if (error instanceof Error) {
                sweetAlertError("Oops!", "Wrong details 😒");
            }
        } finally {
            this.spinner.hide()
        }
    }

}


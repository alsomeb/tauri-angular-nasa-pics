import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {SupaAuthService} from "../service/supa-auth.service";
import {sweetAlertError} from "../alerts/alerts";
import {NgIf} from "@angular/common";

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
export class LoginComponent implements OnInit {
  // with an exclamation mark, indicating that even though it's not assigned initially, it will be assigned a value before it's used.
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private spinner: NgxSpinnerService,
              private authService: SupaAuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    // FormBuilder
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(7)]]
    });
  }

  async handleLogin() {
    try {
      this.spinner.show();
      const loginUser: LoginUser = this.loginForm.value;
      const { error } = await this.authService.login(loginUser.email, loginUser.password);

      if (error) {
        throw error;
      }

      // Annars funkar ej skiten att den redirect
      setTimeout(() => {
        this.router.navigate(['/dashboard'])
      }, 1)
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


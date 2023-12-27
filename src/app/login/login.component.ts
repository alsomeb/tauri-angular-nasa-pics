import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {SupaAuthService} from "../service/supa-auth.service";
import {sweetAlertError} from "../alerts/alerts";

type LoginUser = {
  email: string,
  password: string
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  // with an exclamation mark, indicating that even though it's not assigned initially, it will be assigned a value before it's used.
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private spinner: NgxSpinnerService,
              private authService: SupaAuthService) {
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
      this.spinner.show()
      const loginUser: LoginUser = this.loginForm.value; // This will be same type as 'RegisterUser'
      await this.authService.register(loginUser.email, loginUser.password)
    } catch (error) {
      sweetAlertError("Oops!", "Wrong details 😒")
      this.spinner.hide()
    } finally {
      this.loginForm.reset()
      this.spinner.hide()
    }
  }
}

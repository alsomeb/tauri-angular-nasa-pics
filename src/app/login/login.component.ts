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

  handleLogin() {
      this.spinner.show()
      const loginUser: LoginUser = this.loginForm.value; // This will be same type as 'RegisterUser'
      this.authService.login(loginUser.email, loginUser.password).then(() => {
        this.spinner.hide()
        this.router.navigate(['/dashboard']);
      }).catch((err) => {
        sweetAlertError("Oops!", "Wrong details 😒")
        console.log(err);
        this.loginForm.reset()
        this.spinner.hide()
      })
    }
}

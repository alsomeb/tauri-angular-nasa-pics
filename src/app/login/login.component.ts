import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";

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

  constructor(private fb: FormBuilder, private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    // FormBuilder
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(7)]]
    });
  }

  handleLogin() {
    console.log(this.loginForm);
    this.spinner.show();
  }
}

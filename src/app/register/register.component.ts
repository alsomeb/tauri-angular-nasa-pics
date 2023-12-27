import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import {SupaAuthService} from "../service/supa-auth.service";
import {NgxSpinnerService} from "ngx-spinner";

type RegisterUser = {
  email: string,
  firstName: string,
  lastName: string,
  password: string
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  // with an exclamation mark, indicating that even though it's not assigned initially, it will be assigned a value before it's used.
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: SupaAuthService,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    // FormBuilder
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(7)]],
    });
  }

  async handleRegister() {
    console.log(this.registerForm);
    try {
      this.spinner.show()
      const newUser: RegisterUser = this.registerForm.value; // This will be same like type RegisterUser
      console.log(newUser);

    } catch (error) {
      console.log(error)
      this.spinner.hide()
    } finally {
      this.registerForm.reset()
      this.spinner.hide()
    }
  }

}

import { Routes } from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {AboutComponent} from "./about/about.component";
import {RegisterComponent} from "./register/register.component";

export const routes: Routes = [
    {
        path: '', component: LoginComponent
    },
    {
        path: 'about', component: AboutComponent
    },
    {
        path: 'register', component: RegisterComponent
    },
];

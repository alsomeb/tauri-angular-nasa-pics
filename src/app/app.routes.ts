import { Routes } from "@angular/router";
import {LoginComponent} from "./login/login.component";

export const routes: Routes = [
    {
        path: '', component: LoginComponent
    },
    {
        // Lazy Loading Components
        path: 'about', loadComponent: () =>
            import('./about/about.component').then((comp) => comp.AboutComponent)
    },
    {
        path: 'register', loadComponent: () =>
            import('./register/register.component').then((comp) => comp.RegisterComponent)
    },
    {
        path: 'dashboard', loadComponent: () =>
            import('./dashboard/dashboard.component').then((comp) => comp.DashboardComponent)
    },
    {
        path: '**', redirectTo: '', pathMatch: "full"
    }
];

// Guide Supabase and Auth
// https://www.youtube.com/watch?v=hPI8OegHPYc&t=940s&ab_channel=TheCodeAngle
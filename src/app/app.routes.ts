import {Routes} from "@angular/router";
import {authGuard} from "./guards/auth.guard";
import {LandingComponent} from "./landing/landing.component";

export const routes: Routes = [
    {
        path: '', component: LandingComponent
    },
    {
        path: 'login', loadComponent: () =>
            import('./login/login.component').then((comp) => comp.LoginComponent)
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
        path: 'confirm', loadComponent: () =>
            import('./confirm/confirm.component').then((comp) => comp.ConfirmComponent)
    },
    {
        path: 'search', loadComponent: () =>
            import('./search/search.component').then((comp) => comp.SearchComponent),
        canActivate: [authGuard]
    },
    {
        path: 'profile', loadComponent: () =>
            import('./profile/profile.component').then((comp) => comp.ProfileComponent),
        canActivate: [authGuard]
    },
    {
        path: 'dashboard', loadComponent: () =>
            import('./dashboard/dashboard.component').then((comp) => comp.DashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: '**', redirectTo: '', pathMatch: "full"
    }
];

// Guide Supabase and Auth
// https://www.youtube.com/watch?v=hPI8OegHPYc&t=940s&ab_channel=TheCodeAngle

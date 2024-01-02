import {Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {authGuard} from "./guards/auth.guard";

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
        path: 'confirm', loadComponent: () =>
            import('./confirm/confirm.component').then((comp) => comp.ConfirmComponent)
    },
    {
        path: 'search', loadComponent: () =>
            import('./search/search.component').then((comp) => comp.SearchComponent),
        canActivate: [() => authGuard]
    },
    {
        path: 'dashboard', loadComponent: () =>
            import('./dashboard/dashboard.component').then((comp) => comp.DashboardComponent),
        canActivate: [() => authGuard]
    },
    {
        path: '**', redirectTo: '', pathMatch: "full"
    }
];

// Guide Supabase and Auth
// https://www.youtube.com/watch?v=hPI8OegHPYc&t=940s&ab_channel=TheCodeAngle

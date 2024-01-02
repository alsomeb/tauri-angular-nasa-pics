import {inject} from "@angular/core";
import {SupaAuthService} from "../service/supa-auth.service";
import {filter, map, Observable, take} from "rxjs";
import {User} from "@supabase/supabase-js";
import {Router} from "@angular/router";

export const authGuard: (route: any, state: any) => Observable<User | boolean> = () => {
    const authService = inject(SupaAuthService);
    const router = inject(Router);

    return authService.getCurrentUser().pipe(
        filter((val) => val !== null), // since it starts with null (BehaviorSubject in service)
        take(1),
        map((isAuth) => {
            if (!isAuth) {
                router.navigate(['']);
            }
            return isAuth;
        })
    );
};

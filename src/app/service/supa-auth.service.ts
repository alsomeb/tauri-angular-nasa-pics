import {Injectable} from '@angular/core';
import {createClient, SupabaseClient, User} from "@supabase/supabase-js";
import {environment} from "../../environments/environment.development";
import {BehaviorSubject} from "rxjs";

export interface Profile {
    id?: string
    username: string
    avatar_url: string
}

// https://www.youtube.com/watch?v=G_kqGWeMORQ&list=PLMVHTRBusikrZOUHt3Z-VeIdRaE4JNtpf&index=5&t=1923s&ab_channel=SimonGrimm
// https://supabase.com/docs/guides/getting-started/tutorials/with-angular

@Injectable({
    providedIn: 'root'
})
export class SupaAuthService {
    private supabaseClient: SupabaseClient;
    private currentUserSubject: BehaviorSubject<boolean | User | any> = new BehaviorSubject(null)
    private isLoggedInSubject: BehaviorSubject<boolean | User | any> = new BehaviorSubject(false)

    constructor() {
        this.supabaseClient = createClient(environment.supabaseDevMode.url, environment.supabaseDevMode.apikey) // url + key from dev env
        this.supabaseClient.auth.onAuthStateChange((event, session) => {
            this.setUserSession()
        })
    }

    // Register
    register(email: string, password: string) {
        return this.supabaseClient.auth.signUp(
            {
                email,
                password,
                options: {
                    emailRedirectTo: environment.supabaseDevMode.signUpRedirectUrlDevMode
                }
            },
        )
    }

    getCurrentUser() {
        return this.currentUserSubject.asObservable();
    }


    setUserSession() {
        this.supabaseClient.auth.getSession().then((session) => {
            const currUser = session.data.session?.user;

            if (currUser) {
                this.currentUserSubject.next(currUser);
                this.isLoggedInSubject.next(true);
                console.log(currUser);
            } else {
                this.currentUserSubject.next(false);
                this.isLoggedInSubject.next(false);
                console.log('User not authenticated');
            }
        }).catch((error) => {
            console.error('Error fetching session:', error);
            this.isLoggedInSubject.next(false);
            this.currentUserSubject.next(null);
        });
    }


    getSession() {
        return this.supabaseClient.auth.getSession();
    }


    // Login
    async login(email: string, password: string) {
        return await this.supabaseClient.auth.signInWithPassword({email, password})
    }

    // logout
    async signOut() {
        return await this.supabaseClient.auth.signOut()
    }

    // Avatars
    downLoadImage(path: string) {
        return this.supabaseClient.storage.from('avatars').download(path)
    }

    uploadAvatar(filePath: string, file: File) {
        return this.supabaseClient.storage.from('avatars').upload(filePath, file)
    }

    // profile
    profile(user: User) {
        return this.supabaseClient
            .from('profiles')
            .select(`username, avatar_url`)
            .eq('id', user.id)
            .single()
    }
}

// TODO NÄR MAN LOGGAR IN SÅ ÄNDRAS INTE MENYN MÅSTE REFRESH, FIXA EN BEHAVIORSUBJECT ELLER NÅGOT

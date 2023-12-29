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

  // Returns the session, refreshing it if necessary. The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.
  isLoggedIn() {
      return this.supabaseClient.auth.getSession() != null
  }


  setUserSession() {
     this.supabaseClient.auth.getSession().then((session) => {
        const currUser = session.data.session?.user;

        if (currUser) {
          this.currentUserSubject.next(currUser);
          console.log(currUser);
        } else {
          this.currentUserSubject.next(false);
          console.log('User not authenticated');
        }
      }).catch((error) => {
        console.error('Error fetching session:', error);
        this.currentUserSubject.next(null);
      });
  }

  // Login
  login(email: string, password: string) {
    return this.supabaseClient.auth.signInWithPassword({email, password})
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


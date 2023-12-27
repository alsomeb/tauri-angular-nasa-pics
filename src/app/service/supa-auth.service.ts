import {Injectable} from '@angular/core';
import {AuthChangeEvent, AuthSession, createClient, Session, SupabaseClient, User} from "@supabase/supabase-js";
import {environment} from "../../environments/environment.development";

export interface Profile {
  id?: string
  username: string
  avatar_url: string
}

@Injectable({
  providedIn: 'root'
})
export class SupaAuthService {
  private supabaseClient: SupabaseClient;
  _session: AuthSession | null = null

  constructor() {
    this.supabaseClient = createClient(environment.supabaseDevMode.url, environment.supabaseDevMode.apikey) // url + key from dev env
    this.supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log("Auth event: " + event)
      console.log("Auth session: " + session)
    })
  }

  get session() {
    this.supabaseClient.auth.getSession().then(({ data }) => {
      this._session = data.session
    })
    return this._session
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabaseClient.auth.onAuthStateChange(callback)
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

// https://supabase.com/docs/guides/getting-started/tutorials/with-angular

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SupaAuthService {
  private API_URL = "";

  constructor(private http: HttpClient) {
  }
}

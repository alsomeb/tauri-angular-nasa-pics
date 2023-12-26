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

// https://www.youtube.com/watch?v=hPI8OegHPYc&t=940s&ab_channel=TheCodeAngle 26:44 / 51:43

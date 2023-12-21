import {Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {invoke} from "@tauri-apps/api";
import {LoginComponent} from "./login/login.component";
import {NavbarComponent} from "./navbar/navbar.component";

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoginComponent, NgOptimizedImage, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  ngOnInit(): void{
  }

}

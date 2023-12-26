import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {isPermissionGranted, requestPermission, sendNotification} from '@tauri-apps/api/notification';
import {appWindow} from "@tauri-apps/api/window";

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoginComponent, NgOptimizedImage, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  permissionGrantedNotification: boolean = false;
  wasMinimized: boolean = false;

  ngOnInit(): void {
    this.setupWindowMinimizeListener();
  }

  /*
    You're correct that the Angular subscribe method is typically used for subscribing to observables,
    and in this case, you're dealing with a global event listener (window.addEventListener),
     which doesn't use Angular's observable mechanism.

   */
  setupWindowMinimizeListener() {
    window.addEventListener('blur', this.handleMinimizeWindow.bind(this));
  }

  handleMinimizeWindow() {
    appWindow.isMinimized().then((minimized) => {
      if (minimized) {
        this.wasMinimized = true;
        this.notification('Mars App was minimized', 'Mars App');
        // Reset boolean for the next minimize
        this.wasMinimized = false;
      }
    });
  }


  async requestPermissionNotifications() {
    try {
      console.log('Checking permission for notifications...');
      this.permissionGrantedNotification = await isPermissionGranted();

      if (!this.permissionGrantedNotification) {
        console.log('Requesting permission for notifications...');
        const permission = await requestPermission();
        console.log('Permission:', permission);
        this.permissionGrantedNotification = permission === 'granted';
      }
    } catch (error) {
      console.error('Error checking/requesting permission for notifications:', error);
    }
  }

  notification(text: string, title: string) {
    this.requestPermissionNotifications().then(() => {
      if (this.permissionGrantedNotification) {
        try {
          sendNotification({ title: title, body: text });
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      }
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('blur', this.handleMinimizeWindow.bind(this));
    // Clean up subscriptions or other resources if needed
  }
}

import { Component, OnInit } from '@angular/core';
import { MainContent } from "./main-content/main-content";
import { Auth } from '../core/services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MainContent, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  isAdmin: boolean = false;

  constructor(private auth: Auth) {}

  ngOnInit() {
    this.isAdmin = this.auth.isAdmin();
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { MENU_CONFIG } from '../../menu/menu.config';
import { MenuItem } from '../../menu/menu.model';
import { AuthStateService } from '../../auth/services/auth-state.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class SidebarComponent implements OnInit {
  visibleMenus: MenuItem[] = [];
  activeMenuId: string | null = null;

  constructor(
    private authState: AuthStateService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const user = this.authState.getUser();
    if (!user) return;

    const role = user.role;

    this.visibleMenus = MENU_CONFIG.filter((menu) => menu.roles.includes(role)).map((menu) => ({
      ...menu,
      children: menu.children
        ? menu.children.filter((child) => child.roles.includes(role))
        : undefined,
    }));

    // Synchronisation URL ↔ menu
    this.syncActiveMenuWithUrl(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.syncActiveMenuWithUrl(event.urlAfterRedirects);
      });
  }

  onMenuClick(item: MenuItem): void {
    if (item.isAction && item.id === 'logout') {
      this.authService.logout();
      return;
    }

    if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  private syncActiveMenuWithUrl(url: string): void {
    const allItems: MenuItem[] = [];

    this.visibleMenus.forEach((menu) => {
      if (menu.route) allItems.push(menu);
      if (menu.children) allItems.push(...menu.children);
    });

    const found = allItems.find((item) => item.route && url.startsWith(item.route));
    this.activeMenuId = found ? found.id : null;
  }
}
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { filter } from 'rxjs';

export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  expanded?: boolean;
  children?: MenuItem[];
}

@Component({
  selector: 'app-main',
  imports: [RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatExpansionModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {

  private breakpointObserver = inject(BreakpointObserver);

  isMobile = false;

  menus: MenuItem[] = [
        {
      label: 'Employees',
      icon: 'group',
      route: '/employees'
    },
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Users',
      icon: 'group',
      route: '/users'
    },
    {
      label: 'Settings',
      icon: 'settings',
      children: [
        {
          label: 'Profile',
          icon: 'person',
          route: '/settings/profile'
        },
        {
          label: 'Security',
          icon: 'security',
          route: '/settings/security'
        }
      ]
    },
    {
      label: 'Reports',
      icon: 'analytics',
      route: '/reports'
    }
  ];

  constructor(private router: Router) {
    this.breakpointObserver
      .observe('(max-width: 768px)')
      .subscribe(result => {
        this.isMobile = result.matches;
      });

    // Initial page load (refresh)
    this.expandActiveMenus(this.router.url);

    // Route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.expandActiveMenus(this.router.url);
      });
  }

  toggle(menu: MenuItem): void {
    menu.expanded = !menu.expanded;
  }

  private expandActiveMenus(url: string): void {

    this.menus.forEach(menu => {

      if (!menu.children) {
        return;
      }

      menu.expanded = menu.children.some(child =>
        url.startsWith(child.route!)
      );

    });

  }
}

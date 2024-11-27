import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'wc-dashboard-user',
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.scss']
})
export class DashboardUserComponent implements OnInit {
  currentRouteName: string = '';
  routePath: string = '';
  isWebsiteSubmenuOpen: boolean = false;
  isPengunjungSubmenuOpen: boolean = false; // State for Pengunjung submenu

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.setRouteName();
      this.setRoutePath();
    });

    this.setRouteName();
    this.setRoutePath();
  }

  private setRouteName(): void {
    const route = this.activatedRoute.firstChild?.snapshot.routeConfig?.path;
    this.currentRouteName = route ? this.capitalizeRouteName(route) : 'Dashboard';
  }

  private setRoutePath(): void {
    this.routePath = this.getFullRoutePath(this.activatedRoute);
  }

  private getFullRoutePath(route: ActivatedRoute | null): string {
    let path = '';
    while (route) {
      if (route.snapshot.routeConfig) {
        path += `/${route.snapshot.routeConfig.path}`;
      }
      route = route.firstChild;
    }
    return path;
  }

  private capitalizeRouteName(route: string): string {
    return route.charAt(0).toUpperCase() + route.slice(1);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  toggleWebsiteSubmenu(): void {
    this.isWebsiteSubmenuOpen = !this.isWebsiteSubmenuOpen;
  }

  togglePengunjungSubmenu(): void {
    this.isPengunjungSubmenuOpen = !this.isPengunjungSubmenuOpen;
  }
}

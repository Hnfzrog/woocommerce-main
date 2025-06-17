import { Component, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService, DashboardServiceType } from '../dashboard.service';

@Component({
  selector: 'wc-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnInit {
currentRouteName: string = '';
  routePath: string = '';
  isWebsiteSubmenuOpen: boolean = false;
  isPengunjungSubmenuOpen: boolean = false;
  isDropdownOpen = false;
  isSidebarOpen = false;
  dataAdmin: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private DashBoardSvc: DashboardService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.setRouteName();
      this.setRoutePath();
    });

    this.setRouteName();
    this.setRoutePath();
    this.getAdminProfile();
  }

   getAdminProfile() {
    this.DashBoardSvc.list(DashboardServiceType.ADM_IDX_DASHBOARD).subscribe(res => {
      const admin = res?.admin?.data[0] ?? [];
      this.dataAdmin = admin;
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  private setRouteName(): void {
    const route = this.activatedRoute.firstChild?.snapshot.routeConfig?.path;
    this.currentRouteName = route ? this.capitalizeRouteName(route) : 'Dashboard';
  }

  private setRoutePath(): void {
    this.routePath = this.getFullRoutePath(this.activatedRoute);

    // Ambil segmen terakhir dari path
    const segments = this.routePath.split('/');
    this.routePath = `/${segments[segments.length - 1]}`;

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

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.DashBoardSvc.create(DashboardServiceType.USER_LOGOUT, '').subscribe(
      () => {
        localStorage.removeItem('access_token')
        this.router.navigate(['']);
      },
    );
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

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target && !target.closest('.user-profile')) {
      this.isDropdownOpen = false;
    }
  }

  selectMenu(): void {
    this.isDropdownOpen = false;
  }

}

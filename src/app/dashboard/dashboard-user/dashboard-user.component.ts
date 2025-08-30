import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService, DashboardServiceType } from 'src/app/dashboard.service';

@Component({
  selector: 'wc-dashboard-user',
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.scss']
})
export class DashboardUserComponent implements OnInit {
  currentRouteName: string = '';
  routePath: string = '';
  isWebsiteSubmenuOpen: boolean = false;
  isPengunjungSubmenuOpen: boolean = false;
  isDropdownOpen = false;
  isSidebarOpen = false;
  userData: any;

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
    this.getUserProfile();
  }

  getUserProfile(): void {
    this.DashBoardSvc.list(DashboardServiceType.USER_PROFILE, '').subscribe(
      (res) => {
        this.userData = res.data;
      },
    );
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
    this.router.navigate(['/dashboard/profile']);
  }

  onClickBill(): void {
    this.router.navigate(['/dashboard/bill']);
  }
}

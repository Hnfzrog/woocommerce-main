import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'wc-dashboard-user',
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.scss']
})
export class DashboardUserComponent implements OnInit {
  currentRouteName: string = '';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.setRouteName();
    });

    this.setRouteName(); // Initial load
  }

  private setRouteName(): void {
    const route = this.activatedRoute.firstChild?.snapshot.routeConfig?.path;
    this.currentRouteName = route ? this.capitalizeRouteName(route) : 'Dashboard';
  }

  private capitalizeRouteName(route: string): string {
    return route.charAt(0).toUpperCase() + route.slice(1);
  }

}

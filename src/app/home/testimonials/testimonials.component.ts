import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardServiceType } from 'src/app/dashboard.service';

@Component({
  selector: 'wc-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit {

  paketList: any[] = [];

  constructor(
    private dashboardSvc: DashboardService
  ) { }

  ngOnInit(): void {
    this.getPaketUndangan();
  }

  getPaketUndangan() {
    this.dashboardSvc.list(DashboardServiceType.MNL_MD_PACK_INVITATION,).subscribe(res => {
      this.paketList = res?.data ?? [];
    });
  }

  getCardColor(id: number): string {
    switch (id) {
      case 1: return '#B5B2B2';
      case 2: return '#C47D13';
      case 3: return '#57B9EE';
      default: return '#ccc';
    }
  }

  onRedirectToRegister(): void {
    window.location.href = '/buat-undangan';
  }


}

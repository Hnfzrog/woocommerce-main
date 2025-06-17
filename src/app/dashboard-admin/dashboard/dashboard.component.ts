import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardServiceType } from 'src/app/dashboard.service';

@Component({
  selector: 'wc-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  rows: Array<any> = [];
  columns: Array<any> = [];
  paketList: any[] = [];


  user: any
  salary: any;
  total_users: any;
  pending_req: any;

  constructor(
    private dashboardSvc: DashboardService
  ) { }

  ngOnInit(): void {

    this.getPaketUndangan();
    this.columns = [
      { name: 'No Invoice', prop: 'invoice' },
      { name: 'Pengguna', prop: 'pengguna' },
      { name: 'Domain', prop: 'domain' },
      { name: 'Status', prop: 'status', type: 'html' }
    ];
  }

  getPaketUndangan() {
    this.dashboardSvc.list(DashboardServiceType.MNL_MD_PACK_INVITATION,).subscribe(res => {
      this.paketList = res?.data ?? [];
      this.getDetailUser();
    });
  }

  getDetailUser() {
    this.dashboardSvc.getParam(DashboardServiceType.ADM_IDX_DASHBOARD, '').subscribe(res => {
      const users = res?.users?.data ?? [];
      const activeUsers = users.filter((user: any) => user.kd_status === 'SB');
      this.salary = activeUsers.reduce((total: number, user: any) => {
        const paket = this.paketList.find(p => p.id == user.paket_undangan_id);
        const harga = paket ? parseFloat(paket.price) : 0;
        return total + harga;
      }, 0);

      this.total_users = res?.total_users ?? 0;
      this.pending_req = (res?.jumlah_belum_lunas_dan_pending?.BL ?? 0) +
        (res?.jumlah_belum_lunas_dan_pending?.MK ?? 0);

      this.rows = users.map((user: any) => ({
        invoice: user.kode_pemesanan ?? '–',
        pengguna: user.email ?? '–',
        domain: user.domain ?? '–',
        status: this.getStatusLabel(user.kd_status),
        konfirmasiAktif: user.kd_status === 'SB'
      }));
    });
  }


  getStatusLabel(code: string | null): string {
    switch (code) {
      case 'SB':
        return `<span class="status-badge aktif" aria-label="Status Aktif"><span class="dot"></span>Aktif</span>`;
      case 'MK':
        return `<span class="status-badge waiting" aria-label="Status Menunggu Konfirmasi"><span class="dot"></span>Menunggu Konfirmasi</span>`;
      case 'BL':
        return `<span class="status-badge unpaid" aria-label="Status Belum Lunas"><span class="dot"></span>Belum Lunas</span>`;
      case 'EX':
        return `<span class="status-badge expired" aria-label="Status Expired"><span class="dot"></span>Expired</span>`;
      default:
        return `<label class="status-badge pending">Belum selesai</label>`;
    }
  }

  onConfirmClicked(row: any) {
    console.log('Confirm action:', row);
  }

  onEditClicked(row: any) {
    console.log('Edit action:', row);
  }

  onDeleteClicked(row: any) {
    console.log('Delete action:', row);
  }

}

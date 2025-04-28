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

  user: any
  salary: any;
  total_users: any;
  pending_req: any;

  constructor(
    private dashboardSvc: DashboardService
  ) { }

  ngOnInit(): void {

    this.getDetailUser();

    this.columns = [
      { name: 'No Invoice', prop: 'invoice' },
      { name: 'Pengguna', prop: 'pengguna' },
      { name: 'Domain', prop: 'domain' },
      { name: 'Status', prop: 'status', type: 'html' }
    ];
  }

  getDetailUser(){
    this.dashboardSvc.getParam(DashboardServiceType.ADM_IDX_DASHBOARD, '').subscribe(res => {
      this.user = res?.users?.data;

      this.salary = res?.total_keuntungan;
      this.total_users = res?.total_users;
      this.pending_req = res?.jumlah_belum_lunas_dan_pending?.BL + res?.jumlah_belum_lunas_dan_pending?.MK

      this.rows = this.user.map((item: any) => {
        let obj = {
            invoice: item?.kode_pemesanan,
            pengguna: item?.email,
            domain: item?.domain,
            status: item?.kd_status
        }

        return obj;
      });
    })
  }

  public setStatusLabelTabel(val: string): string {
    switch (val) {
      case 'e':
        return '<label class="status-label expired">Proses Konseling</label>';
      case 'SDN':
        return '<label class="status-label aktif">Sudah dinilai</label>';
      case 'DIA':
        return '<label class="status-label menunggu-konfirmasi">Diajukan</label>';
      case 'RPKD':
        return '<label class="status-label belum-lunas">Rapat DKKED</label>';
      default:
        return '<label class="status-label label-gray">Tidak Diketahui</label>';
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

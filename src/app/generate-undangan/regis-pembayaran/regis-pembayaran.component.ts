import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DashboardService, DashboardServiceType } from 'src/app/dashboard.service';

@Component({
  selector: 'wc-regis-pembayaran',
  templateUrl: './regis-pembayaran.component.html',
  styleUrls: ['./regis-pembayaran.component.scss']
})
export class RegisPembayaranComponent implements OnInit {

  @Input() formData: any;
  @Output() prev = new EventEmitter<void>();

  events :any = [];
  selectedMethod: any;
  user: any;

  selectOptions: any = {
    payment: {
      items: [],
      defaultValue: [],
      FormControl: new FormControl(),
    }
  };

  constructor(
    private dashboardSvc : DashboardService,
  ) {}

  ngOnInit(): void {
    this.getMasterPayment()
  }

  getMasterPayment(){
    this.dashboardSvc.getParam(DashboardServiceType.MD_RGS_PAYMENT, '').subscribe((response) => {
        this.selectOptions.payment.items = response["data"];
        this.selectOptions.payment.items.unshift({
          id: "",
          name: "Semua kelompok pegawai",
        });
      });
  }

  getMasterMethod(){
    this.dashboardSvc.getParam(DashboardServiceType.MNL_MD_METHOD, '').subscribe(res => {
      this.events = res?.data;
    })
  }

  getDetailMethod(){
    const query = `?methode_pembayaran=${this.selectedMethod}`
    this.dashboardSvc.getParam(DashboardServiceType.MNL_MD_METHOD_DETAIL, query).subscribe(res => {
      this.user = res?.data;
    })
  }

  onMetodeSelect(event: any) {
    console.log(event);
    this.selectedMethod = event;
    this.getDetailMethod();
  }

    onBack(){
      this.prev.emit()
    }

    onNextClicked(){
      console.log('ini next');
      
    }
}

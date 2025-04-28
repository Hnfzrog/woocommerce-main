import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardServiceType } from '../../../dashboard.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Notyf } from 'notyf';

@Component({
  selector: 'wc-settings-payment',
  templateUrl: './settings-payment.component.html',
  styleUrls: ['./settings-payment.component.scss']
})
export class SettingsPaymentComponent implements OnInit {

  selectOptions: any = {
      payment: {
        items: [],
        defaultValue: [],
        FormControl: new FormControl(),
      }
    };

  methodSelected: any;
    
  formPayment!: FormGroup;
  listBank: any[] = [];

  private notyf : Notyf
  
  constructor(
    private fb: FormBuilder,
    private dashboardSvc: DashboardService
  ) { 
    this.notyf = new Notyf({
      duration: 3000,
      position: { x: 'right', y: 'top' }
    });
  }

  ngOnInit(): void {
    this.getMasterPayment();
  }

  getListBank() {
    this.dashboardSvc.list(DashboardServiceType.MD_LIST_BANK).subscribe((res) => {
      this.listBank = res?.data;
    });
  }

  getMasterPayment(){
      this.dashboardSvc.getParam(DashboardServiceType.MD_RGS_PAYMENT, '').subscribe((response) => {
          this.selectOptions.payment.items = response["data"];
        });
    }

    onMetodeSelect(data: any) {
      this.methodSelected = data;

      if(this.methodSelected === 1) {
        this.getListBank()
      }
      this.initForm();
    }
    

    initForm(){
      if (this.methodSelected === 1) {
        this.formPayment = this.fb.group({
          kode_bank : ['', Validators.required],
          nomor_rekening : ['', Validators.required],
          nama_pemilik : ['', Validators.required],
          photo_rek : ['.'],
        })
      } else if (this.methodSelected === 2) {
        this.formPayment = this.fb.group({
          url_tripay : ['', Validators.required],
          private_key : ['', Validators.required],
          api_key : ['', Validators.required],
          kode_merchant : ['', Validators.required],
          methode_pembayaran : ['Tripay', Validators.required],
          id_methode_pembayaran: ["2", Validators.required]
        }) 
      } else if (this.methodSelected === 3) {
        this.formPayment = this.fb.group({
          url : ['', Validators.required],
          servery_key : ['', Validators.required],
          client_key : ['', Validators.required],
          metode_production : ['', Validators.required],
        }) 
      } else if (this.methodSelected === 4) {

      }
    }

    onBankSelect(data:any){
      this.formPayment.get('kode_bank')?.setValue('data')
    }

    onSubmitPayment(){
      const formData = new FormData();

      const formValues = this.formPayment.value;

      for (const key in formValues) {
        if (formValues.hasOwnProperty(key)) {
          formData.append(key, formValues[key]);
        }
      }
      
      if (this.methodSelected === 1) {
        
      } else if (this.methodSelected === 2) {
        this.dashboardSvc.create(DashboardServiceType.ADM_TRIPAY_PAYMENT, formData).subscribe({
          next: (res) => {
            this.notyf.success(res?.message || 'Data berhasil disimpan.');
          },
          error: (err) => {
            this.notyf.error(err?.message || 'Ada kesalahan dalam sistem.');
            console.error('Error while submitting data:', err);
          }
        })
      } else if (this.methodSelected === 3) {
        this.dashboardSvc.create(DashboardServiceType.ADM_MIDTRANS_PAYMENT, formData).subscribe({
          next: (res) => {
            this.notyf.success(res?.message || 'Data berhasil disimpan.');
          },
          error: (err) => {
            this.notyf.error(err?.message || 'Ada kesalahan dalam sistem.');
            console.error('Error while submitting data:', err);
          }
        })
      }
    }
}

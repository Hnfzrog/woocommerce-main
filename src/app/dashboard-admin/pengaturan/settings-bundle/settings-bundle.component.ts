import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Notyf } from 'notyf';
import { DashboardService, DashboardServiceType } from 'src/app/dashboard.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'wc-settings-bundle',
  templateUrl: './settings-bundle.component.html',
  styleUrls: ['./settings-bundle.component.scss']
})
export class SettingsBundleComponent implements OnInit {

  silverForm!: FormGroup;
  goldForm!: FormGroup;
  platinumForm!: FormGroup;

  private notyf: Notyf;
  private modalRef?: BsModalRef

  constructor(
    private fb: FormBuilder,
    private dashboardSvc: DashboardService,
    private modalSvc: BsModalService
  ) { 
      this.notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });
  }

  ngOnInit(): void {
    this.initForms();
    this.getDataBundle();
  }

  initForms() {
    this.silverForm = this.fb.group({
      id: [null],
      name_paket: [''],
      price: [''],
      masa_aktif: [''],
      halaman_buku: [''],
      kirim_wa: [false],
      bebas_pilih_tema: [false],
      kirim_hadiah: [false],
      import_data: [false]
    });

    this.goldForm = this.fb.group({
      id: [null],
      name_paket: [''],
      price: [''],
      masa_aktif: [''],
      halaman_buku: [''],
      kirim_wa: [false],
      bebas_pilih_tema: [false],
      kirim_hadiah: [false],
      import_data: [false]
    });

    this.platinumForm = this.fb.group({
      id: [null],
      name_paket: [''],
      price: [''],
      masa_aktif: [''],
      halaman_buku: [''],
      kirim_wa: [false],
      bebas_pilih_tema: [false],
      kirim_hadiah: [false],
      import_data: [false]
    });
  }

  getDataBundle() {
    this.dashboardSvc.list(DashboardServiceType.ST_BUNDLE_ADMIN).subscribe((res) => {
      if (res?.data) {
        const [silver, gold, platinum] = res.data;

        this.silverForm.patchValue({
          id: silver.id,
          name_paket: silver.name_paket,
          price: silver.price,
          masa_aktif: silver.masa_aktif,
          halaman_buku: silver.halaman_buku,
          kirim_wa: silver.kirim_wa === 1,
          bebas_pilih_tema: silver.bebas_pilih_tema === 1,
          kirim_hadiah: silver.kirim_hadiah === 1,
          import_data: silver.import_data === 1
        });

        this.goldForm.patchValue({
          id: gold.id,
          name_paket: gold.name_paket,
          price: gold.price,
          masa_aktif: gold.masa_aktif,
          halaman_buku: gold.halaman_buku,
          kirim_wa: gold.kirim_wa === 1,
          bebas_pilih_tema: gold.bebas_pilih_tema === 1,
          kirim_hadiah: gold.kirim_hadiah === 1,
          import_data: gold.import_data === 1
        });

        this.platinumForm.patchValue({
          id: platinum.id,
          name_paket: platinum.name_paket,
          price: platinum.price,
          masa_aktif: platinum.masa_aktif,
          halaman_buku: platinum.halaman_buku,
          kirim_wa: platinum.kirim_wa === 1,
          bebas_pilih_tema: platinum.bebas_pilih_tema === 1,
          kirim_hadiah: platinum.kirim_hadiah === 1,
          import_data: platinum.import_data === 1
        });
      }
    });
  }

onClickSilver(){
    if (this.silverForm.valid) {
      const initialState = {
        message: 'Apakah anda ingin mengubah pengaturan paket 1 ini?',
        cancelClicked: () => '',
        submitClicked: () => this.saveSilver(),
        submitMessage: 'Simpan',
      };

      this.modalRef = this.modalSvc.show(ModalComponent, { initialState });

      if (this.modalRef?.content) {
        this.modalRef.content.onClose.subscribe((res: any) => {
          if (res?.state === 'delete') {
            console.log('Delete action triggered');
          } else if (res?.state === 'cancel') {
            this.modalRef?.hide();
          }
          this.modalRef?.hide();
        });
      }
    }
  }

onClickGold(){
    if (this.goldForm.valid) {
      const initialState = {
        message: 'Apakah anda ingin mengubah pengaturan paket 2 ini?',
        cancelClicked: () => '',
        submitClicked: () => this.saveGold(),
        submitMessage: 'Simpan',
      };

      this.modalRef = this.modalSvc.show(ModalComponent, { initialState });

      if (this.modalRef?.content) {
        this.modalRef.content.onClose.subscribe((res: any) => {
          if (res?.state === 'delete') {
            console.log('Delete action triggered');
          } else if (res?.state === 'cancel') {
            this.modalRef?.hide();
          }
          this.modalRef?.hide();
        });
      }
    }
  }

onClickPlatinum(){
    if (this.platinumForm.valid) {
      const initialState = {
        message: 'Apakah anda ingin mengubah pengaturan paket 3 ini?',
        cancelClicked: () => '',
        submitClicked: () => this.savePlatinum(),
        submitMessage: 'Simpan',
      };

      this.modalRef = this.modalSvc.show(ModalComponent, { initialState });

      if (this.modalRef?.content) {
        this.modalRef.content.onClose.subscribe((res: any) => {
          if (res?.state === 'delete') {
            console.log('Delete action triggered');
          } else if (res?.state === 'cancel') {
            this.modalRef?.hide();
          }
          this.modalRef?.hide();
        });
      }
    }
  }

  saveSilver() {
    console.log('Silver Paket:', this.silverForm.value);

    const uuid = this.silverForm.get('id')?.value || '1'

    this.dashboardSvc.update(DashboardServiceType.ST_BUNDLE_ADMIN, `/${uuid}`,this.silverForm.value).subscribe({
      next: (res) => {this.notyf.success(res?.message || 'Berhasil mengubah paket.'), window.location.reload();},
      error: (err) => this.notyf.error(err?.message || 'Gagal menyimpan cover.')
    })
  }

  saveGold() {
    console.log('Gold Paket:', this.goldForm.value);

    const uuid = this.goldForm.get('id')?.value || '2'

    this.dashboardSvc.update(DashboardServiceType.ST_BUNDLE_ADMIN, `/${uuid}`,this.goldForm.value).subscribe({
      next: (res) => {this.notyf.success(res?.message || 'Berhasil mengubah paket.'), window.location.reload();},
      error: (err) => this.notyf.error(err?.message || 'Gagal menyimpan cover.')
    })
  }

  savePlatinum() {
    console.log('Platinum Paket:', this.platinumForm.value);

    const uuid = this.platinumForm.get('id')?.value || '3'

    this.dashboardSvc.update(DashboardServiceType.ST_BUNDLE_ADMIN, `/${uuid}`,this.platinumForm.value).subscribe({
      next: (res) => {this.notyf.success(res?.message || 'Berhasil mengubah paket.'), window.location.reload();},
      error: (err) => this.notyf.error(err?.message || 'Gagal menyimpan cover.')
    })
  }
}

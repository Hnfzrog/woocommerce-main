import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Notyf } from 'notyf';
import { DashboardService, DashboardServiceType } from 'src/app/dashboard.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'wc-pengaturan',
  templateUrl: './pengaturan.component.html',
  styleUrls: ['./pengaturan.component.scss'],
})
export class PengaturanComponent implements OnInit {
  domainTokenForm: FormGroup;
  salamForm: FormGroup;
  formData?: FormData;


  filters = [
    { name: 'Halaman sampul', active: false },
    { name: 'Halaman Mempelai', active: false },
    { name: 'Halaman Acara', active: false },
    { name: 'Halaman Ucapan', active: false },
    { name: 'Halaman Gallery/Album', active: false },
    { name: 'Halaman Cerita', active: false },
    { name: 'Halaman Lokasi', active: false },
    { name: 'Halaman Prokes', active: false },
    { name: 'Halaman Kirim Hadiah', active: false },
    { name: 'Halaman Quote', active: false },
  ];

  private modalRef?: BsModalRef
  private notyf: Notyf;
  dataFilter: any;
  constructor(
    private fb: FormBuilder,
    private dashboardSvc: DashboardService,
    private modalSvc: BsModalService
  ) {
    this.domainTokenForm = this.fb.group({
      domain: ['', [Validators.required, Validators.required]],
      token: ['', Validators.required],
    });

    this.notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });

    this.salamForm = this.fb.group({
      salam_pembuka: [
        '',
        Validators.required,
      ],
      salam_tengah: ['', Validators.required],
      salam_bawah: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getValidFilter();
  }

  getValidFilter(){
    if (!this.dataFilter){
      this.getMasterFilter()
    }else{
      console.log(this.dataFilter);

    }
  }

  getMasterFilter(){
    const formData = new FormData;

    formData.append('', '')
    this.dashboardSvc.create(DashboardServiceType.SETTINGS_GET_FILTER, formData).subscribe(res => {
      this.dataFilter = res?.['data']
      this.getValidFilter()
    })
  }


  saveDomainToken() {
    if (this.domainTokenForm.valid) {

      const domain = this.domainTokenForm.value;
      const formData = new FormData();

      formData.append('domain', domain?.domain);
      formData.append('token', domain?.token)

      const initialState = {
        message: 'Apakah anda ingin menyimpan semua data domain and token?',
        cancelClicked: () => this.modalRef?.hide(),
        submitClicked: () => this.onSubmitForm(formData, 'domain'),
        submitMessage: 'Simpan',
      };

      this.modalRef = this.modalSvc.show(ModalComponent, { initialState });

      console.log('domains', domain);
    } else {
      console.error('Domain and Token form is invalid.');
    }
  }

  uploadMusic(event: any) {
    const file = event.target.files[0];
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
    const maxSizeInBytes = 5 * 1024 * 1024;

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        this.notyf.error('Jenis file tidak didukung. Hanya file musik (MP3, WAV, OGG) yang diperbolehkan.');
        return;
      }

      if (file.size > maxSizeInBytes) {
        this.notyf.error('Ukuran file terlalu besar. Maksimal 5 MB.');
        return;
      }

      const reader = new FileReader();


      reader.onload = () => {
        const base64String = reader.result as string;


        this.formData = new FormData();
        this.formData.append('musik', file);


        this.notyf.success('File musik berhasil diproses. Klik "Simpan" untuk melanjutkan.');
      };


      reader.readAsDataURL(file);
    } else {
      this.notyf.error('Tidak ada file yang dipilih.');
    }
  }


  submitMusic() {
    if (!this.formData) {
      this.notyf.error('Tidak ada file musik yang diproses. Silakan unggah file terlebih dahulu.');
      return;
    }


    const initialState = {
      message: 'Apakah anda ingin menyimpan file musik ini?',
      cancelClicked: () => this.modalRef?.hide(),
      submitClicked: () => this.onSubmitForm(this.formData as FormData, 'musik'),
      submitMessage: 'Simpan',
    };

    this.modalRef = this.modalSvc.show(ModalComponent, { initialState });
  }


  saveSalam() {
    if (this.salamForm.valid) {
      const salam = this.salamForm.value;
      const formData = new FormData();

      formData.append('salam_pembuka', salam?.salam_pembuka);
      formData.append('salam_tengah', salam?.salam_tengah);
      formData.append('salam_bawah', salam?.salam_bawah);

      const initialState = {
        message: 'Apakah anda ingin menyimpan semua data salam?',
        cancelClicked: () => this.modalRef?.hide(),
        submitClicked: () => this.onSubmitForm(formData, 'salam'),
        submitMessage: 'Simpan',
      };

      this.modalRef = this.modalSvc.show(ModalComponent, { initialState });

      console.log('domains', salam);
    } else {
      console.error('Salam form is invalid.');
    }
  }


  applyFilters() {
    const selectedFilters = this.filters.filter(filter => filter.active).map(filter => filter.name);
    console.log('Selected filters:', selectedFilters);
  }

  onSubmitForm(formData: FormData, query: any){
    console.log(query);
    this.dashboardSvc.createParam(DashboardServiceType.SETTINGS_SUBMIT, formData, query).subscribe({
      next: (res) => {
        this.notyf.success(res?.message || 'Data berhasil disimpan.');
        this.modalRef?.hide();
        window.location.reload();
      },
      error: (err) => {
        this.notyf.error(err?.message || 'Ada kesalahan dalam sistem.');
        console.error('Error while submitting data:', err);
      }
    })
  }
}

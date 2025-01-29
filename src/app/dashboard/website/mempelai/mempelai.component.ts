import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Notyf } from 'notyf';
import { DashboardService, DashboardServiceType } from 'src/app/dashboard.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'wc-mempelai',
  templateUrl: './mempelai.component.html',
  styleUrls: ['./mempelai.component.scss']
})
export class MempelaiComponent implements OnInit {
  coverPhotoForm: FormGroup;
  dualSectionForm: FormGroup;

  coverPhotoPreview: string = '';
  groomPhotoPreview: string = '';
  bridePhotoPreview: string = '';

  events = [
    { id: '1', name: 'Pria-Wanita' },
    { id: '2', name: 'Wanita-Pria' },
  ];

  private notyf: Notyf;
  private modalRef?: BsModalRef
  data: any;

  constructor(
    private fb: FormBuilder,
    private dashboardSvc: DashboardService,
    private modalSvc: BsModalService
  ) {
    this.coverPhotoForm = this.fb.group({
      cover_photo: [null],
      urutan_mempelai: ['']
    });

    this.dualSectionForm = this.fb.group({
      photo_pria: [null],
      photo_wanita: [null],
      name_lengkap_pria: [''],
      name_panggilan_pria: [''],
      ayah_pria: [''],
      ibu_pria: [''],
      name_lengkap_wanita: [''],
      name_panggilan_wanita: [''],
      ayah_wanita: [''],
      ibu_wanita: ['']
    });

    this.notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });
  }

  ngOnInit(): void {
    this.getDataMempelai();
  }

  getDataMempelai(): void {
    this.dashboardSvc.list(DashboardServiceType.MEMPELAI_DATA).subscribe({
      next: (res) => {
        this.data = res['data'][0]; // Asumsikan data pertama yang diambil
        const data = this.data
        if (data) {

          
          // Isi coverPhotoForm
          this.coverPhotoForm.patchValue({
            cover_photo: data.cover_photo,
            urutan_mempelai: data.urutan_mempelai,
          });
  
          // Isi dualSectionForm
          this.dualSectionForm.patchValue({
            photo_pria: data.photo_pria,
            photo_wanita: data.photo_wanita,
            name_lengkap_pria: data.name_lengkap_pria,
            name_panggilan_pria: data.name_panggilan_pria,
            ayah_pria: data.ayah_pria,
            ibu_pria: data.ibu_pria,
            name_lengkap_wanita: data.name_lengkap_wanita,
            name_panggilan_wanita: data.name_panggilan_wanita,
            ayah_wanita: data.ayah_wanita,
            ibu_wanita: data.ibu_wanita,
          });
  
          // Update preview foto
          this.coverPhotoPreview = data.cover_photo;
          this.groomPhotoPreview = data.photo_pria;
          this.bridePhotoPreview = data.photo_wanita;
          
        }
      },
      error: (err) => {
        console.error('Gagal mendapatkan data mempelai:', err);
      },
    });
  }

  handlePhotoUpload(event: Event, controlName: string): void {
    const fileInput = event.target as HTMLInputElement;
  
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
  
      // Validasi file
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      const maxSize = 2 * 1024 * 1024; // 2 MB
  
      if (!allowedTypes.includes(file.type)) {
        this.notyf.error('Jenis file tidak valid. Silakan pilih file gambar.');
        fileInput.value = '';
        return;
      }
  
      if (file.size > maxSize) {
        this.notyf.error('Ukuran file melebihi batas 2MB.');
        fileInput.value = '';
        return;
      }
  
      // Langsung simpan file dalam FormData
      switch (controlName) {
        case 'cover_photo':
          this.coverPhotoPreview = URL.createObjectURL(file); // Untuk preview
          this.coverPhotoForm.patchValue({ cover_photo: file }); // Update form dengan file
          break;
  
        case 'photo_pria':
          this.groomPhotoPreview = URL.createObjectURL(file); // Untuk preview
          this.dualSectionForm.patchValue({ photo_pria: file }); // Update form dengan file
          break;
  
        case 'photo_wanita':
          this.bridePhotoPreview = URL.createObjectURL(file); // Untuk preview
          this.dualSectionForm.patchValue({ photo_wanita: file }); // Update form dengan file
          break;
      }
    }
  }  
  
  onEventSelect(event: any): void {
    this.coverPhotoForm.patchValue({
      urutan_mempelai: event
    });
    console.log('Selected Event:', event);
  }

  onClickCover(){
    if (this.coverPhotoForm.valid) {
      const initialState = {
        message: 'Apakah anda ingin mengunggah cover photo?',
        cancelClicked: () => '',
        submitClicked: () => this.saveCoverPhoto(),
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

  onClickDataMempelai(){
    if (this.dualSectionForm.valid) {
      const initialState = {
        message: 'Apakah anda ingin menyimpan semua data mempelai?',
        cancelClicked: () => '',
        submitClicked: () => this.saveDualSectionData(),
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

 
onCoverUpdate(data: any){
    if (this.coverPhotoForm.valid) {
      const initialState = {
        message: 'Apakah anda ingin mengunggah cover photo?',
        cancelClicked: () => '',
        submitClicked: () => this.updateCover(data?.id),
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

  onMempelaiUpdate(data: any){
    if (this.dualSectionForm.valid) {
      const initialState = {
        message: 'Apakah anda ingin mengunggah cover photo?',
        cancelClicked: () => '',
        submitClicked: () => this.updateMempelai(data?.id),
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

  saveCoverPhoto(): void {
    const formData = new FormData();
    const coverPhotoData = this.coverPhotoForm.value;
  
    const payload = {
      cover_photo: coverPhotoData.cover_photo, // Base64 string
      urutan_mempelai: coverPhotoData.urutan_mempelai
    };
  
    formData.append('cover_photo', coverPhotoData.cover_photo);
    formData.append('urutan_mempelai', coverPhotoData.urutan_mempelai);
  
    this.dashboardSvc.create(DashboardServiceType.MEMPELAI_SUBMIT_COVER, formData).subscribe({
      next: (res) => {this.notyf.success(res?.message || 'Cover berhasil disimpan.'), window.location.reload();},
      error: (err) => this.notyf.error(err?.message || 'Gagal menyimpan cover.')
    });
  }
  
  saveDualSectionData(): void {
    const dualSectionFormValue = this.dualSectionForm.value;
    const formData = new FormData();
  
    // Tambahkan file binary atau objek File dan data lainnya ke FormData
    formData.append('photo_pria', dualSectionFormValue.photo_pria); // File binary atau objek File
    formData.append('photo_wanita', dualSectionFormValue.photo_wanita); // File binary atau objek File
    formData.append('name_lengkap_pria', dualSectionFormValue.name_lengkap_pria);
    formData.append('name_panggilan_pria', dualSectionFormValue.name_panggilan_pria);
    formData.append('ayah_pria', dualSectionFormValue.ayah_pria);
    formData.append('ibu_pria', dualSectionFormValue.ibu_pria);
    formData.append('name_lengkap_wanita', dualSectionFormValue.name_lengkap_wanita);
    formData.append('name_panggilan_wanita', dualSectionFormValue.name_panggilan_wanita);
    formData.append('ayah_wanita', dualSectionFormValue.ayah_wanita);
    formData.append('ibu_wanita', dualSectionFormValue.ibu_wanita);
  
    // Kirim data ke server menggunakan DashboardService
    this.dashboardSvc.create(DashboardServiceType.MEMPELAI_SUBMIT, formData).subscribe({
      next: (res) => {
        this.notyf.success(res?.message || 'Data mempelai berhasil disimpan.');
        window.location.reload();
      },
      error: (err) => {
        this.notyf.error(err?.message || 'Gagal menyimpan data mempelai.');
      }
    });
  }
  
  
  updateCover(data: any): void {
    const coverPhotoData = this.coverPhotoForm.value;
    const formData = new FormData();
  
    // Tambahkan file dan data lainnya ke FormData
    formData.append('cover_photo', coverPhotoData.cover_photo); // File binary atau objek File
    formData.append('urutan_mempelai', coverPhotoData.urutan_mempelai);
  
    const param = `/cover/${data}`;
    this.dashboardSvc.update(DashboardServiceType.MEMPELAI_UPDATE, param, formData).subscribe({
      next: (res) => {
        this.notyf.success(res?.message || 'Cover berhasil diperbarui.');
        window.location.reload();
      },
      error: (err) => this.notyf.error(err?.message || 'Gagal memperbarui cover.')
    });
  }
  
  updateMempelai(data: any): void {
    const dualSectionFormValue = this.dualSectionForm.value;
    const formData = new FormData();
  
    // Tambahkan file binary atau objek File dan data lainnya ke FormData
    formData.append('photo_pria', dualSectionFormValue.photo_pria); // File binary atau objek File
    formData.append('photo_wanita', dualSectionFormValue.photo_wanita); // File binary atau objek File
    formData.append('name_lengkap_pria', dualSectionFormValue.name_lengkap_pria);
    formData.append('name_panggilan_pria', dualSectionFormValue.name_panggilan_pria);
    formData.append('ayah_pria', dualSectionFormValue.ayah_pria);
    formData.append('ibu_pria', dualSectionFormValue.ibu_pria);
    formData.append('name_lengkap_wanita', dualSectionFormValue.name_lengkap_wanita);
    formData.append('name_panggilan_wanita', dualSectionFormValue.name_panggilan_wanita);
    formData.append('ayah_wanita', dualSectionFormValue.ayah_wanita);
    formData.append('ibu_wanita', dualSectionFormValue.ibu_wanita);
  
    const param = `/mempelai/${data}`;
    this.dashboardSvc.update(DashboardServiceType.MEMPELAI_UPDATE, param, formData).subscribe({
      next: (res) => {
        this.notyf.success(res?.message || 'Data mempelai berhasil diperbarui.');
        window.location.reload();
      },
      error: (err) => this.notyf.error(err?.message || 'Gagal memperbarui data mempelai.')
    });
  }
  
}

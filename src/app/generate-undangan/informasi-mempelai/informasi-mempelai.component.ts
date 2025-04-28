import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalUploadGaleriComponent } from '../modal-upload-galeri/modal-upload-galeri.component';
import { DashboardService, DashboardServiceType } from '../../dashboard.service';
import { Notyf } from 'notyf';

@Component({
  selector: 'wc-informasi-mempelai',
  templateUrl: './informasi-mempelai.component.html',
  styleUrls: ['./informasi-mempelai.component.scss']
})
export class InformasiMempelaiComponent implements OnInit {
  @Input() formData: any = {};
  @Output() formDataChange = new EventEmitter<any>();
  @Output() next = new EventEmitter<any>();
  @Output() prev = new EventEmitter<void>();

  formGroup!: FormGroup;
  modalRef?: BsModalRef;
  private notyf: Notyf;

  // Menyimpan preview gambar
  imagePreviews: { [key: string]: string | null } = {
    photo_pria: null,
    photo_wanita: null,
    cover_photo: null
  };

  constructor(
    private fb: FormBuilder, 
    private modalSvc: BsModalService,
    private dashboardSvc: DashboardService
  ) {
    this.notyf = new Notyf({
      duration: 3000,
      position: { x: 'right', y: 'top' }
    });
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name_lengkap_pria: ['', Validators.required],
      name_panggilan_pria: ['', Validators.required],
      ayah_pria: ['', Validators.required],
      ibu_pria: ['', Validators.required],
      name_lengkap_wanita: ['', Validators.required],
      name_panggilan_wanita: ['', Validators.required],
      ayah_wanita: ['', Validators.required],
      ibu_wanita: ['', Validators.required],
      photo_pria: [null], 
      photo_wanita: [null],
      cover_photo: [null]
    });

    this.formGroup.valueChanges.subscribe((value) => {
      this.formDataChange.emit(value);
    });
  }

  onFileSelected(event: any, controlName: string) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      this.notyf.error('Format gambar tidak didukung. Gunakan PNG atau JPG.');
      return;
    }

    if (file.size > maxSize) {
      this.notyf.error('Ukuran file maksimal 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      
      // Simpan preview tanpa mengubah nilai di formGroup
      this.imagePreviews[controlName] = base64String;

      // Simpan base64 (tanpa prefix) di formGroup untuk dikirim ke backend
      this.formGroup.patchValue({ [controlName]: base64String.split(',')[1] }); 
    };
    reader.readAsDataURL(file);
  }

  onNext() {
    this.modalRef = this.modalSvc.show(ModalUploadGaleriComponent, {
      initialState: { formData: { ...this.formGroup.value } },
      class: 'modal-lg'
    });

    this.modalRef.content?.formDataChange.subscribe((updatedData: any) => {
      this.formGroup.patchValue(updatedData);
      this.formDataChange.emit(updatedData);
      this.next.emit(updatedData);
    });
  }

  onBack() {
    this.prev.emit();
  }

  onNextClicked() {
    const payload = new FormData();

    Object.keys(this.formGroup.value).forEach((key) => {
      const value = this.formGroup.get(key)?.value;
      
      if (key.includes('photo') && typeof value === 'string') {
        const byteCharacters = atob(value);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });
        payload.append(key, blob, `${key}.png`);
      } else {
        payload.append(key, value);
      }
    });

    this.dashboardSvc.create(DashboardServiceType.MNL_STEP_TWO, payload).subscribe({
      next: (res) => {
        this.notyf.success(res?.message || 'Data berhasil disimpan.');
        setTimeout(() => this.onNext(), 3000);
      },
      error: (err) => {
        this.notyf.error(err?.message || 'Ada kesalahan dalam sistem.');
        console.error('Error while submitting data:', err);
      }
    });
  }
}

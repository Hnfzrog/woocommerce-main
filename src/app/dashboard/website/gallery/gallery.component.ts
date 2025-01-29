import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Notyf } from 'notyf';
import { DashboardService, DashboardServiceType } from 'src/app/dashboard.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'wc-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  galleryForm: FormGroup;
  uploadStatus: string | null = null;
  isDraggingOver = false;
  uploadedFiles: { name: string; base64: string; status: string }[] = [];

  private notyf: Notyf;
  private modalRef?: BsModalRef;

  constructor(
    private dashboardSvc: DashboardService,
    private modalSvc: BsModalService
  ) {
    this.notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });

    this.galleryForm = new FormGroup({
      photo: new FormControl(null, Validators.required),
      url_video: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  browseFiles() {
    document.getElementById('fileInput')?.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFiles(input.files);
    }
  }
  

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDraggingOver = true;
  }

  onDragLeave() {
    this.isDraggingOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDraggingOver = false;
    if (event.dataTransfer?.files.length) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  handleFiles(files: FileList) {
    // Iterate over the FileList directly (it can be indexed like an array)
    for (let i = 0; i < files.length; i++) {
      const file = files[i];  // file is of type File
      if (this.validateFile(file)) {
        this.galleryForm.get('photo')?.setValue(file); // Use the File object directly
        this.uploadStatus = `File "${file.name}" selected successfully.`;
      }
    }
  }
  

  validateFile(file: File): boolean {
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      this.uploadStatus = `Error: File type "${file.type}" not supported.`;
      return false;
    }

    if (file.size > maxFileSize) {
      this.uploadStatus = `Error: File size of "${file.name}" exceeds 5MB.`;
      return false;
    }

    return true;
  }

  handleCancelClicked() {
    console.log('Cancel clicked');
  }

  onSubmit() {
    console.log('Submit clicked');

    if (this.galleryForm.valid) {
      const initialState = {
        message: 'Apakah anda ingin menyimpan semua data gallery?',
        cancelClicked: () => '',
        submitClicked: () => this.onSubmitForm(),
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

  onSubmitForm() {
    const formData = new FormData();

    const photoFile = this.galleryForm.get('photo')?.value;
    const urlVideo = this.galleryForm.get('url_video')?.value;

    // Append the actual file (not base64 string)
    if (photoFile) {
      formData.append('photo', photoFile, photoFile.name); // 'photo' is the field name expected by the backend
    }
    formData.append('url_video', urlVideo || '');

    // Submit the form data
    this.dashboardSvc.create(DashboardServiceType.GALERY_SUBMIT, formData).subscribe({
      next: (res) => {
        this.notyf.success(res?.message || 'Data berhasil disimpan.');
        this.galleryForm.reset();
      },
      error: (err) => {
        this.notyf.error(err?.message || 'Ada kesalahan dalam sistem.');
        console.error('Error while submitting data:', err);
      }
    });
  }
}

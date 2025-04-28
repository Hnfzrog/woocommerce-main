import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Notyf } from 'notyf';
import { DashboardService, DashboardServiceType } from '../../dashboard.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'wc-regis-cerita',
  templateUrl: './regis-cerita.component.html',
  styleUrls: ['./regis-cerita.component.scss']
})
export class RegisCeritaComponent implements OnInit {
  @Input() formData: any = { title: [], lead_cerita: [], tanggal_cerita: [], status: false };
  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<any>();

  form!: FormGroup;

  bsConfig = {
    dateInputFormat: 'DD MMMM YYYY',
    containerClass: 'theme-default',
    showWeekNumbers: false,
    adaptivePosition: true,
    todayBtn: true,
    clearBtn: true
  };

  private notyf : Notyf

  private modalRef?: BsModalRef

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
    this.form = this.fb.group({
      stories: this.fb.array([]),
      status: new FormControl(this.formData.status || false)
    });

    // Jika data sudah ada, load ke formArray
    if (this.formData.title && this.formData.title.length) {
      for (let i = 0; i < this.formData.title.length; i++) {
        this.addStory({
          title: this.formData.title[i] || '',
          lead_cerita: this.formData.lead_cerita[i] || '',
          tanggal_cerita: this.formData.tanggal_cerita[i] || ''
        });
      }
    } else {
      this.addStory(); // default tambah 1 form kosong
    }
  }

  get stories(): FormArray {
    return this.form.get('stories') as FormArray;
  }

  addStory(data: any = { title: '', lead_cerita: '', tanggal_cerita: '' }): void {
    if (this.stories.length < 2) {
      this.stories.push(
        this.fb.group({
          title: [data.title, Validators.required],
          lead_cerita: [data.lead_cerita, [Validators.required, Validators.maxLength(500)]],
          tanggal_cerita: [data.tanggal_cerita, Validators.required]
        })
      );
    }
  }

  removeStory(index: number): void {
    this.stories.removeAt(index);
  }

  submit(): void {
    if (this.form.invalid) {
      this.notyf.error('Harap isi semua bidang')
      this.form.markAllAsTouched();
      return;
    } else {
      const initialState = {
        message: 'Apakah anda ingin menyimpan data cerita?',
        cancelClicked: () => this.handleCancelClicked(),
        submitClicked: () => this.saveCerita(),
        submitMessage: 'Simpan',
      };

      this.modalRef = this.modalSvc.show(ModalComponent, { initialState });

      if (this.modalRef?.content) {
        this.modalRef.content.onClose.subscribe((res: any) => {
          if (res?.state === 'delete') {
            console.log('Delete action triggered');
          } else if (res?.state === 'cancel') {
            console.log('Action canceled');
          }
          this.modalRef?.hide();
        });
      }
    }
  
  }
  
  handleCancelClicked(){

  }
  
  saveCerita(){
    const rawStories = this.stories.value; // Ambil array of objects
    const status = this.form.get('status')?.value;
  
    const payload = new FormData();
  
    rawStories.forEach((item: any, index: number) => {
      payload.append(`title[${index}]`, item.title);
      payload.append(`lead_cerita[${index}]`, item.lead_cerita);
  
      // Konversi tanggal ke format YYYY-MM-DD
      const date = new Date(item.tanggal_cerita);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const formattedDate = `${year}-${month}-${day}`;
      payload.append(`tanggal_cerita[${index}]`, formattedDate);
    });
  
    payload.append('status', status ? '1' : '0');

    this.dashboardSvc.create(DashboardServiceType.MNL_STEP_FOUR, payload).subscribe({
      next: (res) => {
        this.notyf.success(res?.message || 'Data berhasil disimpan.');
        this.next.emit(rawStories)
      },
      error: (err) => {
        this.notyf.error(err?.message || 'Ada kesalahan dalam sistem.');
        console.error('Error while submitting data:', err);
      }
    })
  }
}

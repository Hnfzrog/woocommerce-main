import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Notyf } from 'notyf';
import { DashboardService, DashboardServiceType } from 'src/app/dashboard.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'wc-cerita-quote',
  templateUrl: './cerita-quote.component.html',
  styleUrls: ['./cerita-quote.component.scss'],
})
export class CeritaQuoteComponent implements OnInit {
  ceritaForm!: FormGroup;
  quoteForm!: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;

  private notyf: Notyf;
  
  private modalRef? : BsModalRef

  constructor(
    private fb: FormBuilder,
    private dashboardSvc: DashboardService,
    private modalSvc: BsModalService
  ) {
    
    this.notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });

    this.bsConfig = {
      dateInputFormat: 'DD MMMM YYYY',
      containerClass: 'theme-dark-blue',
      isAnimated: true,
      adaptivePosition: true,
      showTodayButton: true,
      showClearButton: true,
    };
  }

  ngOnInit(): void {
    this.ceritaForm = this.fb.group({
      ceritaList: this.fb.array([this.createCerita()]),
    });

    this.quoteForm = this.fb.group({
      name: ['', Validators.required],
      quote: ['', Validators.required], 
    });
  }

  get ceritaFormArray(): FormArray {
    return this.ceritaForm.get('ceritaList') as FormArray;
  }

  getCeritaFormGroup(index: number): FormGroup {
    return this.ceritaFormArray.at(index) as FormGroup;
  }

  createCerita(): FormGroup {
    return this.fb.group({
      tanggal: ['', Validators.required],
      judul: ['', Validators.required],
      isiCerita: ['', Validators.required],
    });
  }

  addCerita(): void {
    this.ceritaFormArray.push(this.createCerita());
  }

  removeCerita(index: number): void {
    this.ceritaFormArray.removeAt(index);
  }

  onDateChange(date: Date | null, index: number): void {
    const formattedDate = this.formatDate(date);
    console.log('Date changed for cerita at index', index, ':', formattedDate);
  }

  onSubmitCerita(): void {
    if (this.ceritaForm.valid) {
      const initialState = {
        message: 'Apakah anda ingin menyimpan cerita?',
        cancelClicked: () => this.handleCancelClicked(),
        submitClicked: () => this.SubmitCerita(),
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
    } else {
      this.ceritaForm.markAllAsTouched();
    }
  }

  SubmitCerita() {
    const formData = new FormData();
    
    this.ceritaFormArray.controls.forEach((control: AbstractControl, index: number) => {
      const group = control as FormGroup;
      const ceritaData = group.value;
  
      const formattedDate = this.formatDate(ceritaData.tanggal) || '';
  
      formData.append(`title[${index}]`, ceritaData.judul);
      formData.append(`lead_cerita[${index}]`, ceritaData.isiCerita);
      formData.append(`tanggal_cerita[${index}]`, formattedDate);
    });
    
    this.dashboardSvc.create(DashboardServiceType.CERITA_SUBMIT, formData).subscribe({
      next: (res) => {
        this.notyf.success(res?.message || 'Data berhasil disimpan.');
        this.ceritaForm.reset();
      },
      error: (err) => {
        this.notyf.error(err?.message || 'Ada kesalahan dalam sistem.');
        console.error('Error while submitting data:', err);
      }
    });
  }  

  handleCancelClicked() {
    console.log('Cancel clicked');
  }

  onSubmitQuote(): void {
    if (this.quoteForm.valid) {
      const initialState = {
        message: 'Apakah anda ingin menyimpan quote?',
        cancelClicked: () => this.handleCancelClicked(),
        submitClicked: () => this.SubmitQuote(),
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
    } else {
      this.quoteForm.markAllAsTouched();
    }
  }

  SubmitQuote(){
    const formData = new FormData();

    const quote = this.quoteForm.value;
    formData.append('name', quote?.name);
    formData.append('qoute', quote?.quote);

    this.dashboardSvc.create(DashboardServiceType.QUOTE_SUBMIT, formData).subscribe({
      next: (res) => {
        this.notyf.success(res?.message || 'Data berhasil disimpan.');
        this.quoteForm.reset();
      },
      error: (err) => {
        this.notyf.error(err?.message || 'Ada kesalahan dalam sistem.');
        console.error('Error while submitting data:', err);
      }
    })

  }

  formatDate(date: string | Date | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear();

    return `${year}-${month}-${day}`;
  }
}

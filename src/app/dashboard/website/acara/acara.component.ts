import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Notyf } from 'notyf';
import { DashboardService, DashboardServiceType } from 'src/app/dashboard.service';

@Component({
  selector: 'wc-acara',
  templateUrl: './acara.component.html',
  styleUrls: ['./acara.component.scss'],
})
export class AcaraComponent implements OnInit {
  staticEventForm!: FormGroup;
  dynamicEventForm!: FormGroup;

  events: { id: string | null; name: string }[] = [];
  bsConfig!: Partial<BsDatepickerConfig>;

  private notyf!: Notyf;
  selectedEvent: string | null = null; // Track selected event for static event form
  data: any;

  constructor(private fb: FormBuilder, private dashboardSvc: DashboardService) {
    this.notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });
  }

  ngOnInit(): void {
    this.initForms();
    this.dynamicEvents.push(this.createDynamicEventForm());

    this.events = [
      { id: '1', name: 'Pria-Wanita' },
      { id: '2', name: 'Wanita-Pria' },
    ];

    this.validateData();
  }

  validateData(){
    this.fetchInitialData();

    if(this.data){
      console.log('this.data');

      const formGroups = this.data.map((acara: any) =>
        this.fb.group({
          name: [acara.nama_acara || '', Validators.required],
          date: [acara.tanggal_acara ? new Date(acara.tanggal_acara) : null, Validators.required],
          startTime: [acara.start_acara || '', Validators.required],
          endTime: [acara.end_acara || '', Validators.required],
          location: [acara.alamat || '', Validators.required],
          mapLink: [acara.link_maps || '', Validators.required],
        })
      );

      // Set hasil mapping ke FormArray
      this.dynamicEventForm.setControl('dynamicEvents', this.fb.array(formGroups));
      
    }else{
      console.log('no data');
      
      this.dynamicEventForm.setControl('dynamicEvents', this.fb.array([this.createDynamicEventForm()])
      );
    }
  }

  private initForms(): void {
    this.staticEventForm = this.fb.group({
      selectedEvent: [null, Validators.required],
    });

    this.dynamicEventForm = this.fb.group({
      dynamicEvents: this.fb.array([this.createDynamicEventForm()]), // Initialize with one event form
    });

    this.bsConfig = {
      dateInputFormat: 'DD MMMM YYYY',
      showTodayButton: true,
      isAnimated: true,
      containerClass: 'theme-dark-blue',
    };
  }

  get dynamicEvents(): FormArray {
    return this.dynamicEventForm.get('dynamicEvents') as FormArray;
  }

  private createDynamicEventForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      date: [null, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      location: ['', Validators.required],
      mapLink: ['', Validators.required],
    });
  }

  addDynamicEvent(): void {
    this.dynamicEvents.push(this.createDynamicEventForm());
    console.log(this.dynamicEvents.controls);  // Check the updated form array
  }

  deleteDynamicEvent(index: number): void {
    if (this.dynamicEvents.length > 1) {
      this.dynamicEvents.removeAt(index);
    }
  }

  fetchInitialData(): void {
    this.dashboardSvc.list(DashboardServiceType.ACARA_DATA).subscribe({
      next: (res) => {
        this.data = res?.data?.acaras;
  
    }
  });
  }
  
  onEventSelect(event: string): void {
    this.selectedEvent = event;
    console.log('Selected event:', event);
  }

  submitStaticEventForm(): void {
    if (this.staticEventForm.valid) {
      const staticForm = this.staticEventForm.value;
      const formData = new FormData();
      formData.append('name_countdown', staticForm.selectedEvent);

      this.dashboardSvc.create(DashboardServiceType.ACARA_SUBMIT_COUNTDOWN, formData).subscribe({
        next: (res) => this.notyf.success(res?.message || 'Data mempelai berhasil disimpan.'),
        error: (err) => this.notyf.error(err?.message || 'Gagal menyimpan data mempelai.'),
      });
    }
  }

  submitDynamicEventForm(): void {
    if (this.dynamicEventForm.valid) {
      const events = this.dynamicEvents.value as Array<Record<string, any>>;
      const formData = new FormData();

      events.forEach((event, index) => {
        Object.keys(event).forEach((key) => {
          const value = key === 'date' && event[key] 
            ? new Date(event[key]).toISOString().split('T')[0] 
            : event[key];
          formData.append(`data[${index}][${key}]`, value || '');
        });
      });

      this.dashboardSvc.create(DashboardServiceType.ACARA_SUBMIT_DYNAMIC, formData).subscribe({
        next: (res) => this.notyf.success(res?.message || 'Data acara berhasil disimpan.'),
        error: (err) => this.notyf.error(err?.message || 'Gagal menyimpan data acara.'),
      });
    } else {
      this.notyf.error('Form tidak valid. Harap periksa data acara.');
    }
  }
}

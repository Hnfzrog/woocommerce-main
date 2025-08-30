import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Notyf } from 'notyf';
import { DashboardService, DashboardServiceType } from '../../../dashboard.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'wc-rekening',
  templateUrl: './rekening.component.html',
  styleUrls: ['./rekening.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class RekeningComponent implements OnInit {
  rekeningForm!: FormGroup;
  listBank: any[] = [];
  private notyf: Notyf;
  private modalRef?: BsModalRef;
  data: any;
  maxRekening = 2;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dashboardSvc: DashboardService,
    private modalSvc: BsModalService
  ) {
    this.notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });
  }

  ngOnInit() {
  this.getListBank();
  this.getDataRekening();
    this.rekeningForm = this.fb.group({
      accounts: this.fb.array([])
    });
  }

  get accounts(): FormArray {
    return this.rekeningForm.get('accounts') as FormArray;
  }

  createAccountFormGroup(data?: any): FormGroup {
    return this.fb.group({
      kode_bank: [data?.kode_bank || '', Validators.required],
      nomor_rekening: [data?.nomor_rekening || '', Validators.required],
      nama_pemilik: [data?.nama_pemilik || '', Validators.required],
      photo_rek: [data?.photo_rek || null],
      id: [data?.id || null],
      editMode: [false]
    });
  }

  getListBank() {
    this.dashboardSvc.list(DashboardServiceType.MD_LIST_BANK).subscribe((res) => {
      this.listBank = res?.data;
    });
  }

  getDataRekening() {
    this.isLoading = true;
    // Use new JSON index endpoint
    this.dashboardSvc.list(DashboardServiceType.REKENINGS_INDEX).subscribe({
      next: (res) => {
        this.data = res?.data || [];
        this.accounts.clear();
        if (this.data.length > 0) {
          this.data.slice(0, this.maxRekening).forEach((item: any) => {
            this.accounts.push(this.createAccountFormGroup(item));
          });
        }
        // If less than max, allow add new
        if (this.accounts.length < this.maxRekening) {
          this.accounts.push(this.createAccountFormGroup());
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  canAdd(): boolean {
    // Only allow add if less than max and not in edit mode
    return this.accounts.length < this.maxRekening && !this.isAllEditMode();
  }

  isAllEditMode(): boolean {
    return this.accounts.controls.some(acc => acc.get('editMode')?.value);
  }

  addAccount() {
    if (this.canAdd()) {
      this.accounts.push(this.createAccountFormGroup());
    }
  }

  removeAccount(index: number) {
    if (this.accounts.length > 1 && !this.accounts.at(index).get('id')?.value) {
      this.accounts.removeAt(index);
    }
  }

  onBankSelect(index: number, selectedBankId: any) {
    const selectedBank = this.listBank.find(bank => bank.id === selectedBankId);
    if (selectedBank) {
      const account = this.accounts.at(index);
      account.get('kode_bank')?.setValue(selectedBank.id);
    }
  }

  onFileSelect(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const account = this.accounts.at(index) as FormGroup;
      account.get('photo_rek')?.setValue(file);
    }
  }

  getPhotoUrl(file: any): string {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    return file;
  }

  // --- CRUD ---
  onSubmit() {
    // Only allow create if user has less than max rekening
    if (this.data && this.data.length >= this.maxRekening) {
      this.notyf.error('Anda sudah memiliki 2 rekening. Silakan edit rekening yang ada.');
      return;
    }

    // Build JSON payload arrays per API spec
    const kode_bank_arr: any[] = [];
    const nomor_rekening_arr: any[] = [];
    const nama_pemilik_arr: any[] = [];
    // For simplicity files will be uploaded as null or ignored in this JSON flow

    let valid = true;
    this.accounts.controls.forEach((account, index) => {
      if (!account.get('id')?.value && !account.get('editMode')?.value) {
        const val = account.value;
        if (!val.kode_bank) {
          this.notyf.error(`Nama bank tidak boleh kosong untuk rekening #${index + 1}.`);
          valid = false;
        }
        if (!val.nomor_rekening) {
          this.notyf.error(`Nomor rekening tidak boleh kosong untuk rekening #${index + 1}.`);
          valid = false;
        }
        if (!val.nama_pemilik) {
          this.notyf.error(`Nama pemilik tidak boleh kosong untuk rekening #${index + 1}.`);
          valid = false;
        }
        kode_bank_arr.push(val.kode_bank);
        nomor_rekening_arr.push(val.nomor_rekening);
        nama_pemilik_arr.push(val.nama_pemilik);
      }
    });
    if (!valid) return;
    if (kode_bank_arr.length === 0) {
      this.notyf.error('Tidak ada rekening baru untuk disimpan.');
      return;
    }

    const payload: any = {
      kode_bank: kode_bank_arr,
      nomor_rekening: nomor_rekening_arr,
      nama_pemilik: nama_pemilik_arr
    };

    this.isLoading = true;
    this.dashboardSvc.create(DashboardServiceType.REKENINGS_STORE, payload).subscribe({
      next: (res) => {
        this.notyf.success(res?.message || 'Data berhasil disimpan.');
        this.isLoading = false;
        this.getDataRekening();
      },
      error: (err) => {
        this.isLoading = false;
        if (err?.error?.errors) {
          Object.values(err.error.errors).forEach((msgArr: any) => this.notyf.error(msgArr[0]));
        } else {
          this.notyf.error(err?.message || 'Ada kesalahan dalam sistem.');
        }
      }
    });
  }

  onEdit(index: number) {
    this.accounts.at(index).get('editMode')?.setValue(true);
  }

  onCancelEdit(index: number) {
    // Reset to original data
    const original = this.data && this.data[index] ? this.data[index] : null;
    if (original) {
      this.accounts.at(index).patchValue({
        kode_bank: original.kode_bank,
        nomor_rekening: original.nomor_rekening,
        nama_pemilik: original.nama_pemilik,
        photo_rek: original.photo_rek,
        editMode: false
      });
    } else {
      this.accounts.at(index).reset();
      this.accounts.at(index).get('editMode')?.setValue(false);
    }
  }

  onUpdate(index: number) {
    const account = this.accounts.at(index);
    if (account.invalid) {
      Object.values((account as FormGroup).controls).forEach((control: any) => control.markAsTouched());
      return;
    }
    const val = account.value;
    // Build JSON payload following the provided API spec: { rekenings: [ { id, kode_bank, ... } ] }
    const payload = {
      rekenings: [
        {
          id: val.id,
          kode_bank: Number(val.kode_bank),
          nomor_rekening: val.nomor_rekening,
          nama_pemilik: val.nama_pemilik
          // photo_rek as file is not supported in pure JSON; server should accept URL or omitted
        }
      ]
    };
    this.isLoading = true;
    this.dashboardSvc.update(DashboardServiceType.REKENINGS_UPDATE_JSON, '', payload).subscribe({
      next: (res) => {
        this.notyf.success(res?.message || 'Rekening berhasil diupdate.');
        account.get('editMode')?.setValue(false);
        this.isLoading = false;
        this.getDataRekening();
      },
      error: (err) => {
        this.isLoading = false;
        if (err?.error?.errors) {
          Object.values(err.error.errors).forEach((msgArr: any) => this.notyf.error(msgArr[0]));
        } else {
          this.notyf.error(err?.message || 'Gagal update rekening.');
        }
      }
    });
  }

  onDelete(index: number) {
    const account = this.accounts.at(index);
    const id = account.get('id')?.value;
    if (!id) return;
    this.isLoading = true;
    // Use deleteV2 to call DELETE /rekenings/{id}
    this.dashboardSvc.deleteV2(DashboardServiceType.REKENINGS_DELETE_JSON, id).subscribe({
      next: (res) => {
        this.notyf.success(res?.message || 'Rekening berhasil dihapus.');
        this.isLoading = false;
        this.getDataRekening();
      },
      error: (err) => {
        this.isLoading = false;
        this.notyf.error(err?.message || 'Gagal menghapus rekening.');
      }
    });
  }

  // Utility to log FormData payload
  private logFormData(formData: FormData) {
    if (formData && typeof formData.forEach === 'function') {
      console.log('FormData payload:');
      formData.forEach((value, key) => {
        if (value instanceof File) {
          console.log(`${key}: [File] name=${value.name}, size=${value.size}`);
        } else {
          console.log(`${key}:`, value);
        }
      });
    }
  }
}

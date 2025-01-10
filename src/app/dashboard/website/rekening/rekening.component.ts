import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
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
  filteredBanks: any[][] = []; // Filtered results for each account
  showSuggestions: boolean[] = []; // Track visibility of suggestions
  activeSuggestionIndex: number[] = []; // Track active suggestion index for each account
  private notyf: Notyf;

  private modalRef? : BsModalRef

  constructor(
    private fb: FormBuilder,
    private dashboardSvc: DashboardService,
    private modalSvc: BsModalService
  ) {
    this.notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });
  }

  ngOnInit() {
    this.getListBank();
    this.rekeningForm = this.fb.group({
      accounts: this.fb.array([this.createAccountFormGroup()])
    });
  }

  get accounts(): FormArray {
    return this.rekeningForm.get('accounts') as FormArray;
  }

  createAccountFormGroup(): FormGroup {
    return this.fb.group({
      kode_bank: ['', Validators.required],
      nama_bank: ['', Validators.required],
      nomor_rekening: ['', Validators.required],
      nama_pemilik: ['', Validators.required],
      photo_rek: [null] // Ensure this is included
    });
  }
  

  addAccount() {
    this.accounts.push(this.createAccountFormGroup());
    this.filteredBanks.push([]);
    this.showSuggestions.push(false);
    this.activeSuggestionIndex.push(-1);
  }

  removeAccount(index: number) {
    this.accounts.removeAt(index);
    this.filteredBanks.splice(index, 1);
    this.showSuggestions.splice(index, 1);
    this.activeSuggestionIndex.splice(index, 1);
  }

  getListBank() {
    this.dashboardSvc.list(DashboardServiceType.MD_LIST_BANK).subscribe((res) => {
      this.listBank = res?.data;
    });
  }

  onBankInputChange(index: number) {
    const control = this.accounts.at(index).get('nama_bank');
    if (control) {
      const value = control.value;
      this.filteredBanks[index] = this._filter(value, index);
      this.showSuggestions[index] = !!this.filteredBanks[index].length;
    }
  }

  private _filter(value: string, index: number): any[] {
    const filterValue = (value || '').toLowerCase();
    return this.listBank.filter(bank => bank.name.toLowerCase().includes(filterValue));
  }

  onKeydown(event: KeyboardEvent, index: number) {
    const suggestions = this.filteredBanks[index];
    if (!suggestions || suggestions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        this.activeSuggestionIndex[index] = Math.min(this.activeSuggestionIndex[index] + 1, suggestions.length - 1);
        break;
      case 'ArrowUp':
        this.activeSuggestionIndex[index] = Math.max(this.activeSuggestionIndex[index] - 1, 0);
        break;
      case 'Enter':
        if (this.activeSuggestionIndex[index] !== -1) {
          this.selectBank(index, suggestions[this.activeSuggestionIndex[index]]);
        }
        break;
      case 'Escape':
        this.showSuggestions[index] = false;
        break;
    }
  }

  selectBank(index: number, bank: any) {
    const account = this.accounts.at(index);
    account.get('kode_bank')?.setValue(bank.id);
    account.get('nama_bank')?.setValue(bank.name);
    this.showSuggestions[index] = false;
  }

  highlightMatch(bankName: string, inputValue: string): string {
    if (!inputValue) return bankName;
    const regex = new RegExp(`(${inputValue})`, 'gi');
    return bankName.replace(regex, '<strong>$1</strong>');
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick() {
    this.showSuggestions = this.showSuggestions.map(() => false);
  }

  onSubmit() {
    // Prepare a flat payload for all accounts
    const formData = new FormData();
  
    this.accounts.controls.forEach((account, index) => {
      const accountValue = account.value;
  
      // Append each field with the correct index
      formData.append(`kode_bank[${index}]`, accountValue.kode_bank || '');
      formData.append(`nomor_rekening[${index}]`, accountValue.nomor_rekening || '');
      formData.append(`nama_pemilik[${index}]`, accountValue.nama_pemilik || '');
  
      // Append binary file if available
      if (accountValue.photo_rek instanceof File) {
        formData.append(`photo_rek[${index}]`, accountValue.photo_rek);
      }
    });
  
    // Display confirmation modal before submitting
    const initialState = {
      message: 'Apakah anda ingin menyimpan semua data rekening?',
      cancelClicked: () => this.handleCancelClicked(),
      submitClicked: () => this.onSubmitForm(formData),
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
  
  onSubmitForm(formData: FormData) {
    // Clear any existing form data to prevent duplicates
    formData = new FormData();
  
    this.accounts.controls.forEach((account, index) => {
      // Parse kode_bank to an integer if it's not empty
      const kodeBank = account.get('kode_bank')?.value
        ? parseInt(account.get('kode_bank')?.value, 10)
        : null; // Convert only if there's a value
  
      const nomorRekening = account.get('nomor_rekening')?.value;
      const namaPemilik = account.get('nama_pemilik')?.value;
      const photoRek = account.get('photo_rek')?.value;
  
      // Append fields, converting kode_bank to an integer
      formData.append(`kode_bank[${index}]`, kodeBank !== null ? kodeBank.toString() : '');
      formData.append(`nomor_rekening[${index}]`, nomorRekening || '');
      formData.append(`nama_pemilik[${index}]`, namaPemilik || '');
  
      if (photoRek instanceof File) {
        formData.append(`photo_rek[${index}]`, photoRek);
      }
    });
  
    // Submit the form data
    this.dashboardSvc.create(DashboardServiceType.SEND_REKENING, formData).subscribe({
      next: (res) => {
        this.notyf.success(res?.message || 'Data berhasil disimpan.');
        this.rekeningForm.reset();
        this.accounts.clear();
        this.addAccount();
      },
      error: (err) => {
        this.notyf.error(err?.message || 'Ada kesalahan dalam sistem.');
        console.error('Error while submitting data:', err);
      }
    });
  }
  
  handleCancelClicked() {
    console.log('Cancel clicked');
    // Add any additional logic for cancel action
}




  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched();
    });
  }

  onFileSelect(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const account = this.accounts.at(index) as FormGroup;
      account.get('photo_rek')?.setValue(file);
    }
  }  
  
}

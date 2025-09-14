import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardServiceType } from '../../../dashboard.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Notyf } from 'notyf';
import { BankAccount } from '../../../services/wedding-data.service';

interface PaymentMethod {
  id: number;
  name: string;
}

interface Bank {
  id: number;
  kode_bank: string;
  name: string;
  logo?: string;
}

interface PaymentMethodDetail {
  id: number;
  metodePembayaran: string;
  idMetodePembayaran: string;
  userId?: number;
  // Manual payment fields
  pengguna?: string;
  email?: string;
  noRekening?: string;
  namaBank?: string;
  kodeBank?: string;
  namaPemilik?: string;
  photoRek?: string | null;
  // Tripay fields
  urlTripay?: string;
  privateKey?: string;
  apiKey?: string;
  kodeMerchant?: string;
  // Midtrans fields
  url?: string;
  serverKey?: string;
  clientKey?: string;
  metodeProduction?: string;
  // Trial fields
  trialInfo?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'wc-settings-payment',
  templateUrl: './settings-payment.component.html',
  styleUrls: ['./settings-payment.component.scss']
})
export class SettingsPaymentComponent implements OnInit {

  // Payment method selection
  paymentMethods: PaymentMethod[] = [];
  selectedPaymentMethod: PaymentMethod | null = null;

  // Bank list for manual payments
  bankList: Bank[] = [];

  // Forms
  paymentForm!: FormGroup;
  editPaymentForm?: FormGroup;

  // Data display
  paymentDetails: PaymentMethodDetail[] = [];

  // UI state
  isLoading = false;
  isSubmitting = false;
  selectedPhotoFile: File | null = null;
  selectedEditPhotoFile: File | null = null;

  // Modal state
  currentEditItem: PaymentMethodDetail | null = null;

  private notyf: Notyf;

  constructor(
    private fb: FormBuilder,
    private dashboardSvc: DashboardService
  ) {
    this.notyf = new Notyf({
      duration: 3000,
      position: { x: 'right', y: 'top' }
    });
  }

  ngOnInit(): void {
    // Initialize empty form first to prevent null errors
    this.paymentForm = this.fb.group({});

    this.loadPaymentMethods();
  }

  private loadPaymentMethods(): void {
    this.isLoading = true;
    this.dashboardSvc.getParam(DashboardServiceType.MD_RGS_PAYMENT, '').subscribe({
      next: (response) => {
        this.paymentMethods = response?.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading payment methods:', err);
        this.notyf.error('Gagal memuat metode pembayaran');
        this.isLoading = false;
      }
    });
  }

  private loadBankList(): void {
    this.dashboardSvc.list(DashboardServiceType.MD_LIST_BANK).subscribe({
      next: (res) => {
        this.bankList = res?.data || [];
      },
      error: (err) => {
        console.error('Error loading bank list:', err);
        this.notyf.error('Gagal memuat daftar bank');
      }
    });
  }

  onPaymentMethodSelect(selectedItem: any): void {
    console.log('Payment method select event:', selectedItem);

    // Extract the ID from the selected item
    const methodId = selectedItem?.id || selectedItem;
    if (!methodId) return;

    const method = this.paymentMethods.find(m => m.id === methodId);
    if (!method) return;

    console.log('Selected payment method:', method);

    // Clear previous state completely
    this.selectedPaymentMethod = null;
    this.paymentDetails = [];

    // Initialize an empty form to prevent null reference errors
    this.paymentForm = this.fb.group({});

    // Use setTimeout to ensure proper timing for state updates
    setTimeout(() => {
      // Set new payment method
      this.selectedPaymentMethod = method;

      // Initialize the proper form
      this.initializeForm();

      // Load data after form is properly initialized
      setTimeout(() => {
        this.loadPaymentDetails();

        // Load bank list if manual payment is selected
        if (methodId === 1) {
          this.loadBankList();
        }
      }, 50);
    }, 10);
  }

  private initializeForm(): void {
    if (!this.selectedPaymentMethod) {
      this.paymentForm = this.fb.group({});
      return;
    }

    console.log('Initializing form for payment method:', this.selectedPaymentMethod.id);

    // Create the form based on payment method type
    switch (this.selectedPaymentMethod.id) {
      case 1: // Manual
        this.paymentForm = this.fb.group({
          kode_bank: new FormControl('', [Validators.required]),
          nomor_rekening: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
          nama_pemilik: new FormControl('', [Validators.required, Validators.minLength(2)]),
          photo_rek: new FormControl('')
        });
        break;

      case 2: // Tripay
        this.paymentForm = this.fb.group({
          url_tripay: new FormControl('', [Validators.required]),
          private_key: new FormControl('', [Validators.required]),
          api_key: new FormControl('', [Validators.required]),
          kode_merchant: new FormControl('', [Validators.required]),
          methode_pembayaran: new FormControl('Tripay', [Validators.required]),
          id_methode_pembayaran: new FormControl('2', [Validators.required])
        });
        break;

      case 3: // Midtrans
        this.paymentForm = this.fb.group({
          url: new FormControl('', [Validators.required]),
          server_key: new FormControl('', [Validators.required]),
          client_key: new FormControl('', [Validators.required]),
          metode_production: new FormControl('', [Validators.required]),
          methode_pembayaran: new FormControl('Midtrans', [Validators.required]),
          id_methode_pembayaran: new FormControl('3', [Validators.required])
        });
        break;

      default:
        this.paymentForm = this.fb.group({});
    }

    console.log('Form initialized successfully:', this.paymentForm);
  }  private loadPaymentDetails(): void {
    if (!this.selectedPaymentMethod) return;

    const params = {
      id_methode_pembayaran: this.selectedPaymentMethod.id,
      name_methode_pembayaran: this.selectedPaymentMethod.name
    };

    this.isLoading = true;
    this.dashboardSvc.list(DashboardServiceType.MNL_MD_METHOD_DETAIL, params).subscribe({
      next: (res) => {
        const paymentList = res?.data || [];
        this.mapPaymentDetails(paymentList);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading payment details:', err);
        this.notyf.error('Gagal memuat detail pembayaran');
        this.isLoading = false;
      }
    });
  }

  private mapPaymentDetails(data: any[]): void {
    console.log('Raw API data:', data); // Debug logging

    this.paymentDetails = data.map((item: any) => {
      // Set payment method info based on selected method since API response doesn't include it
      const methodId = this.selectedPaymentMethod?.id || 1;
      const methodName = this.selectedPaymentMethod?.name || 'Manual';

      let detail: PaymentMethodDetail = {
        id: item.id,
        metodePembayaran: item.methode_pembayaran || methodName,
        idMetodePembayaran: item.id_methode_pembayaran || methodId,
        userId: item.user_id,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      };

      // Map specific fields based on payment method
      // Use selected payment method ID since API response may not include it
      const paymentMethodId = item.id_methode_pembayaran?.toString() || methodId.toString();

      switch (paymentMethodId) {
        case '1': // Manual
          detail = {
            ...detail,
            pengguna: item.nama_pemilik || item.email || '-',
            email: item.email || '-',
            noRekening: item.nomor_rekening || '-',
            namaBank: item.nama_bank || '-',
            kodeBank: item.kode_bank || '-',
            namaPemilik: item.nama_pemilik || '-',
            photoRek: item.photo_rek || null
          };
          break;

        case '2': // Tripay
          detail = {
            ...detail,
            urlTripay: item.url_tripay || '',
            privateKey: item.private_key || '',
            apiKey: item.api_key || '',
            kodeMerchant: item.kode_merchant || ''
          };
          break;

        case '3': // Midtrans
          detail = {
            ...detail,
            url: item.url || '',
            serverKey: item.server_key || '',
            clientKey: item.client_key || '',
            metodeProduction: item.metode_production || ''
          };
          break;

        case '4': // Trial
          detail = {
            ...detail,
            trialInfo: 'Trial Mode Active'
          };
          break;
      }

      console.log('Mapped detail for item:', item, 'Result:', detail); // Debug logging
      return detail;
    });

    console.log('Final mapped payment details:', this.paymentDetails); // Debug logging
  }

  onBankSelect(bankCode: string): void {
    if (this.paymentForm) {
      this.paymentForm.get('kode_bank')?.setValue(bankCode);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!this.validateFile(file)) {
        return;
      }

      this.selectedPhotoFile = file;
    }
  }

  private validateFile(file: File): boolean {
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (file.size > maxSize) {
      this.notyf.error('Ukuran file maksimal 2MB');
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      this.notyf.error('Format file harus JPEG, PNG, atau JPG');
      return false;
    }

    return true;
  }

  onSubmitPayment(): void {
    if (!this.selectedPaymentMethod || !this.paymentForm || this.paymentForm.invalid) {
      this.notyf.error('Harap lengkapi semua field yang wajib diisi');
      return;
    }

    const formValues = this.paymentForm.value;
    this.isSubmitting = true;

    switch (this.selectedPaymentMethod.id) {
      case 1: // Manual
        this.submitManualPayment(formValues);
        break;
      case 2: // Tripay
        this.submitTripayPayment(formValues);
        break;
      case 3: // Midtrans
        this.submitMidtransPayment(formValues);
        break;
      default:
        this.isSubmitting = false;
        this.notyf.error('Metode pembayaran tidak didukung');
    }
  }

  private submitManualPayment(formValues: any): void {
    // Prepare payload with only fields that have values, excluding photo_rek if not provided
    const payload: any = {
      kode_bank: [formValues.kode_bank],
      nomor_rekening: [formValues.nomor_rekening],
      nama_pemilik: [formValues.nama_pemilik]
    };

    // Only include photo_rek if a file is selected
    if (this.selectedPhotoFile) {
      payload.photo_rek = [this.selectedPhotoFile];
    }

    this.dashboardSvc.create(DashboardServiceType.ADM_ADD_REKENING, payload).subscribe({
      next: (res) => {
        this.notyf.success(res?.message || 'Rekening admin berhasil ditambahkan');
        this.loadPaymentDetails();
        this.resetForm();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.handleApiError(err);
        this.isSubmitting = false;
      }
    });
  }

  private submitTripayPayment(formValues: any): void {
    const formData = new FormData();
    Object.keys(formValues).forEach(key => {
      if (formValues[key] !== null && formValues[key] !== undefined) {
        formData.append(key, formValues[key]);
      }
    });

    this.dashboardSvc.create(DashboardServiceType.ADM_TRIPAY_PAYMENT, formData).subscribe({
      next: (res) => {
        this.notyf.success(res?.message || 'Konfigurasi Tripay berhasil disimpan');
        this.loadPaymentDetails();
        this.resetForm();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.handleApiError(err);
        this.isSubmitting = false;
      }
    });
  }

  private submitMidtransPayment(formValues: any): void {
    const formData = new FormData();
    Object.keys(formValues).forEach(key => {
      if (formValues[key] !== null && formValues[key] !== undefined) {
        formData.append(key, formValues[key]);
      }
    });

    this.dashboardSvc.create(DashboardServiceType.ADM_MIDTRANS_PAYMENT, formData).subscribe({
      next: (res) => {
        this.notyf.success(res?.message || 'Konfigurasi Midtrans berhasil disimpan');
        this.loadPaymentDetails();
        this.resetForm();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.handleApiError(err);
        this.isSubmitting = false;
      }
    });
  }

  private resetForm(): void {
    if (this.paymentForm) {
      this.paymentForm.reset();
    }
    this.selectedPhotoFile = null;
    this.selectedEditPhotoFile = null;
  }

  private handleApiError(err: any): void {
    console.error('API Error:', err);

    if (err?.error?.errors) {
      Object.values(err.error.errors).forEach((messages: any) => {
        if (Array.isArray(messages)) {
          messages.forEach(message => this.notyf.error(message));
        }
      });
    } else if (err?.error?.message) {
      this.notyf.error(err.error.message);
    } else {
      this.notyf.error('Terjadi kesalahan pada sistem');
    }
  }

  // Table display methods
  getTableColumns(): string[] {
    if (!this.selectedPaymentMethod) return [];

    switch (this.selectedPaymentMethod.id) {
      case 1: // Manual
        return ['pengguna', 'email', 'noRekening', 'namaBank', 'metodePembayaran'];
      case 2: // Tripay
        return ['urlTripay', 'apiKey', 'kodeMerchant', 'metodePembayaran'];
      case 3: // Midtrans
        return ['url', 'serverKey', 'clientKey', 'metodePembayaran'];
      case 4: // Trial
        return ['trialInfo', 'metodePembayaran'];
      default:
        return ['metodePembayaran'];
    }
  }

  getColumnHeader(column: string): string {
    const headers: { [key: string]: string } = {
      pengguna: 'Pengguna',
      email: 'Email',
      noRekening: 'No Rekening',
      namaBank: 'Bank',
      urlTripay: 'URL Tripay',
      apiKey: 'API Key',
      kodeMerchant: 'Kode Merchant',
      url: 'URL',
      serverKey: 'Server Key',
      clientKey: 'Client Key',
      metodePembayaran: 'Metode Pembayaran',
      trialInfo: 'Trial Info'
    };
    return headers[column] || column;
  }

  getBankName(kodeBank: string): string {
    const bank = this.bankList.find(b => b.kode_bank === kodeBank);
    return bank?.name || 'Bank tidak ditemukan';
  }

  // Utility methods
  getFieldError(fieldName: string): string | null {
    if (!this.paymentForm) return null;

    const field = this.paymentForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) return `${fieldName} wajib diisi`;
      if (field.errors['pattern']) return `${fieldName} harus berupa angka`;
      if (field.errors['minlength']) return `${fieldName} minimal 2 karakter`;
    }
    return null;
  }

  isFormValid(): boolean {
    return this.paymentForm ? this.paymentForm.valid : false;
  }

  hasPaymentDetails(): boolean {
    return this.paymentDetails.length > 0;
  }

  // Helper method for displaying values in table (show '-' for empty values)
  getDisplayValue(value: string | undefined | null): string {
    return value && value.trim() !== '' ? value : '-';
  }

  // Modal Methods
  openEditModal(detail: PaymentMethodDetail): void {
    console.log('Opening edit modal with detail:', detail); // Debug logging
    this.currentEditItem = detail;
    this.initializeEditForm(detail);

    // Show modal using Bootstrap
    const modalElement = document.getElementById('editPaymentModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }  openDeleteModal(detail: PaymentMethodDetail): void {
    this.currentEditItem = detail;

    // Show modal using Bootstrap
    const modalElement = document.getElementById('deletePaymentModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  private initializeEditForm(detail: PaymentMethodDetail): void {
    if (!this.selectedPaymentMethod) return;

    console.log('Initializing edit form with detail:', detail); // Debug logging
    console.log('Selected payment method:', this.selectedPaymentMethod); // Debug logging

    switch (this.selectedPaymentMethod.id) {
      case 1: // Manual
        this.editPaymentForm = this.fb.group({
          kode_bank: [detail.kodeBank || '', Validators.required],
          nomor_rekening: [detail.noRekening || '', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
          nama_pemilik: [detail.namaPemilik || '', [Validators.required, Validators.minLength(2)]]
        });
        break;

      case 2: // Tripay
        this.editPaymentForm = this.fb.group({
          url_tripay: [detail.urlTripay || '', Validators.required],
          private_key: [detail.privateKey || '', Validators.required],
          api_key: [detail.apiKey || '', Validators.required],
          kode_merchant: [detail.kodeMerchant || '', Validators.required],
          methode_pembayaran: ['Tripay', Validators.required],
          id_methode_pembayaran: ['2', Validators.required]
        });
        break;

      case 3: // Midtrans
        this.editPaymentForm = this.fb.group({
          url: [detail.url || '', Validators.required],
          server_key: [detail.serverKey || '', Validators.required],
          client_key: [detail.clientKey || '', Validators.required],
          metode_production: [detail.metodeProduction || '', Validators.required],
          methode_pembayaran: ['Midtrans', Validators.required],
          id_methode_pembayaran: ['3', Validators.required]
        });
        break;

      default:
        this.editPaymentForm = this.fb.group({});
    }

    console.log('Edit form created:', this.editPaymentForm.value); // Debug logging
  }

  onEditFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!this.validateFile(file)) {
        return;
      }

      this.selectedEditPhotoFile = file;
    }
  }

  onSubmitEditPayment(): void {
    if (!this.selectedPaymentMethod || !this.editPaymentForm || this.editPaymentForm.invalid || !this.currentEditItem) {
      this.notyf.error('Harap lengkapi semua field yang wajib diisi');
      return;
    }

    const formValues = this.editPaymentForm.value;
    console.log('Form values being sent:', formValues); // Debug logging
    console.log('Current edit item:', this.currentEditItem); // Debug logging
    this.isSubmitting = true;

    switch (this.selectedPaymentMethod.id) {
      case 1: // Manual
        this.updateManualPayment(formValues);
        break;
      case 2: // Tripay
        this.updateTripayPayment(formValues);
        break;
      case 3: // Midtrans
        this.updateMidtransPayment(formValues);
        break;
      default:
        this.isSubmitting = false;
        this.notyf.error('Metode pembayaran tidak didukung');
    }
  }

  private updateManualPayment(formValues: any): void {
    // Prepare payload with only filled fields, excluding photo_rek if not provided
    const payload: any = {
      rekenings: [{
        id: this.currentEditItem!.id,
        kode_bank: formValues.kode_bank,
        nomor_rekening: formValues.nomor_rekening,
        nama_pemilik: formValues.nama_pemilik
      }]
    };

    // Only include photo_rek if a new file is selected
    if (this.selectedEditPhotoFile) {
      payload.rekenings[0].photo_rek = this.selectedEditPhotoFile;
    }

    this.dashboardSvc.update(DashboardServiceType.UPDATE_REKENING_ADMIN, '', payload).subscribe({
      next: (res) => {
        this.notyf.success(res?.message || 'Rekening berhasil diperbarui');
        this.loadPaymentDetails();
        this.closeEditModal();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.handleApiError(err);
        this.isSubmitting = false;
      }
    });
  }

  private updateTripayPayment(formValues: any): void {
    // Use PUT /api/v1/admin/tripay/{id} endpoint according to API contract
    const itemId = this.currentEditItem!.id;
    const updateUrl = `/api/v1/admin/tripay/${itemId}`;

    this.dashboardSvc.httpSvc.put(updateUrl, formValues).subscribe({
      next: (res: any) => {
        this.notyf.success(res?.message || 'Konfigurasi Tripay berhasil diperbarui');
        this.loadPaymentDetails();
        this.closeEditModal();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.handleApiError(err);
        this.isSubmitting = false;
      }
    });
  }

  private updateMidtransPayment(formValues: any): void {
    // Use PUT /api/v1/admin/midtrans/{id} endpoint according to API contract
    const itemId = this.currentEditItem!.id;
    const updateUrl = `/api/v1/admin/midtrans/${itemId}`;

    this.dashboardSvc.httpSvc.put(updateUrl, formValues).subscribe({
      next: (res: any) => {
        this.notyf.success(res?.message || 'Konfigurasi Midtrans berhasil diperbarui');
        this.loadPaymentDetails();
        this.closeEditModal();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.handleApiError(err);
        this.isSubmitting = false;
      }
    });
  }

  onConfirmDelete(): void {
    if (!this.currentEditItem || !this.selectedPaymentMethod) {
      return;
    }

    this.isSubmitting = true;

    switch (this.selectedPaymentMethod.id) {
      case 1: // Manual
        this.deleteManualPayment();
        break;
      case 2: // Tripay
        this.deleteTripayPayment();
        break;
      case 3: // Midtrans
        this.deleteMidtransPayment();
        break;
      default:
        this.isSubmitting = false;
        this.notyf.error('Metode pembayaran tidak didukung');
    }
  }

  private deleteManualPayment(): void {
    const itemId = this.currentEditItem!.id;
    this.dashboardSvc.deleteV2(DashboardServiceType.DELETE_REKENING_ADMIN, itemId).subscribe({
      next: (res) => {
        this.notyf.success(res?.message || 'Rekening berhasil dihapus');
        this.loadPaymentDetails();
        this.closeDeleteModal();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.handleApiError(err);
        this.isSubmitting = false;
      }
    });
  }

  private deleteTripayPayment(): void {
    const itemId = this.currentEditItem!.id;
    // Use DELETE /api/v1/admin/tripay/{id} endpoint according to API contract
    const deleteUrl = `/api/v1/admin/tripay/${itemId}`;

    this.dashboardSvc.httpSvc.delete(deleteUrl).subscribe({
      next: (res: any) => {
        this.notyf.success(res?.message || 'Konfigurasi Tripay berhasil dihapus');
        this.loadPaymentDetails();
        this.closeDeleteModal();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.handleApiError(err);
        this.isSubmitting = false;
      }
    });
  }

  private deleteMidtransPayment(): void {
    const itemId = this.currentEditItem!.id;
    // Use DELETE /api/v1/admin/midtrans/{id} endpoint according to API contract
    const deleteUrl = `/api/v1/admin/midtrans/${itemId}`;

    this.dashboardSvc.httpSvc.delete(deleteUrl).subscribe({
      next: (res: any) => {
        this.notyf.success(res?.message || 'Konfigurasi Midtrans berhasil dihapus');
        this.loadPaymentDetails();
        this.closeDeleteModal();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.handleApiError(err);
        this.isSubmitting = false;
      }
    });
  }

  private closeEditModal(): void {
    const modalElement = document.getElementById('editPaymentModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
    this.currentEditItem = null;
    this.selectedEditPhotoFile = null;
  }

  private closeDeleteModal(): void {
    const modalElement = document.getElementById('deletePaymentModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
    this.currentEditItem = null;
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-rekening',
  templateUrl: './rekening.component.html',
  styleUrls: ['./rekening.component.scss']
})
export class RekeningComponent implements OnInit {
  rekeningForm!: FormGroup;

  modalRef? :  BsModalRef;

  constructor(
    private fb: FormBuilder,
    private modalSvc: BsModalService
  ) { }

  ngOnInit() {
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
      nomor_rekening: ['', Validators.required],
      nama_pemilik: ['', Validators.required],
      photo_rek: [null]
    });
  }

  addAccount() {
    this.accounts.push(this.createAccountFormGroup());
  }

  removeAccount(index: number) {
    this.accounts.removeAt(index);
  }

  onSubmit(index: number) {
    const accountFormGroup = this.accounts.at(index) as FormGroup;
    if (accountFormGroup.valid) {
        const formData = this.transformFormValues(accountFormGroup.value, index);
        console.log('Form Content:', formData);

        const initialState = {
            message: 'Apakah anda ingin menghapus?',
            cancelClicked: () => this.handleCancelClicked(),
            submitClicked: (data: any) => this.handleSubmitClicked(data)
        };

        this.modalRef = this.modalSvc.show(ModalComponent, { initialState });

        // Check if modalRef and modalRef.content are defined
        if (this.modalRef && this.modalRef.content) {
            this.modalRef.content.onClose.subscribe((res: any) => {
                if (res.state === 'delete') {
                    // Perform the delete operation here
                    // this.deleteEntry(parameterDelete); 
                    console.log('Delete confirmed', res.data);
                } else if (res.state === 'cancel') {
                    console.log('Delete canceled');
                }
                this.modalRef?.hide();
            });
        }

    } else {
        console.log('Form is invalid');
        this.markFormGroupTouched(accountFormGroup);
    }
}

handleCancelClicked() {
    console.log('Cancel clicked');
    // Add any additional logic for cancel action
}

handleSubmitClicked(data: any) {
    console.log('Submit clicked with data:', data);
    // Add any additional logic for submit action
    // e.g., this.deleteEntry(data);
}


  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  private transformFormValues(values: any, index: number): any {
    const transformed: { [key: string]: any } = {};
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        transformed[`${key}[${index}]`] = values[key];
      }
    }
    return transformed;
  }
}

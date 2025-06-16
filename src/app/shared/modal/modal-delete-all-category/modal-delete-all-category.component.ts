import { Component, Input, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DashboardService, DashboardServiceType } from '../../../dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Notyf } from 'notyf';
import { Subject } from 'rxjs';

@Component({
  selector: 'wc-modal-delete-all-category',
  templateUrl: './modal-delete-all-category.component.html',
  styleUrls: ['./modal-delete-all-category.component.scss']
})
export class ModalDeleteAllCategoryComponent implements OnInit {

  @Input() initialState: any;
  categoryForm!: FormGroup;
  private notyf: Notyf
  onClose!: Subject<boolean>;

  constructor(
    private modalSvc: BsModalService,
    private dasboardSvc: DashboardService,
    private formSvc: FormBuilder
  ) {
    this.notyf = new Notyf({
      duration: 1000,
      position: { x: 'right', y: 'top' }
    });
  }

  ngOnInit() {
    this.categoryForm = this.formSvc.group({
      confirm: ['', Validators.required],
    });
    this.onClose = new Subject();
  }

  closeModal() {
    this.modalSvc.hide();
  }

  onDeleteAllCategory() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const payload = {
      confirm: this.categoryForm.value.confirm,
    };

    this.dasboardSvc.delete(DashboardServiceType.ADM_DELETE_ALL_CATEGORY, payload)
      .subscribe({
        next: (res) => {
          this.notyf.success(res?.message || 'Semua data berhasil dihapus.');
          this.modalSvc.hide();
          this.onClose.next(true);
        },
      });
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DashboardService, DashboardServiceType } from '../../../dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Notyf } from 'notyf';
import { Subject } from 'rxjs';

@Component({
  selector: 'wc-modal-delete-category-admin',
  templateUrl: './modal-delete-category-admin.component.html',
  styleUrls: ['./modal-delete-category-admin.component.scss']
})
export class ModalDeleteCategoryAdminComponent implements OnInit {


  private notyf: Notyf


  @Input() item: any;

  categoryForm!: FormGroup;
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
      id: [this.item?.id || '', Validators.required],
      name: [this.item?.name || '', Validators.required],
      slug: [this.item?.slug || '', Validators.required]
    });
    this.onClose = new Subject();
  }

  closeModal() {
    this.modalSvc.hide();
  }

  onDeleteCategory() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const payload = {
      id: this.categoryForm.value.id,
    };

    this.dasboardSvc.delete(DashboardServiceType.ADM_DELETE_CATEGORY,  payload)
      .subscribe({
        next: (res) => {
          this.notyf.success(res?.message || 'Data berhasil dihapus.');
          this.modalSvc.hide();
          this.onClose.next(true);
        },
      });

  }
}

import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DashboardService, DashboardServiceType } from '../../dashboard.service';
import { ModalAddCategoryAdminComponent } from '../../shared/modal/modal-add-category-admin/modal-add-category-admin.component';
import { ModalDeleteCategoryAdminComponent } from '../../shared/modal/modal-delete-category-admin/modal-delete-category-admin.component';
import { ModalEditCategoryAdminComponent } from '../../shared/modal/modal-edit-category-admin/modal-edit-category-admin.component';
import { ModalDeleteAllCategoryComponent } from 'src/app/shared/modal/modal-delete-all-category/modal-delete-all-category.component';

@Component({
  selector: 'wc-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.scss']
})
export class WebsiteComponent implements OnInit {

  allData: any[] = [];
  displayedData: any[] = [];
  pageSize: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSizes: number[] = [5, 10, 20, 30, 50, 100];
  selectedItem: any = null;

  constructor(
    private dashboardSvc: DashboardService,
    private modalSvc: BsModalService
  ) { }

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    this.dashboardSvc.getParam(DashboardServiceType.ADM_GET_CATEGORY, '').subscribe(res => {
      if (!res.data || res.data.length === 0) {
        this.allData = [];
        this.displayedData = [];
        this.totalPages = 0;
        return;
      }
      this.allData = res.data;
      this.totalPages = Math.ceil(this.allData.length / this.pageSize);
      this.onPageChange(1);
    });
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedData = this.allData.slice(start, end);
  }

  openEditModal(item: any) {
    this.selectedItem = { ...item };
    const modalRef = this.modalSvc.show(ModalEditCategoryAdminComponent, {
      class: 'modal-medium',
      initialState: {
        item: this.selectedItem
      },
      ignoreBackdropClick: false
    });
    if (modalRef.content) {
      modalRef.content.onClose.subscribe(() => {
        this.getData();
      });
    }
  }

  openDeleteModal(item: any) {
    this.selectedItem = item;
    this.selectedItem = { ...item };
    const modalRef = this.modalSvc.show(ModalDeleteCategoryAdminComponent, {
      class: 'modal-medium',
      initialState: {
        item: this.selectedItem
      },
      ignoreBackdropClick: false
    });
    if (modalRef.content) {
      modalRef.content.onClose.subscribe(() => {
        this.getData();
      });
    }
  }

  openModalAdd() {
    const modalRef = this.modalSvc.show(ModalAddCategoryAdminComponent, {
      class: 'modal-medium',
      ignoreBackdropClick: false
    });
    if (modalRef.content) {
      modalRef.content.onClose.subscribe(() => {
        this.getData();
      });
    }
  }

  openModalDeleteAll() {
    const modalRef = this.modalSvc.show(ModalDeleteAllCategoryComponent, {
      class: 'modal-medium',
      ignoreBackdropClick: false
    });
    if (modalRef.content) {
      modalRef.content.onClose.subscribe(() => {
        this.getData();
      });
    }
  }

}

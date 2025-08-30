import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Notyf } from 'notyf';
import { DashboardService, DashboardServiceType } from 'src/app/dashboard.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'wc-testimonies',
  templateUrl: './testimonies.component.html',
  styleUrls: ['./testimonies.component.scss']
})
export class TestimoniesComponent implements OnInit {
  rows: Array<any> = [];
  columns: Array<any> = [];
  filteredRows: Array<any> = [];

  data: any

  modalRef?: BsModalRef
  private notyf: Notyf

  constructor(
    private dashboardSvc: DashboardService,
    private modalSvc: BsModalService
  ) {
    this.notyf = new Notyf({
      duration: 3000,
      position: {
        x: 'right',
        y: 'top'
      }
    });
   }

  ngOnInit(): void {

    this.getDataUser();

    this.columns = [
      { name: 'No', prop: 'number' },
      { name: 'Nama', prop: 'email' },
      { name: 'Kota', prop: 'kota' },
      { name: 'Provinsi', prop: 'provinsi' },
      { name: 'Ulasan', prop: 'ulasan' },
      { name: 'Status', prop: 'status', type: 'html' },

    ];

    this.filteredRows = [...this.rows];
  }

  getDataUser(){
    this.dashboardSvc.getParam(DashboardServiceType.ADM_TESTI, '').subscribe(res => {
      this.data = res?.data;

      this.rows = this.data.map((item: any, index: number) => ({
        number: index + 1,
        email: item?.user?.email,
        kota: item?.kota,
        provinsi: item?.provinsi,
        ulasan: item?.ulasan,
        id: item?.id,
        status_bol: item?.status,
        status: this.setStatusLabelTabel(item?.status), // Ubah status sesuai aturan
        auth: {
          canDelete: true
        }
      }));

      this.filteredRows = [...this.rows];
    });
  }



  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredRows = this.rows.filter(user =>
      user.name.toLowerCase().includes(query)
    );
  }

  onConfirmClicked(row: any) {
    console.log('Confirm action:', row);
  }

  onEditClicked(row: any) {
    const initialState = {
        message: 'Apakah anda ingin mengubah data testimoni??',
        cancelClicked: () => this.handleCancelClicked(),
        submitClicked: () => this.saveEditData(row),
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

  public setStatusLabelTabel(val: any) {
  switch (val) {
    case 0:
      return '<label class="label label-default">Private</label>';
    case 1:
      return '<label class="label label-blues">Publik</label>';
    default:
      return ''; // Tambahkan return di default case
  }
}

handleCancelClicked(){

}

saveEditData(data: any) {
  console.log(data);

  const param = `/${data?.id}/update-status`;

  // Konversi status ke boolean (true/false)
  const newStatus: boolean = data?.status_bol === 0 ? true : false;

  // Kirim sebagai objek JSON langsung
  const payload = { status: newStatus };

  this.dashboardSvc.update(DashboardServiceType.ADM_TESTI, param, payload).subscribe({
    next: (res) => {
      this.modalRef?.hide();
      this.notyf.success(res?.message || 'Data berhasil disimpan.');
      window.location.reload();
    },
    error: (err) => {
      console.error('Error:', err);
      this.notyf.error(err?.message || 'Ada kesalahan dalam sistem.');
    }
  });
}


  onDeleteClicked(row: any) {
    const initialState = {
      message: 'Apakah anda ingin menghapus data testimoni??',
      cancelClicked: () => this.handleCancelClicked(),
      submitClicked: () => this.deleteDataSingle(row),
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

  deleteDataSingle(data:any){
    // const param = `/${data?.number}`;

    this.dashboardSvc.deleteV2(DashboardServiceType.ADM_TESTI, data?.id).subscribe({
      next: (res) => {
        this.modalRef?.hide();
        this.notyf.success(res?.message || 'Data berhasil dihapus.');
        window.location.reload();
      },
      error: (err) => {
        console.error('Error:', err);
        this.notyf.error(err?.message || 'Ada kesalahan dalam sistem.');
      }
    });
  }

  onDeleteAllClicked() {
    const initialState = {
      message: 'Apakah anda ingin menghapus semua data testimoni??',
      cancelClicked: () => this.handleCancelClicked(),
      submitClicked: () => this.deleteDataAll(),
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

  deleteDataAll(){
    // const param = `/${data?.number}`;

    this.dashboardSvc.delete(DashboardServiceType.ADM_TESTI_DELETE_ALL).subscribe({
      next: (res) => {
        this.modalRef?.hide();
        this.notyf.success(res?.message || 'Data berhasil dihapus.');
        window.location.reload();
      },
      error: (err) => {
        console.error('Error:', err);
        this.notyf.error(err?.message || 'Ada kesalahan dalam sistem.');
      }
    });
  }
}

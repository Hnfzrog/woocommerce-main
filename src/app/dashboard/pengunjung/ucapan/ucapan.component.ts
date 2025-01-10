import { Component, OnInit } from '@angular/core';
import { Notyf } from 'notyf';
import { DashboardService, DashboardServiceType } from 'src/app/dashboard.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import { ModalComponent } from '../../../shared/modal/modal.component';


@Component({
  selector: 'wc-ucapan',
  templateUrl: './ucapan.component.html',
  styleUrls: ['./ucapan.component.scss']
})
export class UcapanComponent implements OnInit {

  dataList : Array<any> = [];

  private notyf: Notyf

  searchQuery = '';
  entriesToShow = 10;
  data: any;

  modalRef? :  BsModalRef;


  constructor(
    private dashBoardSvc: DashboardService,
    private modalSvc: BsModalService,
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
    this.showTable();
    
  }

   get filteredDataList() {
    // Filters data based on search query
    return this.dataList.filter((data) =>
      data.nama.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  doDelete(event: any): void {
    let parameterDelete = event.id;

    const initialState = {
        message: `Apakah anda ingin menghapus pesan dari ${event?.nama}?`,
        cancelClicked: () => this.handleCancelClicked(),
        submitClicked: (data: any) => this.handleSubmitClicked(data, parameterDelete)
    };

    // Open modal and pass the dynamic message
    this.modalRef = this.modalSvc.show(ModalComponent, { initialState });

    // Check if modalRef and modalRef.content are defined
    if (this.modalRef && this.modalRef.content) {
        this.modalRef.content.onClose.subscribe((res: any) => {
            if (res && res.state === 'delete') {
                this.deleteEntry(parameterDelete); 
            } else if (res && res.state === 'cancel') {
                console.log('Delete canceled');
            }
            this.modalRef?.hide();
        });
    }
}

handleCancelClicked() {
    console.log('Cancel clicked');
    // Add any additional logic for cancel action
}

handleSubmitClicked(data: any, parameterDelete: any) {
    console.log('Submit clicked with data:', data);
    this.deleteEntry(parameterDelete); // Perform the delete operation here
}

doDeleteAll(): void {

  const initialState = {
      message: `Apakah anda ingin menghapus semua data?`,
      cancelClicked: () => this.handleCancelClicked(),
      submitClicked: (data: any) => this.handleDeleteAllClicked(data)
  };

  // Open modal and pass the dynamic message
  this.modalRef = this.modalSvc.show(ModalComponent, { initialState });

  // Check if modalRef and modalRef.content are defined
  if (this.modalRef && this.modalRef.content) {
      this.modalRef.content.onClose.subscribe((res: any) => {
          if (res && res.state === 'delete') {
              this.deleteAll(); 
          } else if (res && res.state === 'cancel') {
              console.log('Delete canceled');
          }
          this.modalRef?.hide();
      });
  }
}

handleDeleteAllClicked(data: any) {
  console.log('Submit clicked with data:', data);
  this.deleteAll(); // Perform the delete operation here
}


  deleteEntry(id: number | undefined): void {
    console.log('Deleting entry with ID: ', id);

    // Call the delete service with the id
    this.dashBoardSvc.deleteV2(DashboardServiceType.USER_BUKUTAMU_V2, id).subscribe({
      next: (response) => {
        this.notyf.success(response?.message || 'Successfully deleted');
        this.showTable(); // Refresh the table after a successful deletion
      },
      error: (err) => {
        this.notyf.error(err?.message || 'Ada kesalahan dalam sistem');
        console.error('Error while deleting entry:', err);
      }
    });
  }

  

  deleteAll(): void {
    this.dashBoardSvc.delete(DashboardServiceType.USER_BUKUTAMU_V3).subscribe({
      next: (res) => {
        this.notyf.success(res?.message);
        this.showTable(); // Refresh the table after a successful deletion
      },
      error: (err) => {
        this.notyf.error(err?.message || 'Ada kesalahan dalam sistem');
        console.error('Error while deleting entry:', err);
      }
    })
  }

  showTable(){
    this.dashBoardSvc.list(DashboardServiceType.USER_BUKUTAMU).subscribe(res => {
      console.log(res);
      this.dataList = res?.data
      this.data = res
    })
  }
}

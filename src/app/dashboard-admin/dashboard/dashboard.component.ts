import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wc-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  rows: Array<any> = [];
  columns: Array<any> = [];

  constructor() { }

  ngOnInit(): void {
    this.columns = [
      { name: 'No', prop: 'number' },
      { name: 'Name', prop: 'name' },
      { name: 'Age', prop: 'age' }
    ];

    this.rows = [
      {
        name: 'Marta Mccoy',
        age: 31,
        auth: {
          canConfirm: true,
          canUpdate: true
        }
      },
      {
        name: 'Fanny Holman',
        age: 23,
        auth: {
          canDelete: true
        }
      },
      {
        name: 'Latonya Gibson',
        age: 22,
        auth: {
          canConfirm: true,
          canDelete: true
        }
      }
    ];
  }

  onConfirmClicked(row: any) {
    console.log('Confirm action:', row);
  }

  onEditClicked(row: any) {
    console.log('Edit action:', row);
  }

  onDeleteClicked(row: any) {
    console.log('Delete action:', row);
  }

}

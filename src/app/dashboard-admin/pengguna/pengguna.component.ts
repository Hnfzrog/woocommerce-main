import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wc-pengguna',
  templateUrl: './pengguna.component.html',
  styleUrls: ['./pengguna.component.scss']
})
export class PenggunaComponent implements OnInit {
  rows: Array<any> = [];
  columns: Array<any> = [];
  filteredRows: Array<any> = [];

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

    this.filteredRows = [...this.rows];
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
    console.log('Edit action:', row);
  }

  onDeleteClicked(row: any) {
    console.log('Delete action:', row);
  }
}

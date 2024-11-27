import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wc-ucapan',
  templateUrl: './ucapan.component.html',
  styleUrls: ['./ucapan.component.scss']
})
export class UcapanComponent implements OnInit {

  dataList = [
    { nama: 'John Doe', ucapan: 'Wah semoga dipermudah menjalani rumah tangga ya.' },
    { nama: 'Fatimah Az Zahra', ucapan: 'Lorem ipsum dolor sit amet consectetur.' },
    { nama: 'Zainuddin Akbar', ucapan: 'Lorem ipsum dolor sit amet consectetur.' },
  ];

  searchQuery = '';
  entriesToShow = 10;

  get filteredDataList() {
    // Filters data based on search query
    return this.dataList.filter((data) =>
      data.nama.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  deleteEntry(index: number): void {
    this.dataList.splice(index, 1);
  }

  deleteAll(): void {
    this.dataList = [];
  }

  constructor() { }

  ngOnInit(): void {
  }

  

}

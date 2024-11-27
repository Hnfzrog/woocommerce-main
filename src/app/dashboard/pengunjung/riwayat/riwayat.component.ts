import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'wc-riwayat',
  templateUrl: './riwayat.component.html',
  styleUrls: ['./riwayat.component.scss']
})
export class RiwayatComponent implements OnInit {
  visitors = Array(10).fill({ date: '8 Oktober 2024', name: 'Tamu Undangan' });
  itemsPerPage = 10;

  constructor() {}

  ngOnInit(): void {
    this.initChart();
  }

  initChart(): void {
    new Chart('visitorChart', {
      type: 'line',
      data: {
        labels: ['9 Sep 2024', '16 Sep 2024', '23 Sep 2024', '4 Okt 2024', '10 Okt 2024'],
        datasets: [
          {
            label: 'Pengunjung',
            data: [0, 15, 20, 25, 15],
            borderColor: '#00bcd4',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  updatePagination(): void {
    console.log(`Showing ${this.itemsPerPage} items per page`);
  }

}

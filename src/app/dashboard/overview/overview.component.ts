import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';

@Component({
  selector: 'wc-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [0, 10, 15, 20, 18],
        label: 'Visitors',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 2,
        fill: false
      }
    ],
    labels: ['9 Sep 2024', '16 Sep 2024', '23 Sep 2024', '4 Okt 2024', '10 Okt 2024']
  };

  public lineChartOptions: ChartOptions = {
    responsive: true
  };

  comments = [
    { name: 'John Doe', text: 'Wah semoga dipermudah menjalani rumah tangga ya.' },
    { name: 'Fatimah Az Zahra', text: 'Lorem ipsum dolor sit amet consectetur. Eu vitae amet nulla sapien dolor mi ...' },
    { name: 'Zainuddin Akbar', text: 'Lorem ipsum dolor sit amet consectetur. Eu vitae amet nulla sapien dolor mi ...' }
  ];

  chart: any;

  constructor() { }

  ngOnInit(): void {
    // Register Chart.js components
    Chart.register(...registerables);
    this.createChart();
  }

  createChart() {
    this.chart = new Chart("MyChart", {
      type: 'line', // Use 'line' chart type
      data: this.lineChartData, // Use lineChartData for the data
      options: this.lineChartOptions // Use lineChartOptions for the options
    });
  }
}

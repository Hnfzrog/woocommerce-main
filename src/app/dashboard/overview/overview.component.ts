
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';


Chart.register(...registerables);

interface DashboardCard {
  id: string;
  title: string;
  value: number;
  subtitle: string;
  color: string;
  active: boolean;
}

interface ChartDataPoint {
  date: string;
  totalPengunjung: number;
  konfirmasiKehadiran: number;
  doaUcapan: number;
  totalHadiah: number;
}

@Component({
  selector: 'wc-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})

export class OverviewComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  chart: Chart | null = null;
  isLoading = false;
  activeFilter = 'totalPengunjung';


  dashboardCards: DashboardCard[] = [
    {
      id: 'totalPengunjung',
      title: 'Total Pengunjung',
      value: 19,
      subtitle: 'Orang / 7 hari',
      color: '#10B981',
      active: true
    },
    {
      id: 'konfirmasiKehadiran',
      title: 'Konfirmasi Kehadiran',
      value: 17,
      subtitle: 'orang akan datang',
      color: '#F59E0B',
      active: false
    },
    {
      id: 'doaUcapan',
      title: 'Doa & Ucapan',
      value: 3,
      subtitle: 'orang memberi ucapan',
      color: '#06B6D4',
      active: false
    },
    {
      id: 'totalHadiah',
      title: 'Total Hadiah',
      value: 4,
      subtitle: 'diterima',
      color: '#EC4899',
      active: false
    }
  ];


  chartData: ChartDataPoint[] = [
    { date: '9 Sep 2024', totalPengunjung: 0, konfirmasiKehadiran: 0, doaUcapan: 0, totalHadiah: 0 },
    { date: '10 Sep 2024', totalPengunjung: 1, konfirmasiKehadiran: 1, doaUcapan: 0, totalHadiah: 0 },
    { date: '11 Sep 2024', totalPengunjung: 2, konfirmasiKehadiran: 2, doaUcapan: 0, totalHadiah: 0 },
    { date: '12 Sep 2024', totalPengunjung: 3, konfirmasiKehadiran: 2, doaUcapan: 0, totalHadiah: 1 },
    { date: '13 Sep 2024', totalPengunjung: 4, konfirmasiKehadiran: 3, doaUcapan: 1, totalHadiah: 1 },
    { date: '14 Sep 2024', totalPengunjung: 4, konfirmasiKehadiran: 4, doaUcapan: 1, totalHadiah: 1 },
    { date: '15 Sep 2024', totalPengunjung: 5, konfirmasiKehadiran: 5, doaUcapan: 1, totalHadiah: 1 },
    { date: '16 Sep 2024', totalPengunjung: 5, konfirmasiKehadiran: 6, doaUcapan: 1, totalHadiah: 1 },
    { date: '17 Sep 2024', totalPengunjung: 7, konfirmasiKehadiran: 7, doaUcapan: 1, totalHadiah: 2 },
    { date: '18 Sep 2024', totalPengunjung: 10, konfirmasiKehadiran: 8, doaUcapan: 1, totalHadiah: 2 },
    { date: '19 Sep 2024', totalPengunjung: 12, konfirmasiKehadiran: 9, doaUcapan: 1, totalHadiah: 2 },
    { date: '20 Sep 2024', totalPengunjung: 14, konfirmasiKehadiran: 10, doaUcapan: 2, totalHadiah: 2 },
    { date: '21 Sep 2024', totalPengunjung: 15, konfirmasiKehadiran: 12, doaUcapan: 2, totalHadiah: 3 },
    { date: '22 Sep 2024', totalPengunjung: 15, konfirmasiKehadiran: 13, doaUcapan: 2, totalHadiah: 3 },
    { date: '23 Sep 2024', totalPengunjung: 15, konfirmasiKehadiran: 14, doaUcapan: 2, totalHadiah: 3 },
    { date: '24 Sep 2024', totalPengunjung: 16, konfirmasiKehadiran: 14, doaUcapan: 2, totalHadiah: 3 },
    { date: '25 Sep 2024', totalPengunjung: 18, konfirmasiKehadiran: 15, doaUcapan: 2, totalHadiah: 3 },
    { date: '26 Sep 2024', totalPengunjung: 20, konfirmasiKehadiran: 15, doaUcapan: 2, totalHadiah: 4 },
    { date: '27 Sep 2024', totalPengunjung: 22, konfirmasiKehadiran: 16, doaUcapan: 3, totalHadiah: 4 },
    { date: '28 Sep 2024', totalPengunjung: 24, konfirmasiKehadiran: 16, doaUcapan: 3, totalHadiah: 4 },
    { date: '29 Sep 2024', totalPengunjung: 25, konfirmasiKehadiran: 16, doaUcapan: 3, totalHadiah: 4 },
    { date: '30 Sep 2024', totalPengunjung: 24, konfirmasiKehadiran: 16, doaUcapan: 3, totalHadiah: 4 },
    { date: '1 Okt 2024', totalPengunjung: 23, konfirmasiKehadiran: 16, doaUcapan: 3, totalHadiah: 4 },
    { date: '2 Okt 2024', totalPengunjung: 22, konfirmasiKehadiran: 16, doaUcapan: 3, totalHadiah: 4 },
    { date: '3 Okt 2024', totalPengunjung: 21, konfirmasiKehadiran: 17, doaUcapan: 3, totalHadiah: 4 },
    { date: '4 Okt 2024', totalPengunjung: 20, konfirmasiKehadiran: 17, doaUcapan: 3, totalHadiah: 4 },
    { date: '5 Okt 2024', totalPengunjung: 19, konfirmasiKehadiran: 17, doaUcapan: 3, totalHadiah: 4 },
    { date: '6 Okt 2024', totalPengunjung: 19, konfirmasiKehadiran: 17, doaUcapan: 3, totalHadiah: 4 },
    { date: '7 Okt 2024', totalPengunjung: 18, konfirmasiKehadiran: 17, doaUcapan: 3, totalHadiah: 4 },
    { date: '8 Okt 2024', totalPengunjung: 18, konfirmasiKehadiran: 17, doaUcapan: 3, totalHadiah: 4 },
    { date: '9 Okt 2024', totalPengunjung: 19, konfirmasiKehadiran: 17, doaUcapan: 3, totalHadiah: 4 },
    { date: '10 Okt 2024', totalPengunjung: 20, konfirmasiKehadiran: 17, doaUcapan: 3, totalHadiah: 4 }
  ];

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

    setTimeout(() => {
      this.initializeChart();
    }, 100);
  }

  onCardClick(cardId: string): void {
    this.isLoading = true;


    this.dashboardCards.forEach(card => {
      card.active = card.id === cardId;
    });

    this.activeFilter = cardId;


    setTimeout(() => {
      this.updateChart();
      this.isLoading = false;
    }, 300);
  }

  private initializeChart(): void {
    if (!this.chartCanvas) {
      console.error('Chart canvas not found');
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context from canvas');
      return;
    }


    if (this.chart) {
      this.chart.destroy();
    }

    const activeCard = this.dashboardCards.find(card => card.active);
    const borderColor = activeCard?.color || '#10B981';

    const config: ChartConfiguration = {
      type: 'line' as ChartType,
      data: {
        labels: this.getFilteredLabels(),
        datasets: [{
          label: activeCard?.title || 'Data',
          data: this.getFilteredData(),
          borderColor: borderColor,
          backgroundColor: borderColor + '20',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: borderColor,
          pointBorderColor: borderColor,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: borderColor,
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: (context) => {
                return context[0].label || '';
              },
              label: (context) => {
                const activeCard = this.dashboardCards.find(card => card.active);
                const suffix = this.getValueSuffix();
                return `${activeCard?.title || 'Value'}: ${context.parsed.y} ${suffix}`;
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            grid: {
              display: false
            },
            ticks: {
              maxTicksLimit: 5,
              color: '#6B7280'
            }
          },
          y: {
            display: true,
            beginAtZero: true,
            grid: {
              color: '#F3F4F6'
            },
            ticks: {
              color: '#6B7280',
              callback: function (tickValue) {
                return Number(tickValue).toFixed(0);
              }
            }
          }
        },
        elements: {
          point: {
            hoverBorderWidth: 3
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChart(): void {
    if (!this.chart) {
      this.initializeChart();
      return;
    }

    const activeCard = this.dashboardCards.find(card => card.active);
    const borderColor = activeCard?.color || '#10B981';


    this.chart.data.labels = this.getFilteredLabels();
    this.chart.data.datasets[0].data = this.getFilteredData();
    this.chart.data.datasets[0].label = activeCard?.title || 'Data';
    this.chart.data.datasets[0].borderColor = borderColor;
    this.chart.data.datasets[0].backgroundColor = borderColor + '20';

    this.chart.data.datasets[0].backgroundColor = borderColor + '20';
    this.chart.data.datasets[0].borderColor = borderColor;


    if (this.chart.options.plugins?.tooltip) {
      this.chart.options.plugins.tooltip.borderColor = borderColor;
    }

    this.chart.update('active');
  }

  private getFilteredLabels(): string[] {
    return this.chartData.map(item => item.date);
  }

  private getFilteredData(): number[] {
    const key = this.activeFilter as keyof ChartDataPoint;
    return this.chartData.map(item => item[key] as number);
  }

  private getValueSuffix(): string {
    const activeCard = this.dashboardCards.find(card => card.active);
    switch (activeCard?.id) {
      case 'totalPengunjung':
        return 'orang';
      case 'konfirmasiKehadiran':
        return 'orang';
      case 'doaUcapan':
        return 'ucapan';
      case 'totalHadiah':
        return 'hadiah';
      default:
        return '';
    }
  }


  getActiveCard(): DashboardCard | undefined {
    return this.dashboardCards.find(card => card.active);
  }


  formatNumber(value: number): string {
    return value.toLocaleString();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}

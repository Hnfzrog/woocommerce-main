import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-generate-undangan',
  templateUrl: './generate-undangan.component.html',
  styleUrls: ['./generate-undangan.component.scss'],
})
export class GenerateUndanganComponent implements OnInit {
  step = 1;
  titles: string[] = ['Isi Data Akun', 'Informasi Mempelai', 'Konfirmasi Data', 'Pembayaran'];
  formData: any = {}; // Data is passed between steps as a simple object

  ngOnInit(): void {
    console.log('all formdata:',this.formData);
    
  }

  get title(): string {
    return this.titles[this.step - 1] || 'Form';
  }

  get progress(): number {
    return (this.step / this.titles.length) * 100;
  }

  nextStep(data: any): void {
    console.log('Data yang diterima:', data);
    this.formData = { ...this.formData, ...data }; // Gabungkan data baru dengan yang lama
    if (this.step < this.titles.length) this.step++;
  }  

  prevStep(): void {
    if (this.step > 1) this.step--;
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-generate-undangan',
  templateUrl: './generate-undangan.component.html',
  styleUrls: ['./generate-undangan.component.scss'],
})
export class GenerateUndanganComponent {
  step = 1;
  titles: string[] = [];
  next: any;

  ngOnInit(): void {
    this.titles = ['Hallo', 'Isi Data Akun', 'Konfirmasi Data', 'Pembayaran'];
  }

  get title(): string {
    return this.titles[this.step - 1];
  }

  nextStep(): void {
    if (this.step < 4) this.step++;
  }

  prevStep(): void {
    if (this.step > 1) this.step--;
  }
}

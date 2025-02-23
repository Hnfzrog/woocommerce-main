import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'wc-data-registrasi',
  templateUrl: './data-registrasi.component.html',
  styleUrls: ['./data-registrasi.component.scss']
})
export class DataRegistrasiComponent implements OnInit {
  @Input() formData!: FormGroup;
  @Output() next = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  submit(): void {
    if (this.formData.valid) {
      this.next.emit();
    }
  }
}

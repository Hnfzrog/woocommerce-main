import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'wc-informasi-mempelai',
  templateUrl: './informasi-mempelai.component.html',
  styleUrls: ['./informasi-mempelai.component.scss']
})
export class InformasiMempelaiComponent implements OnInit {
  @Input() formData: any
  @Output() formDataChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

}

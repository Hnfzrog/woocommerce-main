import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'wc-regis-pembayaran',
  templateUrl: './regis-pembayaran.component.html',
  styleUrls: ['./regis-pembayaran.component.scss']
})
export class RegisPembayaranComponent implements OnInit {
  @Input() stories : any
  @Output() storiesChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'wc-regis-cerita',
  templateUrl: './regis-cerita.component.html',
  styleUrls: ['./regis-cerita.component.scss']
})
export class RegisCeritaComponent implements OnInit {
  @Input() stories: any
  @Output() storiesChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

}

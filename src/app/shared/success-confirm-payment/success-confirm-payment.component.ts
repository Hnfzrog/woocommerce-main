import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'wc-success-confirm-payment',
  templateUrl: './success-confirm-payment.component.html',
  styleUrls: ['./success-confirm-payment.component.scss']
})
export class SuccessConfirmPaymentComponent implements OnInit {

  @Input() message: string = '';

  constructor(
    private routeSvc: Router,
  ) { }

  ngOnInit() {
    console.log('message', this.message);
  }


  onRedirectToDasboard() {
    this.routeSvc.navigate(['/dashboard']);
  }

}

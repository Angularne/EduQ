import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {Customer, CustomerService} from '../../services/customer';

@Component({
  selector: 'customer',
  templateUrl: 'app/components/customer/customer.html'
})

export class CustomerController implements OnInit {
  customer:Customer;

  constructor(private _customerService:CustomerService, private _params:RouteParams) {
  }

  ngOnInit() {
    this.customer = this._customerService.getCustomer(+this._params.get('id')); //'+'converts to int, parseInt is bugged

  }
}

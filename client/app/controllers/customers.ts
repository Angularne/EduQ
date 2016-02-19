import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {Customer, CustomerService} from '../data_access/customer';

@Component({
  selector: 'customers',
  templateUrl: 'app/views/customers.html',
  directives: [ROUTER_DIRECTIVES]
})

export class CustomersController implements OnInit {
  customers:Customer[];
  newCustomer:Customer=new Customer();

  constructor(private customerService:CustomerService) {
    this.customers=customerService.getCustomers();
  }

  onNewCustomer() {
    this.customerService.addCustomer(this.newCustomer.name, this.newCustomer.city);
    this.newCustomer.name="";
    this.newCustomer.city="";
  }

  ngOnInit() { }
}

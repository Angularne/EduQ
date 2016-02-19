var nextCustomerId = 1;

export class Customer {
  public id:number;
  name:string;
  city:string;
  constructor(name:string="", city:string="") {
    if(name!="") {
      this.id = nextCustomerId++;
      this.name=name;
      this.city=city;
    }
  }
}

//Singleton (eager initialization) - achieved through @Component-providers in app.js
export class CustomerService {
  customers:Customer[]=[];
  
  constructor() {
    this.customers.push(new Customer("Ola", "Trondheim"));
    this.customers.push(new Customer("Kari", "Oslo"));
    this.customers.push(new Customer("Per", "Tromsø"));
  }
  
  getCustomers():Customer[] {
    return this.customers;
  }
  
  getCustomer(id:number):Customer {
    for(var c=0;c<this.customers.length;c++) {
      if(this.customers[c].id==id) {
        return this.customers[c];
      }
    }
  }
  
  addCustomer(name:string, city:string) {
    this.customers.push(new Customer(name, city));
  }
}
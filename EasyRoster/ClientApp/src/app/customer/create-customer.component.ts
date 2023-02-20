import { Component, Inject, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { map, Observable, of } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { CustomerEmailExistValidator } from './customer-validator.component';
import { ApiserviceService } from '../services/apiservice.service';
import { ActivatedRoute, Router } from '@angular/router';
export const BASE_URL = new InjectionToken<string>('BASE_URL');


@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css']
})
export class CreateCustomerComponent {

  @Input() customerId: string ;
  isNewCustomer: boolean = true;
  createCustomerForm: FormGroup;
  customerEmail: string;

  public customer: Customer;
  private customerEmailExistValidator: CustomerEmailExistValidator

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private apiService: ApiserviceService) {
    this.customerEmailExistValidator = new CustomerEmailExistValidator(this.apiService);

    this.createCustomerForm= this.formBuilder.group({
      firstName: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      cellphone: ['', [Validators.pattern('^[0-9]{10,}$'), Validators.required]],
      email: ['', {
        validators: [Validators.required, Validators.email], asyncValidators: [this.customerEmailExistValidator.validate.bind(this)]
      }],
      invoiceTotal: ['', [Validators.required, Validators.min(1)]],
      type: ['', [Validators.required]],
    });
  }

  initializeInput() {
    this.route.params.subscribe(params => {
      this.customerId = params['customerId']; 
    });
  }

  async ngOnInit() {
    this.initializeInput();
    if (this.customerId.trim().length > 0) {
      await this.apiService.GetCustomerById(this.customerId.trim()).then(x => this.customer = x);;
      this.isNewCustomer = false;
      this.customerEmail = this.customer.email;


      this.createCustomerForm.setValue({
        firstName: this.customer.firstName,
        surname: this.customer.surname,
        cellphone: this.customer.cellphone,
        email: this.customer.email,
        invoiceTotal: this.customer.invoiceTotal,
        type: this.customer.type
      });


      this.createCustomerForm.valueChanges.subscribe(formValues => {
        this.customer.firstName = formValues.firstName,
          this.customer.surname = formValues.surname,
          this.customer.cellphone = formValues.cellphone,
          this.customer.email = formValues.email,
          this.customer.invoiceTotal = formValues.invoiceTotal,
          this.customer.type = formValues.type
      });

      this.createCustomerForm.get('email')?.disable();
    }
  }

  createCustomerFromForm(): Customer {
    let customer = {} as Customer;

    customer.firstName = this.createCustomerForm.value.firstName;
    customer.surname = this.createCustomerForm.value.surname;
    customer.cellphone = this.createCustomerForm.value.cellphone;
    customer.email = this.isNewCustomer ? this.createCustomerForm.value.email : this.customerEmail;
    customer.invoiceTotal = this.createCustomerForm.value.invoiceTotal;
    customer.type = this.createCustomerForm.value.type;
    customer.id = this.isNewCustomer ? '' : this.customerId;
    return customer;
  }

  public AddNewCustomer():boolean {
    let customer = this.createCustomerFromForm();
 

    this.apiService.addCustomer(customer);
    return true;
  }

  public UpdateCustomer(): boolean {
    
    let customer = this.createCustomerFromForm();
    console.log(customer.id + customer.firstName + customer.email+customer.type);
    let res = null as any;
    this.apiService.updateCustomer(customer)?.subscribe(response => {
      console.log('Customer updated successfully');
      res = response;
    }, error => {
      console.error('Error updated customer', error);
    });
    return res!=null;
  }

  onSubmit(): void {
    if (this.createCustomerForm.invalid) {
      alert("Invalid information supplied, please fix.");
      return;
    }

    if (this.isNewCustomer) {
      if (!this.AddNewCustomer()) {
        //alert("Failed.");
        //return;
      }
    }
    else {
      if (!this.UpdateCustomer()) {
        //alert("Failed.");
        //return;
      }
    }
    alert("Saved!");
    this.router.navigate(['/customers']);
  }
}

export interface Customer {
  id: string;
  firstName: string;
  surname: string;
  cellphone: string;
  email: string;
  invoiceTotal: number;
  type: string;
}

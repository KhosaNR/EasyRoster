import { Component, Directive, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormBuilder, ValidationErrors, AsyncValidator, ValidatorFn, Validators, AsyncValidatorFn, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { InjectionToken } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { ApiserviceService } from '../services/apiservice.service';
import { Customer } from './create-customer.component';

export const BASE_URL = new InjectionToken<string>('BASE_URL');

export class CustomerEmailExistValidator implements AsyncValidator {

  constructor(private apiService: ApiserviceService) {
  }

  async validate(control: AbstractControl): Promise<ValidationErrors | Observable<ValidationErrors | null> | null> {
    const val = control.value;
    if (!val) { return { 'emailInvalid': true } }

    let customer = {} as Customer;
    await this.apiService.GetCustomerByEmail(val).then(result => customer = result as Customer);
    if (customer != undefined) {
      //alert('Email already exists for ' + customer.firstName);
      customer = {} as Customer;
      return { 'emailExists': true };
    }
    return null;
  }
}

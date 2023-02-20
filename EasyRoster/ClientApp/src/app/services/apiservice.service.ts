import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { map, Observable, of } from 'rxjs';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Customer } from '../customer/create-customer.component';
export const BASE_URL = new InjectionToken<string>('BASE_URL');

@Injectable({
  providedIn: 'root'
})

export class ApiserviceService {
  private apiUrl = '';

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.apiUrl = baseUrl;
  }

  //// Department
  //getDepartmentList(): Observable<any[]> {
  //  return this.http.get<any[]>(this.apiUrl + 'department/GetDepartment');
  //}

  //addDepartment(dept: any): Observable<any> {
  //  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //  return this.http.post<any>(this.apiUrl + 'department/AddDepartment', dept, httpOptions);
  //}

  //updateDepartment(dept: any): Observable<any> {
  //  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //  return this.http.put<any>(this.apiUrl + 'department/UpdateDepartment/', dept, httpOptions);
  //}

  //deleteDepartment(deptId: number): Observable<number> {
  //  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //  return this.http.delete<number>(this.apiUrl + 'department/DeleteDepartment/' + deptId, httpOptions);
  //}

  // Customer
  getCustomerList(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'Customers');
  }

  public async GetCustomerByEmail(value: string): Promise<Customer> {
    let customer:any;
    if (!value) return customer;
    await this.http.get(this.apiUrl + 'api/Customers/Email/' + value).toPromise().then(result => {
      customer = result as Customer;
    }, error => console.error(error));

    return customer;
  }

  public async GetCustomerById(value: string): Promise<Customer> {
    let customer: any;
    if (!value) return customer;
    await this.http.get(this.apiUrl + 'api/Customers/' + value).toPromise().then(result => {
      customer = result as Customer;
    }, error => console.error(error));

    return customer;
  }

  getAllCustomers(): Promise<Customer[]|any>{
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    let response = {} as Customer[];
    return this.http.get<Customer[]>(this.apiUrl + 'api/Customers').toPromise();
      //.then((res => { response = res as Customer[]; response.forEach(x=>console.log("my customer id ========"+x.firstName+x.id)); return res; }), error => console.error(error))
      //.catch(err=>console.log("Error while getting all customers"));
  }

  addCustomer(customer: any): Observable<any[]> | null {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    let response: any;
    this.http.post<any>(this.apiUrl + 'api/Customers', customer)
      .subscribe(res => { response = res; console.log(res); return res; });
    ;
    return response;
  }

  updateCustomer(customer: Customer): Observable<any>|null {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    let response: any;
    this.http.put<Customer>(this.apiUrl + 'api/Customers/' + customer.id, customer)
      .subscribe(res => { response = res; return res; }, error => { return null});
    return response;
  }

  deleteCustomer(cusId: string): Observable<any> {
    return this.http.delete<any>(this.apiUrl + 'api/Customers/' + cusId);
  }

  //uploadPhoto(photo: any) {
  //  return this.http.post(this.apiUrl + 'employee/savefile', photo);
  //}

  //getAllDepartmentNames(): Observable<any[]> {
  //  return this.http.get<any[]>(this.apiUrl + 'employee/GetAllDepartmentNames');
  //}

}

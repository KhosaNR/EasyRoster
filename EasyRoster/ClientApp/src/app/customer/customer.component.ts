import { Component, Inject, NgModule, ViewChild, OnDestroy, ChangeDetectorRef, ViewContainerRef, OnInit, AfterViewInit } from '@angular/core';
import { Customer } from './create-customer.component';
import { ApiserviceService } from '../services/apiservice.service';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { from, interval, Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})


export class CustomerComponent implements  OnInit, AfterViewInit {
  public customers: Customer[] = [];
  filteringString: string = "";

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  customerSource: MatTableDataSource<Customer>;
  displayedColumns: string[] = ['firstName', 'surname', 'cellphone', 'email', 'invoiceTotal', 'Id'];
  interval: number = 5000;
  timerSubscription: Subscription;

  async ngOnInit() {
    this.customerSource.connect().subscribe(() => {
      this.changeDetectorRefs.detectChanges();
    });
    this.timerSubscription = interval(this.interval)
      .subscribe(async () => {
        await this.updateDate();
        this.customerSource.data = this.customers;
        this.customerSource.sort = this.sort;
        this.customerSource.paginator = this.paginator;
      });
   
    this.customerSource.data = this.customers;
    this.customerSource.sort = this.sort;
    this.customerSource.paginator = this.paginator;
  }

  async updateDate() {
    await this.apiService.getAllCustomers()?.then(data => {
      this.customers = data as Customer[];
    }).catch((err) => console.log(err));
  }

  constructor(private apiService: ApiserviceService, private changeDetectorRefs: ChangeDetectorRef, private router: Router) {
    this.customerSource = new MatTableDataSource<Customer>(this.customers);
    this.customerSource.sort = this.sort;
    this.customerSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    // unsubscribe from the timer when the component is destroyed
    this.timerSubscription.unsubscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.customerSource.filter = filterValue.trim().toLowerCase();
    this.filteringString = filterValue;
  }

  ngAfterViewInit() {
    
  }

  viewCustomerClicked(id: string) {
    this.router.navigate(['/create-customer', id]);
  }

  clearSearch() {
    this.filteringString = "";
    this.customerSource.filter = this.filteringString;
  }

  async deleteCustomer(cusId: string, name: string) {
    if (window.confirm("Are you sure you want delete " + name + "?")) {
      this.apiService.deleteCustomer(cusId).subscribe(response => {
        console.log('Customer deleted successfully');
      }, error => {
        console.error('Error deleting customer', error);
      });
      await this.updateDate()
    }
  }
}


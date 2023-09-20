import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerModel } from '../models/CustomerModel';
import { SingleResponseModel } from '../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  apiUrl = `${environment.apiUrl}/api/customers/`;

  constructor(
    private httpClient: HttpClient,
  ) { }

  getCustomerByUser(userId: number): Observable<SingleResponseModel<CustomerModel>> {
    let newPath = this.apiUrl + "getbyuserid?userId=" + userId
    return this.httpClient.get<SingleResponseModel<CustomerModel>>(newPath)
  }
}

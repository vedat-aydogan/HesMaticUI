import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SingleResponseModel } from '../models/singleResponseModel';
import { LocationModel } from '../models/locationModel';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  apiUrl = `${environment.apiUrl}/api/locations/`;

  constructor(private httpClient: HttpClient) { }

  getLocationByUser(userId: number): Observable<SingleResponseModel<LocationModel>> {
    let newPath = this.apiUrl + "getbyuserid?userId=" + userId
    return this.httpClient.get<SingleResponseModel<LocationModel>>(newPath)
  }
}

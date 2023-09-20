import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckVisitorHesCodeModel } from '../models/checkVisitorHesCodeModel';
import { CheckVisitorResponseModel } from '../models/checkVisitorResponseModel';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HesRunService {

  apiUrl = `${environment.apiHesUrl}/services/g2g/test/saglik/hes/`;
  // apiUrl = `${environment.apiUrl}/api/lifefitshome/`;

  // username: string = "MEHMETZAHÄ°D-G2G-TEST";
  // password: string = "WbRLqDjjFGay9JUbpX";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(environment.apiHesUser + ":" + environment.apiHesPwd)
    })
  };

  constructor(private httpClient: HttpClient) { }

  // sendCheckVisitorHesCodeManually(checkVisitorHesCodeModel: CheckVisitorHesCodeModel): Observable<CheckVisitorResponseModel> {
  //   return this.httpClient.post<CheckVisitorResponseModel>(this.apiUrl + "checkvisitorhescode", checkVisitorHesCodeModel)
  // }

  // sendCheckVisitorHesCodeWithQrCode(checkVisitorHesCodeModel: CheckVisitorHesCodeModel): Observable<CheckVisitorResponseModel> {
  //   return this.httpClient.post<CheckVisitorResponseModel>(this.apiUrl + "checkvisitorhescode", checkVisitorHesCodeModel)
  // }

  sendCheckVisitorHesCodeManually(checkVisitorHesCodeModel:CheckVisitorHesCodeModel):Observable<CheckVisitorResponseModel>{
    return this.httpClient.post<CheckVisitorResponseModel>(this.apiUrl + "check-visitor-hes-code", checkVisitorHesCodeModel, this.httpOptions)
  }

  sendCheckVisitorHesCodeWithQrCode(checkVisitorHesCodeModel:CheckVisitorHesCodeModel):Observable<CheckVisitorResponseModel>{
    return this.httpClient.post<CheckVisitorResponseModel>(this.apiUrl + "check-visitor-hes-code", checkVisitorHesCodeModel, this.httpOptions)
  } 

}

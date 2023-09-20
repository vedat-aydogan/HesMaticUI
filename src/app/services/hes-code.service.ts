import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HesCodeModel } from '../models/hesCodeModel';
import { ResponseModel } from '../models/responseModel';
import { environment } from '../../environments/environment';
import { ListResponseModel } from '../models/listResponseModel';

@Injectable({
  providedIn: 'root'
})
export class HesCodeService {

  apiUrl = `${environment.apiUrl}/api/hescodes/`

  constructor(private httpClient: HttpClient) { }

  add(hesCodeModel: HesCodeModel): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "add", hesCodeModel);
  }

  getHesCodesByUser(userId: number): Observable<ListResponseModel<HesCodeModel>> {
    let newPath = this.apiUrl + "getbyuserid?userId=" + userId
    return this.httpClient.get<ListResponseModel<HesCodeModel>>(newPath)
  }

  getHesCodes(): Observable<ListResponseModel<HesCodeModel>> {
    let newPath = this.apiUrl + "getall"
    return this.httpClient.get<ListResponseModel<HesCodeModel>>(newPath)
  }

  getHesCodesOfTodayByUserId(userId: number): Observable<ListResponseModel<HesCodeModel>> {
    let newPath = this.apiUrl + "gethescodesoftodaybyuserid?userId=" + userId
    return this.httpClient.get<ListResponseModel<HesCodeModel>>(newPath)
  }

  getHesCodesByDateRange(userId: number, startDate: string, endDate: string): Observable<ListResponseModel<HesCodeModel>> {
    let newPath = this.apiUrl + "gethescodesbydaterange?userId=" + userId + "&startDate=" + startDate + "&endDate=" + endDate
    return this.httpClient.get<ListResponseModel<HesCodeModel>>(newPath)
  }
}

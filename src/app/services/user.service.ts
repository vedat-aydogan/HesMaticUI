import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { SingleResponseModel } from '../models/singleResponseModel';
import { UserModel } from '../models/userModel';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  apiUrl = `${environment.apiUrl}/api/auth/`;

  decodedToken: any

  constructor(private httpClient: HttpClient, private jwtHelperService: JwtHelperService) { }

  getUserByUserId(userId: number): Observable<SingleResponseModel<UserModel>> {
    let newPath = this.apiUrl + "getuserbyid?userId=" + userId
    return this.httpClient.get<SingleResponseModel<UserModel>>(newPath)
  }

  getUserByEmail(email: string): Observable<SingleResponseModel<UserModel>> {
    let newPath = this.apiUrl + "getuserbyemail?email=" + email
    return this.httpClient.get<SingleResponseModel<UserModel>>(newPath)
  }

  getUserId(): number {
    this.decodedToken = this.jwtHelperService.decodeToken()
    return Number(this.decodedToken[Object.keys(this.decodedToken).filter(x => x.endsWith("/nameidentifier"))[0]])
  }

}

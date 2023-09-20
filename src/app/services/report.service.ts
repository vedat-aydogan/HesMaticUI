import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  apiUrl=`${environment.apiUrl}/api/`

  constructor() { }
}
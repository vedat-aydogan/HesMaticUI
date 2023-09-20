import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { DateRangeModel } from 'src/app/models/dateRangeModel';
import { HesCodeModel } from 'src/app/models/hesCodeModel';
import { HesCodeService } from 'src/app/services/hes-code.service';
// import * as _moment from 'moment';
// import * as moment from 'moment';

@Component({
  selector: 'app-datepicker-date-range',
  templateUrl: './datepicker-date-range.component.html',
  styleUrls: ['./datepicker-date-range.component.css']
})
export class DatepickerDateRangeComponent implements OnInit {

  // range = new FormGroup({
  //   start: new FormControl(),
  //   end: new FormControl()
  // });

  // hesCodes: HesCodeModel[]

  constructor(private hesCodeService: HesCodeService) { }

  ngOnInit(): void { }

  // getHesCodesByDateRange() {
  //   let dateRangeModel: DateRangeModel = Object.assign({}, this.range.value)
    
  //   dateRangeModel.start = moment(dateRangeModel.start).format('L')
  //   dateRangeModel.end = moment(dateRangeModel.end).format('L')
    
  //   this.hesCodeService.getHesCodesByDateRange(2, dateRangeModel.start, dateRangeModel.end).subscribe(response => {

  //     this.hesCodes = response.data

  //   }, responseError => {

  //   })
  // }

}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CustomerModel } from 'src/app/models/CustomerModel';
import { DateRangeModel } from 'src/app/models/dateRangeModel';
import { HesCodeModel } from 'src/app/models/hesCodeModel';
import { UserModel } from 'src/app/models/userModel';
import { CustomerService } from 'src/app/services/customer.service';
import { HesCodeService } from 'src/app/services/hes-code.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  userId: number
  user: UserModel
  userIdLoaded: boolean = false
  userDataLoaded: boolean = false
  dataLoaded: boolean = false;
  dateOfToday: Date = new Date()

  customer: CustomerModel
  hesCodes: HesCodeModel[]
  hesCodesOfToday: HesCodeModel[]
  totalHesCodesOfTodayCount: number
  risklyHesCodesOfTodayCount: number
  risklessHesCodesOfTodayCount: number

  constructor(
    private userService: UserService,
    private customerService: CustomerService,
    private hesCodeService: HesCodeService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {

    this.userId = this.userService.getUserId()
    this.getUserById(this.userId);
    this.getCustomerByUserId(this.userId);
    // this.getHesCodesByUserId(this.userId);
    this.getHesCodesOfTodayByUserId(this.userId)
  }

  getUserById(userId: number) {

    this.userService.getUserByUserId(userId).subscribe(response => {
      this.user = response.data
      this.userIdLoaded = true
    })
  }

  getCustomerByUserId(userId: number) {
    this.customerService.getCustomerByUser(userId).subscribe(response => {
      this.customer = response.data
      this.userDataLoaded = true
    })
  }

  getHesCodesByUserId(userId: number) {
    this.hesCodeService.getHesCodesByUser(userId).subscribe(response => {
      this.hesCodes = response.data
      this.dataLoaded = true;
    })
  }

  getHesCodesOfTodayByUserId(userId: number) {
    this.hesCodeService.getHesCodesOfTodayByUserId(userId).subscribe(response => {
      this.hesCodesOfToday = response.data

      this.risklyHesCodesOfTodayCount = this.hesCodesOfToday.filter(hesCode => hesCode.healthStatus === "RISKY").length
      this.risklessHesCodesOfTodayCount = this.hesCodesOfToday.filter(hesCode => hesCode.healthStatus === "RISKLESS").length
      this.totalHesCodesOfTodayCount = this.hesCodesOfToday.length

      this.dataLoaded = true;
    })
  }

  getRiskyOrRisklessSpanClass(hesCode: HesCodeModel): string {
    if (hesCode.healthStatus == 'RISKY') {
      return "badge bg-danger"
    } else {
      return "badge bg-success"
    }
  }

  reloadCurrentPage() {
    window.location.reload();
  }

  getHesCodesByDateRange() {
    let dateRangeModel: DateRangeModel = Object.assign({}, this.range.value)

    dateRangeModel.start = moment(dateRangeModel.start).format('L')
    dateRangeModel.end = moment(dateRangeModel.end).format('L')

    this.hesCodeService.getHesCodesByDateRange(this.userId, dateRangeModel.start, dateRangeModel.end).subscribe(response => {
      if (response.data.length == 0) {
        this.toastrService.info("Girmiş olduğunuz tarih aralığında hiç hes kodu okutulmamıştır.")
      }
      this.hesCodes = response.data
    }, responseError => {
      this.toastrService.warning("Lütfen başlangıç ve bitiş tarihi alanlarını boş bırakmayınız.")
    })
  }

}

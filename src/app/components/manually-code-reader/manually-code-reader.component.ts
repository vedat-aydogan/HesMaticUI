import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { LocationModel } from 'src/app/models/locationModel';
import { LocationService } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { timer } from 'rxjs';
import { HesCodeService } from 'src/app/services/hes-code.service';
import { ToastrService } from 'ngx-toastr';
import { HesCodeModel } from 'src/app/models/hesCodeModel';
import { AudioService } from 'src/app/services/audio.service';
import { CheckVisitorHesCodeModel } from 'src/app/models/checkVisitorHesCodeModel';
import { HesRunService } from 'src/app/services/hes-run.service';

@Component({
  selector: 'app-manually-code-reader',
  templateUrl: './manually-code-reader.component.html',
  styleUrls: ['./manually-code-reader.component.css']
})
export class ManuallyCodeReaderComponent implements OnInit {

  manuallyHesCodeForm: FormGroup
  location: LocationModel
  locationDataLoaded = false;
  userId: number
  riskyAndRisklessManuallyModal: Modal
  errorManuallyModal: Modal
  errorManuallyContent: string
  hesCodeModel: HesCodeModel = new HesCodeModel()

  manually_current_health_status: string
  manually_masked_firstname: string
  manually_masked_lastname: string
  manually_masked_identity_number: string
  // manually_expiration_date: string

  constructor(
    private hesRunService: HesRunService,
    private userService: UserService,
    private locationService: LocationService,
    private formBuilder: FormBuilder,
    private hesCodeService: HesCodeService,
    private toastrService: ToastrService,
    private audioService: AudioService,
  ) { }

  ngOnInit(): void {

    this.userId = this.userService.getUserId()
    this.getLocationByUser(this.userId)
    this.createManuallyHesCodeForm()

  }

  getLocationByUser(userId: number) {
    this.locationService.getLocationByUser(userId).subscribe(response => {
      this.location = response.data
      this.locationDataLoaded = true
    })
  }

  createManuallyHesCodeForm() {
    this.manuallyHesCodeForm = this.formBuilder.group({
      city: [""],
      district: [""],
      explicit_address: [""],
      hes_code: ["", Validators.required]
    })
  }

  sendCheckVisitorHesCodeManually() {

    if (this.manuallyHesCodeForm.valid) {

      let checkVisitorHesCodeModel: CheckVisitorHesCodeModel = Object.assign({}, this.manuallyHesCodeForm.value)
      checkVisitorHesCodeModel.city = this.location.city
      checkVisitorHesCodeModel.district = this.location.district
      checkVisitorHesCodeModel.explicit_address = this.location.address

      this.hesRunService.sendCheckVisitorHesCodeManually(checkVisitorHesCodeModel).subscribe(response => {

        this.manually_current_health_status = response.current_health_status;
        this.manually_masked_firstname = response.masked_firstname;
        this.manually_masked_lastname = response.masked_lastname;
        this.manually_masked_identity_number = response.masked_identity_number;
        // this.manually_expiration_date = response.expiration_date;

        this.hesCodeModel.userId = this.userId
        this.hesCodeModel.code = checkVisitorHesCodeModel.hes_code
        this.hesCodeModel.healthStatus = this.manually_current_health_status
        this.hesCodeModel.firstName = this.manually_masked_firstname
        this.hesCodeModel.lastName = this.manually_masked_lastname
        this.hesCodeModel.identityNumber = this.manually_masked_identity_number
        this.addHesCode(this.hesCodeModel)

      }, responseError => {

        this.errorManuallyContent = responseError.error.title

        this.playBeforeErrorModal(this.manually_current_health_status)

        timer(900).subscribe(val => {
          this.openErrorManuallyModal();
          this.playErrorAudioHealthStatus(this.manually_current_health_status)
        })

      })

    } else {

      this.toastrService.warning("Lütfen hes kodunuzu yazınız.", "Bilgilendirme")

    }

  }

  openRiskyAndRisklessManuallyModal() {
    this.riskyAndRisklessManuallyModal = new bootstrap.Modal(document.getElementById('riskyAndRisklessManuallyModal'), {
      keyboard: false
    })
    this.riskyAndRisklessManuallyModal.show();
  }

  openErrorManuallyModal() {
    this.errorManuallyModal = new bootstrap.Modal(document.getElementById('errorManuallyModal'), {
      keyboard: false
    })
    this.errorManuallyModal.show();
  }

  closeRiskyAndRisklessManuallyModal(closingTime: number) {

    timer(closingTime).subscribe(val => {
      $('#riskyAndRisklessManuallyModal').modal('hide')
    })

  }

  addHesCode(hesCodeModel: HesCodeModel) {
    this.hesCodeService.add(hesCodeModel).subscribe(response => {

      // this.hesCodeAddSuccess = response.success

      this.playBeforeRiskyAndRisklessModal(this.manually_current_health_status)

      timer(900).subscribe(val => {

        this.openRiskyAndRisklessManuallyModal()
        this.playRiskyAndRisklessAudioHealthStatus(this.manually_current_health_status);

        if (this.manually_current_health_status == 'RISKLESS') {
          this.closeRiskyAndRisklessManuallyModal(1500)
        }

      })

    }, responseError => {

      this.errorManuallyContent = "Hes kodu eklenemedi. Lütfen tekrar deneyiniz."
      this.openErrorManuallyModal();

    })
  }

  playBeforeRiskyAndRisklessModal(currentHealthStatus: string) {
    if (currentHealthStatus == 'RISKY') {
      this.audioService.playAudio('../../assets/audios/audioBeforeModalRisky.mp3')
    } else {
      this.audioService.playAudio('../../assets/audios/audioBeforeModalRiskless.mp3')
    }
  }

  playBeforeErrorModal(currentHealthStatus: string) {
    this.audioService.playAudio('../../assets/audios/audioBeforeModalError.mp3')
  }

  playRiskyAndRisklessAudioHealthStatus(currentHealthStatus: string) {
    if (currentHealthStatus == 'RISKY') {
      this.audioService.playAudio('../../assets/audios/risky.mp3')
    } else {
      this.audioService.playAudio('../../assets/audios/riskless.mp3')
    }
  }

  playErrorAudioHealthStatus(currentHealthStatus: string) {
    this.audioService.playAudio('../../assets/audios/invalid.mp3')
  }

  getRiskyAndRisklessManuallyModalClass(): string {

    if (this.manually_current_health_status == 'RISKY') {
      return "modal-risky"
    } else {
      return "modal-riskless"
    }

  }

  getRiskyAndRisklessManuallyModalHealtStatusClass(): string {

    if (this.manually_current_health_status == 'RISKY') {
      return "health-status-risky"
    } else {
      return "health-status-riskless"
    }

  }

  getRiskyAndRisklessManuallyModalButtonClass(): string {

    if (this.manually_current_health_status == 'RISKY') {
      return "btn btn-danger"
    } else {
      return "btn btn-success"
    }

  }

}

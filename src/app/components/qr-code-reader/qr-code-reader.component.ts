import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HesCodeModel } from 'src/app/models/hesCodeModel';
import { LocationModel } from 'src/app/models/locationModel';
import { HesRunService } from 'src/app/services/hes-run.service';
import { LocationService } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { CheckVisitorHesCodeModel } from 'src/app/models/checkVisitorHesCodeModel';
import { HesCodeService } from 'src/app/services/hes-code.service';
import { AudioService } from 'src/app/services/audio.service';
import { BehaviorSubject, timer } from 'rxjs';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-qr-code-reader',
  templateUrl: './qr-code-reader.component.html',
  styleUrls: ['./qr-code-reader.component.css']
})

export class QrCodeReaderComponent implements OnInit {

  availableDevices: MediaDeviceInfo[];
  deviceCurrent: MediaDeviceInfo;
  deviceCurrentLoaded: boolean = false
  // deviceSelected: string;
  formatsEnabled: BarcodeFormat[] = [
    // BarcodeFormat.CODE_128,
    // BarcodeFormat.DATA_MATRIX,
    // BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
  ];
  hasDevices: boolean;
  hasPermission: boolean;
  qrHesCode: string = "";
  torchEnabled = false;
  // scannerEnabled = true;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;
  @Input()
  delayBetweenScanSuccess = 4000;

  qrHesCodeForm: FormGroup
  hesCodeModel: HesCodeModel = new HesCodeModel()
  location: LocationModel
  userId: number
  errorQrContent: string
  locationDataLoaded: boolean = false;
  // hesCodeAddSuccess: boolean = false
  riskyAndRisklessQrModal: Modal
  errorQrModal: Modal
  // qrScannerUpdateTime: number = 4000

  qr_current_health_status: string
  qr_masked_firstname: string
  qr_masked_lastname: string
  qr_masked_identity_number: string
  // expiration_date: string

  constructor(
    private hesRunService: HesRunService,
    private locationService: LocationService,
    private userService: UserService,
    private toastrService: ToastrService,
    private hesCodeService: HesCodeService,
    private audioService: AudioService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.userId = this.userService.getUserId()
    this.getLocationByUser(this.userId)
    this.createQrHesCodeForm()

  }

  clearResult(): void {
    this.qrHesCode = null;
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onCodeResult(qrHesCode: string) {
    this.qrHesCode = qrHesCode;
    console.log(qrHesCode);
    this.sendCheckVisitorHesCodeWithQrCode()
  }

  onDeviceChange() {
    this.deviceCurrent = this.availableDevices[0]
    this.deviceCurrentLoaded = true
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable$.next(isCompatible || false);
  }

  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;
  }

  toggleTryHarder(): void {
    this.tryHarder = !this.tryHarder;
  }

  createQrHesCodeForm() {
    this.qrHesCodeForm = this.formBuilder.group({
      city: [""],
      district: [""],
      explicit_address: [""],
      hes_code: [""]
    })
  }

  sendCheckVisitorHesCodeWithQrCode() {

    let checkVisitorHesCodeModel: CheckVisitorHesCodeModel = Object.assign({}, this.qrHesCodeForm.value)
    checkVisitorHesCodeModel.city = this.location.city
    checkVisitorHesCodeModel.district = this.location.district
    checkVisitorHesCodeModel.explicit_address = this.location.address
    checkVisitorHesCodeModel.hes_code = this.qrHesCode

    this.hesRunService.sendCheckVisitorHesCodeWithQrCode(checkVisitorHesCodeModel).subscribe(response => {

      this.qr_current_health_status = response.current_health_status;
      this.qr_masked_firstname = response.masked_firstname;
      this.qr_masked_lastname = response.masked_lastname;
      this.qr_masked_identity_number = response.masked_identity_number;
      // this.expiration_date = response.expiration_date;

      this.hesCodeModel.userId = this.userId
      this.hesCodeModel.code = checkVisitorHesCodeModel.hes_code
      this.hesCodeModel.healthStatus = this.qr_current_health_status
      this.hesCodeModel.firstName = this.qr_masked_firstname
      this.hesCodeModel.lastName = this.qr_masked_lastname
      this.hesCodeModel.identityNumber = this.qr_masked_identity_number
      this.addHesCode(this.hesCodeModel)

    }, responseError => {

      this.errorQrContent = responseError.error.title

      this.playBeforeErrorModal(this.qr_current_health_status)

      timer(900).subscribe(val => {
        this.openErrorQrModal();
        this.playErrorAudioHealthStatus(this.qr_current_health_status)
      })

    })

  }

  getLocationByUser(userId: number) {

    this.locationService.getLocationByUser(userId).subscribe(response => {
      this.location = response.data
      this.locationDataLoaded = true
    })

  }

  getRiskyAndRisklessQrModalButtonClass(): string {

    if (this.qr_current_health_status == 'RISKY') {
      return "btn btn-danger"
    } else {
      return "btn btn-success"
    }

  }

  getRiskyAndRisklessQrModalClass(): string {

    if (this.qr_current_health_status == 'RISKY') {
      return "modal-risky"
    } else {
      return "modal-riskless"
    }

  }

  getRiskyAndRisklessQrModalHealtStatusClass(): string {

    if (this.qr_current_health_status == 'RISKY') {
      return "health-status-risky"
    } else {
      return "health-status-riskless"
    }

  }

  addHesCode(hesCodeModel: HesCodeModel) {
    this.hesCodeService.add(hesCodeModel).subscribe(response => {

      // this.hesCodeAddSuccess = response.success
      this.playBeforeRiskyAndRisklessModal(this.qr_current_health_status)

      timer(900).subscribe(val => {
        this.openRiskyAndRisklessQrModal()
        this.playRiskyAndRisklessAudioHealthStatus(this.qr_current_health_status);

        if (this.qr_current_health_status == 'RISKLESS') {
          this.closeRiskyAndRisklessQrModal(1500)
        }
      })

    }, responseError => {

      this.errorQrContent = "Hes kodu eklenemedi. Lütfen tekrar deneyiniz."
      this.openErrorQrModal();

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

  openRiskyAndRisklessQrModal() {

    this.riskyAndRisklessQrModal = new bootstrap.Modal(document.getElementById('riskyAndRisklessQrModal'), {
      keyboard: false
    })

    this.riskyAndRisklessQrModal.show();

  }

  openErrorQrModal() {
    this.errorQrModal = new bootstrap.Modal(document.getElementById('errorQrModal'), {
      keyboard: false
    })
    this.errorQrModal.show();
  }

  closeRiskyAndRisklessQrModal(closingTime: number) {

    timer(closingTime).subscribe(val => {
      $('#riskyAndRisklessQrModal').modal('hide')
    })

    // setTimeout(function(){
    //   $('#riskyAndRisklessQrModal').modal('hide')
    // }, 4000);

  }

}
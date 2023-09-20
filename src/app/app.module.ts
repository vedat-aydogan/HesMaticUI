import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { LogoutComponent } from './components/logout/logout.component';
import { HesRunComponent } from './components/hes-run/hes-run.component';
import { JwtModule } from '@auth0/angular-jwt';
import { QrCodeReaderComponent } from './components/qr-code-reader/qr-code-reader.component';
import { HealthStatusPipe } from './pipes/health-status.pipe';
import { ManuallyCodeReaderComponent } from './components/manually-code-reader/manually-code-reader.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { AdminComponent } from './components/admin/admin.component';
import { RiskyOrRisklessPipe } from './pipes/risky-or-riskless.pipe';
import { DatepickerDateRangeComponent } from './components/datepicker-date-range/datepicker-date-range.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input'
import { DateAdapter, MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    LogoutComponent,
    HesRunComponent,
    QrCodeReaderComponent,
    HealthStatusPipe,
    ManuallyCodeReaderComponent,
    AdminComponent,
    RiskyOrRisklessPipe,
    DatepickerDateRangeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({ positionClass: "toast-top-center" }),
    JwtModule.forRoot({ config: { tokenGetter: tokenGetter, allowedDomains: ["localhost:4200"] } }),
    ZXingScannerModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    // MatMomentDateModule    
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' },
    // { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {strict: true} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

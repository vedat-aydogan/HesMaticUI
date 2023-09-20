import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { DatepickerDateRangeComponent } from './components/datepicker-date-range/datepicker-date-range.component';
import { HesRunComponent } from './components/hes-run/hes-run.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  { path: "", pathMatch: "full", component: LoginComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "home", component: HomeComponent, canActivate: [LoginGuard] },
  { path: "hes-run", component: HesRunComponent, canActivate: [LoginGuard] },
  { path: "admin", component: AdminComponent, canActivate: [LoginGuard] },
  { path: "datepicker", component: DatepickerDateRangeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

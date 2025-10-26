import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { CreateShipmentComponent } from './shipment/create-shipment.component';
import { ShipmentDetailComponent } from './shipment/shipment-detail.component';
import { AdminLayoutComponent } from './shipment/admin-layout.component';
import { ManageEmployeeComponent } from './employee/manage-employee.component';
import { AdminGuard } from './guards/admin.guard';
import { EmployeeGuard } from './guards/employee.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'shipment/create', component: CreateShipmentComponent },
  { path: 'shipment/:id', component: ShipmentDetailComponent },
  { path: 'admin/shipments', component: AdminLayoutComponent, canActivate: [EmployeeGuard] },
  { path: 'admin/employees', component: ManageEmployeeComponent, canActivate: [AdminGuard] }
];

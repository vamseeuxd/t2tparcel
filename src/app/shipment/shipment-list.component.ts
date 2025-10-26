import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShipmentService } from '../services/shipment.service';
import { AuthService } from '../services/auth';
import { Shipment, STATUS_LABELS } from '../models/shipment.model';

@Component({
  selector: 'app-shipment-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>My Shipments</h3>
        <button class="btn btn-primary" (click)="createShipment()">
          <i class="fas fa-plus me-2"></i>New Shipment
        </button>
      </div>
      
      <div class="row" *ngIf="shipments.length > 0">
        <div class="col-md-6 col-lg-4 mb-3" *ngFor="let shipment of shipments">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <small class="text-muted">#{{ shipment.id?.substring(0, 8) }}</small>
              <span class="badge" [class]="getStatusBadgeClass(shipment.status)">
                {{ STATUS_LABELS[shipment.status] }}
              </span>
            </div>
            <div class="card-body">
              <h6 class="card-title">{{ shipment.customerName }}</h6>
              <p class="card-text small mb-2">
                <strong>From:</strong> {{ shipment.fromAddress }}<br>
                <strong>To:</strong> {{ shipment.toAddress }}
              </p>
              <p class="card-text small mb-2">
                <strong>Weight:</strong> {{ shipment.weight }}kg<br>
                <strong>Method:</strong> {{ shipment.requestMethod | titlecase }}
              </p>
              <p class="card-text small text-muted">
                Created: {{ shipment.createdAt | date:'short' }}
              </p>
            </div>
            <div class="card-footer">
              <button class="btn btn-outline-primary btn-sm w-100" (click)="viewShipment(shipment.id!)">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="text-center py-5" *ngIf="shipments.length === 0 && !loading">
        <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
        <h5 class="text-muted">No shipments found</h5>
        <p class="text-muted">Create your first shipment to get started</p>
        <button class="btn btn-primary" (click)="createShipment()">Create Shipment</button>
      </div>
      
      <div class="text-center py-5" *ngIf="loading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  `
})
export class ShipmentListComponent implements OnInit, OnDestroy {
  shipments: Shipment[] = [];
  loading = true;
  STATUS_LABELS = STATUS_LABELS;
  private subscription?: Subscription;

  constructor(
    private shipmentService: ShipmentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadShipments();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  loadShipments() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.subscription = this.shipmentService.getShipmentsByCustomer(user.uid)
      .subscribe(shipments => {
        this.shipments = shipments;
        this.loading = false;
      });
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses: Record<string, string> = {
      requested: 'bg-info',
      details_added: 'bg-info',
      picked_up: 'bg-warning',
      validating: 'bg-warning',
      rejected: 'bg-danger',
      accepted: 'bg-success',
      screening: 'bg-warning',
      dispatched: 'bg-primary',
      in_transit: 'bg-primary',
      arrived: 'bg-info',
      ready_for_pickup: 'bg-warning',
      completed: 'bg-success'
    };
    return statusClasses[status] || 'bg-secondary';
  }

  createShipment() {
    this.router.navigate(['/shipment/create']);
  }

  viewShipment(shipmentId: string) {
    this.router.navigate(['/shipment', shipmentId]);
  }
}
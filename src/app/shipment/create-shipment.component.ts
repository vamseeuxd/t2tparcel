import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ShipmentService } from '../services/shipment.service';
import { AuthService } from '../services/auth';
import { Shipment } from '../models/shipment.model';

@Component({
  selector: 'app-create-shipment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h4 class="mb-0">Create New Shipment</h4>
            </div>
            <div class="card-body">
              <div class="alert alert-danger" *ngIf="error">{{ error }}</div>
              <div class="alert alert-success" *ngIf="success">{{ success }}</div>
              
              <form (ngSubmit)="onSubmit()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Customer Name</label>
                    <input type="text" class="form-control" [(ngModel)]="shipment.customerName" name="customerName" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Customer Email</label>
                    <input type="email" class="form-control" [(ngModel)]="shipment.customerEmail" name="customerEmail" required>
                  </div>
                </div>
                
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Customer Phone</label>
                    <input type="tel" class="form-control" [(ngModel)]="shipment.customerPhone" name="customerPhone" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Request Method</label>
                    <select class="form-control" [(ngModel)]="shipment.requestMethod" name="requestMethod" required>
                      <option value="app">App</option>
                      <option value="phone">Phone</option>
                    </select>
                  </div>
                </div>
                
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">From Address</label>
                    <textarea class="form-control" [(ngModel)]="shipment.fromAddress" name="fromAddress" rows="2" required></textarea>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">To Address</label>
                    <textarea class="form-control" [(ngModel)]="shipment.toAddress" name="toAddress" rows="2" required></textarea>
                  </div>
                </div>
                
                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Weight (kg)</label>
                    <input type="number" class="form-control" [(ngModel)]="shipment.weight" name="weight" step="0.1" required>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Dimensions</label>
                    <input type="text" class="form-control" [(ngModel)]="shipment.dimensions" name="dimensions" placeholder="L x W x H" required>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Minimum Charge ($)</label>
                    <input type="number" class="form-control" [(ngModel)]="shipment.minimumCharge" name="minimumCharge" step="0.01" required>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" [(ngModel)]="shipment.description" name="description" rows="3" required></textarea>
                </div>
                
                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" [disabled]="loading">
                    {{ loading ? 'Creating...' : 'Create Shipment' }}
                  </button>
                  <button type="button" class="btn btn-outline-secondary" (click)="goBack()">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CreateShipmentComponent {
  shipment: Partial<Shipment> = {
    requestMethod: 'app',
    minimumCharge: 50
  };
  loading = false;
  error = '';
  success = '';

  constructor(
    private shipmentService: ShipmentService,
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit() {
    this.loading = true;
    this.error = '';
    this.success = '';

    try {
      const user = this.authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const shipmentData = {
        ...this.shipment,
        customerId: user.uid,
        status: 'requested' as const,
        statusHistory: []
      } as Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'>;

      const shipmentId = await this.shipmentService.createShipment(shipmentData);
      this.success = 'Shipment created successfully!';
      
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);
    } catch (error: any) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
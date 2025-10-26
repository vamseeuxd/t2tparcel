import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ShipmentService } from '../services/shipment.service';
import { AuthService } from '../services/auth';
import { Shipment, STATUS_LABELS, ShipmentStatus } from '../models/shipment.model';

@Component({
  selector: 'app-admin-shipments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h3 class="mb-4">Shipment Management</h3>
      
      <div class="row mb-4">
        <div class="col-md-3">
          <select class="form-control" [(ngModel)]="filterStatus" (change)="applyFilter()">
            <option value="">All Statuses</option>
            <option *ngFor="let status of statusOptions" [value]="status.value">
              {{ status.label }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Desktop View -->
      <div class="table-responsive d-none d-lg-block">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>From → To</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let shipment of filteredShipments">
              <td>{{ shipment.id?.substring(0, 8) }}</td>
              <td>
                <div>{{ shipment.customerName }}</div>
                <small class="text-muted">{{ shipment.customerEmail }}</small>
              </td>
              <td>
                <small>{{ shipment.fromAddress }} → {{ shipment.toAddress }}</small>
              </td>
              <td>
                <span class="badge" [class]="getStatusBadgeClass(shipment.status)">
                  {{ STATUS_LABELS[shipment.status] }}
                </span>
              </td>
              <td>{{ shipment.createdAt | date:'short' }}</td>
              <td>
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-primary" (click)="selectShipment(shipment)">
                    Update
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Mobile/Tablet View -->
      <div class="list-group d-lg-none">
        <div class="list-group-item" *ngFor="let shipment of filteredShipments">
          <div class="d-flex w-100 justify-content-between align-items-start">
            <div class="flex-grow-1">
              <h6 class="mb-1">#{{ shipment.id?.substring(0, 8) }} - {{ shipment.customerName }}</h6>
              <p class="mb-1 small text-muted">{{ shipment.customerEmail }}</p>
              <p class="mb-1 small">{{ shipment.fromAddress }} → {{ shipment.toAddress }}</p>
              <small class="text-muted">{{ shipment.createdAt | date:'short' }}</small>
            </div>
            <div class="text-end">
              <span class="badge mb-2" [class]="getStatusBadgeClass(shipment.status)">
                {{ STATUS_LABELS[shipment.status] }}
              </span>
              <br>
              <button class="btn btn-outline-primary btn-sm" (click)="selectShipment(shipment)">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="text-center py-5" *ngIf="filteredShipments.length === 0 && !loading">
        <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
        <h5 class="text-muted">No shipments found</h5>
      </div>
      
      <div class="text-center py-5" *ngIf="loading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    
    <!-- Update Status Modal -->
    <div class="modal fade" [class.show]="showModal" [style.display]="showModal ? 'block' : 'none'" *ngIf="selectedShipment">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Update Shipment Status</h5>
            <button type="button" class="btn-close" (click)="closeModal()"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <strong>Shipment:</strong> #{{ selectedShipment.id?.substring(0, 8) }} - {{ selectedShipment.customerName }}
            </div>
            
            <div class="mb-3">
              <label class="form-label">New Status</label>
              <select class="form-control" [(ngModel)]="newStatus">
                <option *ngFor="let status of getAvailableStatuses()" [value]="status.value">
                  {{ status.label }}
                </option>
              </select>
            </div>
            
            <div class="mb-3" *ngIf="newStatus === 'rejected'">
              <label class="form-label">Rejection Reason</label>
              <textarea class="form-control" [(ngModel)]="rejectionReason" rows="3" placeholder="Enter reason for rejection"></textarea>
            </div>
            
            <div class="mb-3" *ngIf="newStatus === 'accepted'">
              <label class="form-label">Total Amount ($)</label>
              <input type="number" class="form-control" [(ngModel)]="totalAmount" step="0.01" placeholder="Enter total amount">
            </div>
            
            <div class="mb-3" *ngIf="newStatus === 'dispatched' || newStatus === 'in_transit'">
              <label class="form-label">Flight Number</label>
              <input type="text" class="form-control" [(ngModel)]="flightNumber" placeholder="Enter flight number">
            </div>
            
            <div class="mb-3" *ngIf="newStatus === 'dispatched'">
              <label class="form-label">Estimated Delivery</label>
              <input type="datetime-local" class="form-control" [(ngModel)]="estimatedDelivery">
            </div>
            
            <div class="mb-3">
              <label class="form-label">Notes (Optional)</label>
              <textarea class="form-control" [(ngModel)]="statusNotes" rows="2" placeholder="Add any additional notes"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="updateStatus()" [disabled]="updating">
              {{ updating ? 'Updating...' : 'Update Status' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" [class.show]="showModal" *ngIf="showModal"></div>
  `
})
export class AdminShipmentsComponent implements OnInit, OnDestroy {
  shipments: Shipment[] = [];
  filteredShipments: Shipment[] = [];
  loading = true;
  filterStatus = '';
  
  selectedShipment?: Shipment;
  showModal = false;
  newStatus: ShipmentStatus = 'requested';
  statusNotes = '';
  rejectionReason = '';
  totalAmount?: number;
  flightNumber = '';
  estimatedDelivery = '';
  updating = false;
  
  STATUS_LABELS = STATUS_LABELS;
  statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));
  
  private subscription?: Subscription;

  constructor(
    private shipmentService: ShipmentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadShipments();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  loadShipments() {
    this.subscription = this.shipmentService.getAllShipments()
      .subscribe(shipments => {
        this.shipments = shipments;
        this.applyFilter();
        this.loading = false;
      });
  }

  applyFilter() {
    this.filteredShipments = this.filterStatus 
      ? this.shipments.filter(s => s.status === this.filterStatus)
      : this.shipments;
  }

  selectShipment(shipment: Shipment) {
    this.selectedShipment = shipment;
    this.newStatus = shipment.status;
    this.statusNotes = '';
    this.rejectionReason = '';
    this.totalAmount = shipment.totalAmount;
    this.flightNumber = shipment.flightNumber || '';
    this.estimatedDelivery = shipment.estimatedDelivery && shipment.estimatedDelivery instanceof Date ? 
      shipment.estimatedDelivery.toISOString().slice(0, 16) : '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedShipment = undefined;
  }

  getAvailableStatuses() {
    if (!this.selectedShipment) return this.statusOptions;
    
    const currentStatus = this.selectedShipment.status;
    const statusFlow: Record<string, string[]> = {
      requested: ['details_added', 'rejected'],
      details_added: ['picked_up', 'rejected'],
      picked_up: ['validating', 'rejected'],
      validating: ['accepted', 'rejected'],
      accepted: ['screening'],
      screening: ['dispatched'],
      dispatched: ['in_transit'],
      in_transit: ['arrived'],
      arrived: ['ready_for_pickup'],
      ready_for_pickup: ['completed'],
      rejected: [],
      completed: []
    };
    
    const availableStatuses = statusFlow[currentStatus] || [];
    return this.statusOptions.filter(option => 
      availableStatuses.includes(option.value) || option.value === currentStatus
    );
  }

  async updateStatus() {
    if (!this.selectedShipment) return;
    
    this.updating = true;
    try {
      const user = this.authService.getCurrentUser();
      const updatedBy = user?.email || 'admin';
      
      // Update status
      await this.shipmentService.updateShipmentStatus(
        this.selectedShipment.id!,
        this.newStatus,
        this.statusNotes,
        updatedBy
      );
      
      // Update additional fields based on status
      const updates: Partial<Shipment> = {};
      
      if (this.newStatus === 'rejected' && this.rejectionReason) {
        updates.rejectionReason = this.rejectionReason;
      }
      
      if (this.newStatus === 'accepted' && this.totalAmount) {
        updates.totalAmount = this.totalAmount;
      }
      
      if ((this.newStatus === 'dispatched' || this.newStatus === 'in_transit') && this.flightNumber) {
        updates.flightNumber = this.flightNumber;
      }
      
      if (this.newStatus === 'dispatched' && this.estimatedDelivery) {
        updates.estimatedDelivery = new Date(this.estimatedDelivery);
      }
      
      if (this.newStatus === 'completed') {
        updates.actualDelivery = new Date();
      }
      
      if (Object.keys(updates).length > 0) {
        await this.shipmentService.updateShipment(this.selectedShipment.id!, updates);
      }
      
      this.closeModal();
    } catch (error: any) {
      console.error('Error updating shipment:', error);
    } finally {
      this.updating = false;
    }
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
}
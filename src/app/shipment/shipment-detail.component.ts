import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShipmentService } from '../services/shipment.service';
import { Shipment, STATUS_LABELS, StatusUpdate } from '../models/shipment.model';

@Component({
  selector: 'app-shipment-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shipment-detail.html'
})
export class ShipmentDetailComponent implements OnInit, OnDestroy {
  shipment?: Shipment;
  loading = true;
  STATUS_LABELS = STATUS_LABELS;
  private subscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shipmentService: ShipmentService
  ) {}

  ngOnInit() {
    const shipmentId = this.route.snapshot.paramMap.get('id');
    if (shipmentId) {
      this.loadShipment(shipmentId);
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  async loadShipment(shipmentId: string) {
    try {
      const result = await this.shipmentService.getShipmentById(shipmentId);
      this.shipment = result || undefined;
      this.loading = false;
    } catch (error) {
      console.error('Error loading shipment:', error);
      this.loading = false;
    }
  }

  getStatusHistory(): StatusUpdate[] {
    return this.shipment?.statusHistory?.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    ) || [];
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

  getTimelineMarkerClass(status: string): string {
    if (!this.shipment) return '';
    
    const currentStatusIndex = this.getStatusOrder().indexOf(this.shipment.status);
    const statusIndex = this.getStatusOrder().indexOf(status);
    
    if (statusIndex < currentStatusIndex) return 'completed';
    if (statusIndex === currentStatusIndex) return 'active';
    return '';
  }

  private getStatusOrder(): string[] {
    return [
      'requested', 'details_added', 'picked_up', 'validating', 
      'accepted', 'screening', 'dispatched', 'in_transit', 
      'arrived', 'ready_for_pickup', 'completed'
    ];
  }

  getDateValue(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (value.toDate && typeof value.toDate === 'function') return value.toDate();
    return new Date(value);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
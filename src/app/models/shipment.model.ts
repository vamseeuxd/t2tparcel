export interface Shipment {
  id?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  requestMethod: 'app' | 'phone';
  
  // Shipment Details
  fromAddress: string;
  toAddress: string;
  weight: number;
  dimensions: string;
  description: string;
  
  // Pricing
  minimumCharge: number;
  totalAmount?: number;
  
  // Status Tracking
  status: ShipmentStatus;
  statusHistory: StatusUpdate[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Validation
  isValid?: boolean;
  rejectionReason?: string;
  
  // Transport Details
  flightNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
}

export type ShipmentStatus = 
  | 'requested'
  | 'details_added'
  | 'picked_up'
  | 'validating'
  | 'rejected'
  | 'accepted'
  | 'screening'
  | 'dispatched'
  | 'in_transit'
  | 'arrived'
  | 'ready_for_pickup'
  | 'completed';

export interface StatusUpdate {
  status: ShipmentStatus;
  timestamp: Date;
  notes?: string;
  updatedBy: string;
}

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  requested: 'Request Received',
  details_added: 'Details Added',
  picked_up: 'Picked Up',
  validating: 'Validating',
  rejected: 'Rejected',
  accepted: 'Accepted',
  screening: 'Screening',
  dispatched: 'Dispatched',
  in_transit: 'In Transit',
  arrived: 'Arrived at Destination',
  ready_for_pickup: 'Ready for Pickup',
  completed: 'Completed'
};
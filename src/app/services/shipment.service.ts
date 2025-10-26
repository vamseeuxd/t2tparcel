import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, onSnapshot, Timestamp, getDoc, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Shipment, ShipmentStatus, StatusUpdate } from '../models/shipment.model';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private collectionName = 'shipments';

  constructor(private firestore: Firestore) {}

  async createShipment(shipment: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const shipmentData = {
      ...shipment,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      statusHistory: [{
        status: shipment.status,
        timestamp: Timestamp.now(),
        updatedBy: shipment.customerId
      }]
    };
    
    const docRef = await addDoc(collection(this.firestore, this.collectionName), shipmentData);
    return docRef.id;
  }

  async updateShipmentStatus(shipmentId: string, status: ShipmentStatus, notes?: string, updatedBy?: string): Promise<void> {
    const shipmentRef = doc(this.firestore, this.collectionName, shipmentId);
    
    // Get current shipment data
    const currentShipment = await this.getShipmentById(shipmentId);
    const currentHistory = currentShipment?.statusHistory || [];
    
    const statusUpdate: StatusUpdate = {
      status,
      timestamp: new Date(),
      notes,
      updatedBy: updatedBy || 'system'
    };

    await updateDoc(shipmentRef, {
      status,
      updatedAt: Timestamp.now(),
      statusHistory: [...currentHistory, statusUpdate]
    });
  }

  async updateShipment(shipmentId: string, updates: Partial<Shipment>): Promise<void> {
    const shipmentRef = doc(this.firestore, this.collectionName, shipmentId);
    await updateDoc(shipmentRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }

  getShipmentsByCustomer(customerId: string): Observable<Shipment[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('customerId', '==', customerId)
    );
    
    return new Observable(observer => {
      return onSnapshot(q, (snapshot: any) => {
        const shipments = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()['createdAt']?.toDate(),
          updatedAt: doc.data()['updatedAt']?.toDate(),
          statusHistory: doc.data()['statusHistory']?.map((update: any) => ({
            ...update,
            timestamp: update.timestamp?.toDate ? update.timestamp.toDate() : new Date(update.timestamp)
          }))
        })) as Shipment[];
        
        // Sort on client side
        shipments.sort((a, b) => {
          const aTime = a.createdAt ? a.createdAt.getTime() : 0;
          const bTime = b.createdAt ? b.createdAt.getTime() : 0;
          return bTime - aTime;
        });
        
        observer.next(shipments);
      });
    });
  }

  getAllShipments(): Observable<Shipment[]> {
    const q = query(collection(this.firestore, this.collectionName));
    
    return new Observable(observer => {
      return onSnapshot(q, (snapshot: any) => {
        const shipments = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()['createdAt']?.toDate(),
          updatedAt: doc.data()['updatedAt']?.toDate(),
          statusHistory: doc.data()['statusHistory']?.map((update: any) => ({
            ...update,
            timestamp: update.timestamp?.toDate ? update.timestamp.toDate() : new Date(update.timestamp)
          }))
        })) as Shipment[];
        
        // Sort on client side
        shipments.sort((a, b) => {
          const aTime = a.createdAt ? a.createdAt.getTime() : 0;
          const bTime = b.createdAt ? b.createdAt.getTime() : 0;
          return bTime - aTime;
        });
        
        observer.next(shipments);
      });
    });
  }

  async getShipmentById(shipmentId: string): Promise<Shipment | null> {
    try {
      const docRef = doc(this.firestore, this.collectionName, shipmentId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return null;
      
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data['createdAt']?.toDate(),
        updatedAt: data['updatedAt']?.toDate(),
        statusHistory: data['statusHistory']?.map((update: any) => ({
          ...update,
          timestamp: update.timestamp?.toDate ? update.timestamp.toDate() : new Date(update.timestamp)
        }))
      } as Shipment;
    } catch (error) {
      console.error('Error getting shipment:', error);
      return null;
    }
  }
}
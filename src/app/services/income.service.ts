import { Injectable, inject } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

export interface IncomeData {
  totalRevenue: number;
  totalShipments: number;
  averageRevenue: number;
}

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private firestore = inject(Firestore);
  private shipmentsCollection = 'shipments';

  async calculateTotalIncome(): Promise<IncomeData> {
    const q = query(collection(this.firestore, this.shipmentsCollection));
    const snapshot = await getDocs(q);
    
    let totalRevenue = 0;
    let totalShipments = 0;

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      // Add both totalAmount and minimumCharge
      const amount = (data['totalAmount'] || 0) + (data['minimumCharge'] || 0);
      totalRevenue += amount;
      totalShipments++;
    });

    return {
      totalRevenue,
      totalShipments,
      averageRevenue: totalShipments > 0 ? totalRevenue / totalShipments : 0
    };
  }

  async calculateIncomeByDateRange(startDate: Date, endDate: Date): Promise<IncomeData> {
    const q = query(
      collection(this.firestore, this.shipmentsCollection),
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate)
    );
    
    const snapshot = await getDocs(q);
    let totalRevenue = 0;
    let totalShipments = 0;

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      // Add both totalAmount and minimumCharge
      const amount = (data['totalAmount'] || 0) + (data['minimumCharge'] || 0);
      totalRevenue += amount;
      totalShipments++;
    });

    return {
      totalRevenue,
      totalShipments,
      averageRevenue: totalShipments > 0 ? totalRevenue / totalShipments : 0
    };
  }
}
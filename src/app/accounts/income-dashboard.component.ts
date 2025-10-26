import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncomeService, IncomeData } from '../services/income.service';

@Component({
  selector: 'app-income-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h3 class="mb-4">Income Dashboard</h3>
      
      <!-- Income Summary Cards -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card bg-success text-white mb-2">
            <div class="card-body text-center">
              <h4>\${{ incomeData.totalRevenue.toFixed(2) }}</h4>
              <p class="mb-0">Total Revenue</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card bg-info text-white mb-2">
            <div class="card-body text-center">
              <h4>{{ incomeData.totalShipments }}</h4>
              <p class="mb-0">Total Shipments</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card bg-primary text-white mb-2">
            <div class="card-body text-center">
              <h4>\${{ incomeData.averageRevenue.toFixed(2) }}</h4>
              <p class="mb-0">Average Revenue</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Date Range Filter -->
      <div class="card mb-4 mb-2">
        <div class="card-header">
          <h5 class="mb-0">Filter by Date Range</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <label class="form-label">Start Date</label>
              <input type="date" class="form-control" [(ngModel)]="startDate">
            </div>
            <div class="col-md-4">
              <label class="form-label">End Date</label>
              <input type="date" class="form-control" [(ngModel)]="endDate">
            </div>
            <div class="col-md-4">
              <label class="form-label">&nbsp;</label>
              <div>
                <button class="btn btn-primary me-2" (click)="calculateByDateRange()" [disabled]="loading">
                  {{ loading ? 'Loading...' : 'Calculate' }}
                </button>
                <button class="btn btn-outline-secondary" (click)="resetFilter()">
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class IncomeDashboardComponent implements OnInit {
  incomeData: IncomeData = {
    totalRevenue: 0,
    totalShipments: 0,
    averageRevenue: 0
  };
  
  startDate = '';
  endDate = '';
  loading = false;

  constructor(private incomeService: IncomeService) {}

  ngOnInit() {
    this.loadTotalIncome();
  }

  async loadTotalIncome() {
    this.loading = true;
    try {
      this.incomeData = await this.incomeService.calculateTotalIncome();
    } catch (error) {
      console.error('Error loading income data:', error);
    } finally {
      this.loading = false;
    }
  }

  async calculateByDateRange() {
    if (!this.startDate || !this.endDate) return;
    
    this.loading = true;
    try {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      this.incomeData = await this.incomeService.calculateIncomeByDateRange(start, end);
    } catch (error) {
      console.error('Error calculating income by date range:', error);
    } finally {
      this.loading = false;
    }
  }

  resetFilter() {
    this.startDate = '';
    this.endDate = '';
    this.loadTotalIncome();
  }
}
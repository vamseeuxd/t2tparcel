import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { User, ROLE_LABELS, UserRole } from '../models/user.model';

@Component({
  selector: 'app-manage-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>Manage Employees</h3>
        <button class="btn btn-primary" (click)="showAddForm()">
          <i class="fas fa-plus me-2"></i>Add Employee
        </button>
      </div>

      <div class="table-responsive d-none d-lg-block">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let employee of employees">
              <td>{{ employee.name }}</td>
              <td>{{ employee.email }}</td>
              <td><span class="badge bg-info">{{ ROLE_LABELS[employee.role] }}</span></td>
              <td>{{ employee.createdAt | date:'short' }}</td>
              <td>
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-primary" (click)="editEmployee(employee)">Edit</button>
                  <button class="btn btn-outline-danger" (click)="deleteEmployee(employee)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="list-group d-lg-none">
        <div class="list-group-item" *ngFor="let employee of employees">
          <div class="d-flex w-100 justify-content-between align-items-start">
            <div class="flex-grow-1">
              <h6 class="mb-1">{{ employee.name }}</h6>
              <p class="mb-1 small text-muted">{{ employee.email }}</p>
              <small class="text-muted">{{ employee.createdAt | date:'short' }}</small>
            </div>
            <div class="text-end">
              <span class="badge bg-info mb-2">{{ ROLE_LABELS[employee.role] }}</span><br>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-primary btn-sm" (click)="editEmployee(employee)">Edit</button>
                <button class="btn btn-outline-danger btn-sm" (click)="deleteEmployee(employee)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center py-5" *ngIf="employees.length === 0 && !loading">
        <i class="fas fa-users fa-3x text-muted mb-3"></i>
        <h5 class="text-muted">No employees found</h5>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal fade" [class.show]="showModal" [style.display]="showModal ? 'block' : 'none'">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Edit' : 'Add' }} Employee</h5>
            <button type="button" class="btn-close" (click)="closeModal()"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" [(ngModel)]="employeeForm.name" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" [(ngModel)]="employeeForm.email" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Role</label>
              <select class="form-control" [(ngModel)]="employeeForm.role" required>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="saveEmployee()" [disabled]="saving">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" [class.show]="showModal" *ngIf="showModal"></div>

    <!-- Delete Modal -->
    <div class="modal fade" [class.show]="showDeleteModal" [style.display]="showDeleteModal ? 'block' : 'none'">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
            <button type="button" class="btn-close" (click)="closeDeleteModal()"></button>
          </div>
          <div class="modal-body">
            <p>Delete <strong>{{ employeeToDelete?.name }}</strong>?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeDeleteModal()">Cancel</button>
            <button type="button" class="btn btn-danger" (click)="confirmDelete()" [disabled]="deleting">
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" [class.show]="showDeleteModal" *ngIf="showDeleteModal"></div>
  `
})
export class ManageEmployeeComponent implements OnInit, OnDestroy {
  employees: User[] = [];
  loading = true;
  showModal = false;
  showDeleteModal = false;
  isEditing = false;
  saving = false;
  deleting = false;
  
  employeeForm = { name: '', email: '', role: 'employee' as UserRole };
  selectedEmployee?: User;
  employeeToDelete?: User;
  ROLE_LABELS = ROLE_LABELS;
  
  private subscription?: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.subscription = this.userService.getAllUsers()
      .subscribe(users => {
        this.employees = users.filter(u => u.role === 'employee' || u.role === 'admin');
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  showAddForm() {
    this.isEditing = false;
    this.employeeForm = { name: '', email: '', role: 'employee' };
    this.showModal = true;
  }

  editEmployee(employee: User) {
    this.isEditing = true;
    this.selectedEmployee = employee;
    this.employeeForm = { name: employee.name, email: employee.email, role: employee.role };
    this.showModal = true;
  }

  async saveEmployee() {
    this.saving = true;
    try {
      if (this.isEditing && this.selectedEmployee) {
        await this.userService.updateUser(this.selectedEmployee.id!, this.employeeForm);
      } else {
        await this.userService.createUser(this.employeeForm);
      }
      this.closeModal();
    } catch (error) {
      console.error('Error saving employee:', error);
    } finally {
      this.saving = false;
    }
  }

  deleteEmployee(employee: User) {
    this.employeeToDelete = employee;
    this.showDeleteModal = true;
  }

  async confirmDelete() {
    if (!this.employeeToDelete) return;
    this.deleting = true;
    try {
      await this.userService.deleteUser(this.employeeToDelete.id!);
      this.closeDeleteModal();
    } catch (error) {
      console.error('Error deleting employee:', error);
    } finally {
      this.deleting = false;
    }
  }

  closeModal() {
    this.showModal = false;
    this.selectedEmployee = undefined;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.employeeToDelete = undefined;
  }
}
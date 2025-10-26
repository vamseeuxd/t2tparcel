export interface User {
  id?: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'customer' | 'employee';

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  customer: 'Customer',
  employee: 'Employee'
};
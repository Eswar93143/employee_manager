export type EmployeeStatus = 'active' | 'inactive';

export interface Employee {
  _id?: string;
  organizationId: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  /** Lookup id, resolved against LookupService.getDepartments() */
  department?: string;
  /** Lookup id, resolved against LookupService.getRoles() */
  role?: string;
  status?: EmployeeStatus;
}
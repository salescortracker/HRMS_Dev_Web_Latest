export interface EmployeeReference {
  referenceId: number;
  employeeId?: number;
  regionId?: number;
  companyId?: number;
  name: string;
  titleOrDesignation: string;
  companyName: string;
  emailId: string;
  mobileNumber: string;
  createdAt?: string;
  createdBy?: number;
  modifiedAt?: string;
  modifiedBy?: number;
}
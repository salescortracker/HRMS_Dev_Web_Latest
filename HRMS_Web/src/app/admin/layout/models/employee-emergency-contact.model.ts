export class EmployeeEmergencyContact {
  emergencyContactId!: number;
  employeeId?: number;
  contactName!: string;
  relationship!: string;
  phoneNumber!: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
  companyId?: number;
  regionId?: number;
  createdBy?: string;
  createdDate?: Date;
  modifiedBy?: string;
  modifiedDate?: Date;
}

export class EmployeeImmigration {
  immigrationId!: number;
  employeeId!: string;
  fullName!: string;
  dateOfBirth?: Date;

  nationality?: string;
  passportNumber?: string;
  passportExpiryDate?: Date;

  visaType?: string;
  visaNumber?: string;
  visaIssueDate?: Date;
  visaExpiryDate?: Date;
  visaIssuingCountry?: string;

  employerName?: string;
  employerAddress?: string;
  employerContact?: string;

  contactPerson?: string;
  workAuthorizationStatus?: string;
  remarks?: string;

  passportCopyPath?: string;
  visaCopyPath?: string;
  otherDocumentsPath?: string;

  createdBy?: string;
  createdDate?: Date;
  modifiedBy?: string;
  modifiedDate?: Date;
}

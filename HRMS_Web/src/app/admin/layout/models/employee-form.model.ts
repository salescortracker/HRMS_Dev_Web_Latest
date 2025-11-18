export interface EmployeeForm {
  id: number;
  documentTypeId: string;
  documentTypeName?: string; 
  documentName: string;
  employeeCode: string;
  issueDate: string;
  fileName: string;
  filePath?: string; 
  remarks?: string;
  isConfidential: boolean;
}

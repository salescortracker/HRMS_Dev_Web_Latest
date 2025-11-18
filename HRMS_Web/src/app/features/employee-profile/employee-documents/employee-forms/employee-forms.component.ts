import { Component, OnInit } from '@angular/core';
import { EmployeeForm } from '../../../../admin/layout/models/employee-form.model';
import { AdminService } from '../../../../admin/servies/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-forms',
  standalone: false,
  templateUrl: './employee-forms.component.html',
  styleUrl: './employee-forms.component.css'
})
export class EmployeeFormsComponent implements OnInit{
   employeeForms: EmployeeForm[] = [];
 documentTypes: any[] = []; 
 selectedFile: File | null = null;

  pageSize = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50, 100];

  sortColumn: keyof EmployeeForm | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  // Form data model
  formData: EmployeeForm = {
    id: 0,
    documentTypeId: '',
   documentTypeName: '',
    documentName: '',
    employeeCode: '',
    issueDate: '',
    fileName: '',
    remarks: '',
    isConfidential: false
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
  this.loadDocumentTypes();
}
sortBy(column: keyof EmployeeForm): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortForms();
  }

  sortForms(): void {
    if (!this.sortColumn) return;

    this.employeeForms.sort((a, b) => {
      const valA = (a[this.sortColumn!] ?? '') as any;
      const valB = (b[this.sortColumn!] ?? '') as any;

      // Handle date sorting
      if (this.sortColumn === 'issueDate') {
        const dateA = new Date(valA).getTime();
        const dateB = new Date(valB).getTime();
        return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }

      // General string/number sorting
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

loadDocumentTypes(): void {
  this.adminService.getActiveDocumentTypes().subscribe({
    next: (data) => {
      this.documentTypes = data;
      this.loadEmployeeForms(); // ✅ load forms only after types are ready
    },
    error: (err) => {
      console.error('Error loading document types:', err);
      Swal.fire('Error', 'Failed to load document types.', 'error');
    }
  });
}


  // ✅ Load existing forms
 loadEmployeeForms(): void {
  this.adminService.getAllEmployeeForms().subscribe({
    next: (data) => {
      this.employeeForms = data.map(form => {
        const docType = this.documentTypes.find(t => t.id === form.documentTypeId);
        return {
          ...form,
          documentTypeName: docType ? docType.typeName : 'N/A'
        };
      });
      this.sortForms(); // ✅ automatically apply sorting
    },
    error: (err) => console.error('Error loading forms:', err)
  });
}


  // Handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.formData.fileName = file.name;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.employeeForms.length / this.pageSize);
  }

  get paginatedForms(): EmployeeForm[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.employeeForms.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  // Handle form submission
  onSubmit(): void {
     if (!this.formData.documentTypeId || !this.formData.documentName || !this.formData.employeeCode || !this.formData.issueDate || !this.selectedFile) {
      Swal.fire('Warning', 'Please fill all required fields and select a file.', 'warning');
      return;
    }

    const formPayload = new FormData();
    formPayload.append('Id', this.formData.id.toString());
    formPayload.append('EmployeeId', '0');
    formPayload.append('RegionId', '0');
    formPayload.append('CompanyId', '0');
    formPayload.append('DocumentTypeId', this.formData.documentTypeId.toString()); // ✅ use selected type ID
    formPayload.append('DocumentName', this.formData.documentName);
    formPayload.append('EmployeeCode', this.formData.employeeCode);
    formPayload.append('IssueDate', this.formData.issueDate);
    formPayload.append('FileName', this.formData.fileName);
    formPayload.append('Remarks', this.formData.remarks || '');
    formPayload.append('IsConfidential', this.formData.isConfidential.toString());
    formPayload.append('CreatedBy', '0');
    formPayload.append('ModifiedBy', '0');
    formPayload.append('FilePath', '');

    if (this.selectedFile) {
      formPayload.append('DocumentFile', this.selectedFile);
    }

    if (this.formData.id === 0) {
      this.adminService.createEmployeeForm(formPayload).subscribe({
        next: () => {
          Swal.fire('Success', 'Form uploaded successfully!', 'success');
          this.loadEmployeeForms();
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'Failed to upload form', 'error');
        }
      });
    } else {
      this.adminService.updateEmployeeForm(this.formData.id, formPayload).subscribe({
        next: () => {
          Swal.fire('Success', 'Form updated successfully!', 'success');
          this.loadEmployeeForms();
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'Failed to update form', 'error');
        }
      });
    }
  }

  // Handle edit action
  editForm(form: EmployeeForm): void {
    this.formData = { ...form };
     this.selectedFile = null;
  }

  // Handle delete action
 deleteForm(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this document?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteEmployeeForm(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Document deleted successfully.', 'success');
            this.loadEmployeeForms();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'Failed to delete document.', 'error');
          }
        });
      }
    });
  }

  viewDocument(filePath: string): void {
  if (filePath) {
    window.open(filePath, '_blank');
  } else {
    Swal.fire('Info', 'File not available for this record.', 'info');
  }
}

getFullFilePath(filePath: string): string {
  if (!filePath) return '';

  // If filePath already contains backend domain, return as-is
  if (filePath.startsWith('http')) {
    return filePath;
  }

  // ✅ Use your backend API URL
  const backendUrl = 'https://localhost:7146'; // Change this if you deploy elsewhere

  // Ensure correct slashes
  if (filePath.startsWith('/')) {
    return backendUrl + filePath;
  } else {
    return `${backendUrl}/${filePath}`;
  }
}



  // ✅ Reset form
  resetForm(): void {
    this.formData = {
      id: 0,
      documentTypeId: '', 
    documentTypeName: '',
      documentName: '',
      employeeCode: '',
      issueDate: '',
      fileName: '',
      remarks: '',
      isConfidential: false
    };
    this.selectedFile = null;
  }
}

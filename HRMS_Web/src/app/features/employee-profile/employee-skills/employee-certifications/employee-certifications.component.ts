import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminService } from '../../../../admin/servies/admin.service';

@Component({
  selector: 'app-employee-certifications',
  standalone: false,
  templateUrl: './employee-certifications.component.html',
  styleUrl: './employee-certifications.component.css'
})
export class EmployeeCertificationsComponent implements OnInit {
   certificateForm!: FormGroup;
  certificationList: any[] = [];
  certificationTypeList: any[] = [];
  selectedFile: File | null = null;
  isEditMode = false;
  currentCertificationId: number | null = null;
  employeeId = 123; // Replace with dynamic employeeId

  // Sorting
  sortColumn: keyof any | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  // Pagination
  pageSize = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50, 100];

  // Search
  searchText = '';

  constructor(private fb: FormBuilder, private adminService: AdminService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCertifications();
    this.loadCertificationTypes();
  }

  initializeForm(): void {
    this.certificateForm = this.fb.group({
      certificationName: ['', Validators.required],
      certificationType: ['', Validators.required],
      description: [''],
      DocumentFile: [null]
    });
  }

  loadCertificationTypes(): void {
    this.adminService.getCertificationTypes().subscribe({
      next: res => this.certificationTypeList = res,
      error: () => Swal.fire('Error', 'Unable to load certification types', 'error')
    });
  }

  loadCertifications(): void {
    this.adminService.getEmployeeCertifications(this.employeeId).subscribe({
      next: res => this.certificationList = res,
      error: () => Swal.fire('Error', 'Unable to load certifications', 'error')
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  saveCertification(): void {
    if (this.certificateForm.invalid) {
      Swal.fire('Validation Error', 'Please fill all required fields', 'warning');
      return;
    }

    const formValues = this.certificateForm.value;
    const formData = new FormData();
    formData.append('CertificationName', formValues.certificationName);
    formData.append('CertificationType', formValues.certificationType);
    formData.append('Description', formValues.description ?? '');
    formData.append('EmployeeId', this.employeeId.toString());
    if (this.selectedFile) formData.append('DocumentFile', this.selectedFile);

    if (this.isEditMode && this.currentCertificationId) {
      formData.append('CertificationId', this.currentCertificationId.toString());
      this.adminService.updateEmployeeCertification(this.currentCertificationId, formData).subscribe({
        next: () => {
          Swal.fire('Updated', 'Certification updated successfully', 'success');
          this.resetForm();
          this.loadCertifications();
        },
        error: () => Swal.fire('Error', 'Failed to update certification', 'error')
      });
    } else {
      this.adminService.createEmployeeCertification(formData).subscribe({
        next: () => {
          Swal.fire('Created', 'Certification added successfully', 'success');
          this.resetForm();
          this.loadCertifications();
        },
        error: () => Swal.fire('Error', 'Failed to add certification', 'error')
      });
    }
  }

  editCertification(cert: any): void {
    this.isEditMode = true;
    this.currentCertificationId = cert.certificationId;
    this.certificateForm.patchValue({
      certificationName: cert.certificationName,
      certificationType: cert.certificationType,
      description: cert.description
    });
    this.selectedFile = null;
  }

  deleteCertification(certificationId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it'
    }).then(result => {
      if (result.isConfirmed) {
        this.adminService.deleteEmployeeCertification(certificationId).subscribe({
          next: () => {
            Swal.fire('Deleted', 'Certification deleted successfully', 'success');
            this.loadCertifications();
          },
          error: () => Swal.fire('Error', 'Failed to delete certification', 'error')
        });
      }
    });
  }

  resetForm(): void {
    this.certificateForm.reset();
    this.selectedFile = null;
    this.isEditMode = false;
    this.currentCertificationId = null;
  }

  // Sorting
  sortBy(column: keyof any): void {
    if (this.sortColumn === column) this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  getSortedCertifications(): any[] {
    let data = [...this.certificationList];
    if (this.sortColumn) {
      data.sort((a, b) => {
        const valA = a[this.sortColumn!] ?? '';
        const valB = b[this.sortColumn!] ?? '';
        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }

  // Filtering + Pagination
  filteredCertifications(): any[] {
    const data = this.getSortedCertifications().filter(cert =>
      cert.certificationName?.toLowerCase().includes(this.searchText.toLowerCase())
    );
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return data.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.getSortedCertifications().filter(cert =>
      cert.certificationName?.toLowerCase().includes(this.searchText.toLowerCase())
    ).length / this.pageSize);
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  onFilterChange(): void {
    this.currentPage = 1;
  }
// downloadDocument(documentPath: string): void {
//   if (!documentPath) return;

//   const url = `${this.adminService.getBaseUrl()}/${documentPath}`;
//   window.open(url, '_blank'); // Opens in new tab
// }

viewDocument(documentPath: string) {
  if (documentPath) {
    const url = `https://localhost:7146/${documentPath}`; // <-- full backend URL
    window.open(url, '_blank'); // open in new tab
  }
}

}
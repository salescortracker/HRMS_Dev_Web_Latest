import { Component, OnInit } from '@angular/core';
import { EmployeeReference } from '../../../admin/layout/models/employee-reference.model';
import { AdminService } from '../../../admin/servies/admin.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-employee-references',
  standalone: false,
  templateUrl: './employee-references.component.html',
  styleUrl: './employee-references.component.css'
})
export class EmployeeReferencesComponent implements OnInit{
   references: EmployeeReference[] = [];

   // Pagination
  pageSize = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50, 100];

  // Sorting
sortColumn: keyof EmployeeReference | null = null;
sortDirection: 'asc' | 'desc' = 'asc';


  // Model for form binding
  formData: EmployeeReference = {
    referenceId: 0,
    name: '',
    titleOrDesignation: '',
    companyName: '',
    emailId: '',
    mobileNumber: ''
  };

  // Used to track edit mode
  isEditMode = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadReferences();
  }

  sortBy(column: keyof EmployeeReference): void {
  if (this.sortColumn === column) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }
}
getSortedReferences(): EmployeeReference[] {
  let data = [...this.references];

  if (this.sortColumn) {
    data.sort((a, b) => {
      const valA = (a[this.sortColumn!] ?? '') as any;
      const valB = (b[this.sortColumn!] ?? '') as any;

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return data;
}



  loadReferences() {
    this.adminService.getAllEmployeeReferences().subscribe({
      next: (data) => {
        this.references = data.sort((a, b) => b.referenceId! - a.referenceId!);
      },
      error: (err) => {
        console.error('Error loading employee references:', err);
        Swal.fire('Error', 'Failed to load employee references.', 'error');
      }
    });
  }
  get paginatedReferences(): EmployeeReference[] {
    const sorted = this.getSortedReferences();
  const startIndex = (this.currentPage - 1) * this.pageSize;
  return sorted.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.references.length / this.pageSize);
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Add or Update a record
 addReference(form: NgForm) {
  // ✅ If the form is invalid, mark all controls as touched and show SweetAlert
  if (form.invalid) {
    Object.keys(form.controls).forEach(key => {
      const control = form.controls[key];
      control.markAsTouched(); // show validation messages
    });

    // SweetAlert warning
    Swal.fire({
      icon: 'warning',
      title: 'Please fill all required fields',
      text: 'All mandatory fields are marked with *',
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK'
    });
    return;
  }

  // ✅ If form is valid — proceed with add/update logic
  if (this.isEditMode) {
    this.adminService.updateEmployeeReference(this.formData.referenceId!, this.formData).subscribe({
      next: () => {
        Swal.fire('Updated', 'Reference updated successfully!', 'success');
        this.loadReferences();
        this.resetForm(form);
      },
      error: (err) => {
        console.error('Update failed:', err);
        Swal.fire('Error', 'Failed to update reference.', 'error');
      }
    });
  } else {
    this.adminService.createEmployeeReference(this.formData).subscribe({
      next: () => {
        Swal.fire('Added', 'Reference added successfully!', 'success');
        this.loadReferences();
        this.resetForm(form);
      },
      error: (err) => {
        console.error('Create failed:', err);
        Swal.fire('Error', 'Failed to add reference.', 'error');
      }
    });
  }
}


  // Edit record
  editReference(ref: EmployeeReference): void {
    this.formData = { ...ref };
    this.isEditMode = true;
    
  }

  // Delete record
  deleteReference(id: number) {
   Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteEmployeeReference(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Reference deleted successfully.', 'success');
            this.loadReferences();
          },
          error: (err) => {
            console.error('Delete failed:', err);
            Swal.fire('Error', 'Failed to delete reference.', 'error');
          }
        });
      }
    });
  }

  // Reset form
  resetForm(form: NgForm): void {
    form.resetForm();
    this.formData = {
      referenceId: 0,
      name: '',
      titleOrDesignation: '',
      companyName: '',
      emailId: '',
      mobileNumber: ''
    };
    this.isEditMode = false;
  }
}


import { Component } from '@angular/core';
import { AdminService, EmployeeEducationDto } from '../../../../admin/servies/admin.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-education',
  standalone: false,
  templateUrl: './employee-education.component.html',
  styleUrl: './employee-education.component.css'
})
export class EmployeeEducationComponent {
  employeeId: number = 0;
  educationList: EmployeeEducationDto[] = [];
  isEditMode = false;

  formData: any = {
    educationId: 0,
    employeeId: 0,
    qualification: '',
    specialization: '',
    institution: '',
    board: '',
    startDate: '',
    endDate: '',
    result: '',
    modeOfStudyId: '',
    certificateFile: null,
  };

  modeList: any[] = [];

  // 🔹 Sorting & Filtering & Pagination
  searchText = '';
  sortColumn: keyof EmployeeEducationDto | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  pageSize = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.employeeId = Number(localStorage.getItem('employeeId')) || 1;
    this.getAllEducations();
    this.getModeOfStudyList();
  }

  // ✅ Dropdown - Mode of Study
  getModeOfStudyList(): void {
    this.adminService.getModeOfStudyList().subscribe({
      next: (res) => (this.modeList = res),
      error: (err) => console.error('Error fetching mode of study:', err),
    });
  }

  // ✅ Load all educations for employee
  getAllEducations(): void {
    this.adminService.getEmployeeEducations(this.employeeId).subscribe({
      next: (res) => (this.educationList = res),
      error: (err) => console.error('Error loading education list:', err),
    });
  }

  // ✅ File upload
  uploadFile(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.formData.certificateFile = file;
    }
  }

  // ✅ Create / Update
  addEducation(form: NgForm): void {
    if (form.invalid) return;

    this.formData.employeeId = this.employeeId;

    const formDataToSend = new FormData();
    for (const key in this.formData) {
      if (this.formData[key] != null)
        formDataToSend.append(key, this.formData[key]);
    }
    formDataToSend.append('companyId', '1');
    formDataToSend.append('regionId', '1');

    if (this.isEditMode) {
      this.adminService.updateEmployeeEducation(this.formData.educationId, formDataToSend).subscribe({
        next: () => {
          Swal.fire('Updated!', 'Education record updated successfully.', 'success');
          this.resetForm(form);
          this.getAllEducations();
        },
        error: (err) => console.error('Update failed:', err),
      });
    } else {
      this.adminService.createEmployeeEducation(formDataToSend).subscribe({
        next: () => {
          Swal.fire('Added!', 'Education record added successfully.', 'success');
          this.resetForm(form);
          this.getAllEducations();
        },
        error: (err) => console.error('Creation failed:', err),
      });
    }
  }

  // ✅ Edit
  editEducation(edu: EmployeeEducationDto): void {
    this.isEditMode = true;
    this.formData = {
      educationId: edu.educationId,
      employeeId: edu.employeeId,
      qualification: edu.qualification,
      specialization: edu.specialization,
      institution: edu.institution,
      board: edu.board,
      startDate: this.formatDate(edu.startDate),
      endDate: this.formatDate(edu.endDate),
      result: edu.result,
      modeOfStudyId: edu.modeOfStudyId,
      certificateFile: null,
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ✅ Delete
  deleteEducation(id?: number): void {
    if (!id) return;
    Swal.fire({
      title: 'Are you sure?',
      text: 'This record will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteEmployeeEducation(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Education record deleted.', 'success');
            this.getAllEducations();
            this.resetPagination();
          },
          error: (err) => console.error('Delete failed:', err),
        });
      }
    });
  }

  // ✅ Reset Form
  resetForm(form: NgForm): void {
    this.isEditMode = false;
    form.resetForm();
    this.formData = {
      educationId: 0,
      employeeId: this.employeeId,
      qualification: '',
      specialization: '',
      institution: '',
      board: '',
      startDate: '',
      endDate: '',
      result: '',
      modeOfStudyId: '',
      certificateFile: null,
    };
    this.resetPagination();
  }

  // ✅ Sorting
  sortBy(column: keyof EmployeeEducationDto): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  getSortedEducations(): EmployeeEducationDto[] {
    let data = [...this.educationList];
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

 

  get totalPages(): number {
    return Math.ceil(
      this.getSortedEducations().filter((edu) => {
        const search = this.searchText.toLowerCase();
        return (
          edu.qualification?.toLowerCase().includes(search) ||
          edu.institution?.toLowerCase().includes(search)
        );
      }).length / this.pageSize
    );
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

  resetPagination(): void {
    this.currentPage = 1;
    this.sortColumn = null;
    this.sortDirection = 'asc';
    this.searchText = '';
  }
// 🔹 Add this property
modeFilter: string | number = '';

// 🔹 Add this method for filtering + reset
resetFilters(): void {
  this.modeFilter = '';
  this.searchText = '';
  this.currentPage = 1;
}

// 🔹 Update filteredEducations() to include modeFilter logic
filteredEducations(): EmployeeEducationDto[] {
  let data = this.getSortedEducations().filter((edu) => {
    const search = this.searchText.toLowerCase();
    const matchesSearch =
      edu.qualification?.toLowerCase().includes(search) ||
      edu.institution?.toLowerCase().includes(search);
    const matchesMode =
      !this.modeFilter || edu.modeOfStudyId === this.modeFilter;
    return matchesSearch && matchesMode;
  });

  const startIndex = (this.currentPage - 1) * this.pageSize;
  return data.slice(startIndex, startIndex + this.pageSize);
}

// 🔹 Add this helper for showing mode name in table
getModeText(modeId: number | undefined): string {
  if (!modeId) return '';
  const mode = this.modeList.find((x) => x.modeOfStudyId === modeId);
  return mode ? mode.modeName : '';
}

  private formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
viewDocument(filePath: string | undefined): void {
  if (!filePath) {
    Swal.fire('Error', 'No file path available.', 'error');
    return;
  }
  const fullPath = `https://localhost:7146/${filePath}`;
  window.open(fullPath, '_blank');
}

}

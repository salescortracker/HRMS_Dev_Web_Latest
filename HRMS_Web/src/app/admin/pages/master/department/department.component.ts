import { Component } from '@angular/core';
import { Department } from '../../../layout/models/department.model';
@Component({
  selector: 'app-department',
  standalone: false,
  templateUrl: './department.component.html',
  styleUrl: './department.component.css'
})
export class DepartmentComponent {
 department: Department = { DepartmentName: '', IsActive: true };
  departments: Department[] = [];
  isEditMode = false;
  searchText = '';

  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments() {
    this.departments = [
      { DepartmentID: 1, DepartmentName: 'Human Resources', IsActive: true },
      { DepartmentID: 2, DepartmentName: 'Finance', IsActive: true },
      { DepartmentID: 3, DepartmentName: 'IT', IsActive: false },
    ];
  }

  onSubmit() {
    if (this.isEditMode) {
      const index = this.departments.findIndex(d => d.DepartmentID === this.department.DepartmentID);
      if (index !== -1) this.departments[index] = { ...this.department };
    } else {
      const newId = this.departments.length + 1;
      this.departments.push({ DepartmentID: newId, ...this.department });
    }
    this.resetForm();
  }

  editDepartment(d: Department) {
    this.isEditMode = true;
    this.department = { ...d };
  }

  deleteDepartment(d: Department) {
    this.departments = this.departments.filter(x => x.DepartmentID !== d.DepartmentID);
  }

  resetForm() {
    this.department = { DepartmentName: '', IsActive: true };
    this.isEditMode = false;
  }

  filteredDepartments() {
    return this.departments.filter(d =>
      d.DepartmentName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  paginatedDepartments() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredDepartments().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.filteredDepartments().length / this.pageSize);
  }

  pagesArray() {
    return Array(this.totalPages()).fill(0).map((_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) this.currentPage = page;
  }
}

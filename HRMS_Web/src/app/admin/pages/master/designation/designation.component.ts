import { Component } from '@angular/core';
import { Designation } from '../../../layout/models/designation.model';
@Component({
  selector: 'app-designation',
  standalone: false,
  templateUrl: './designation.component.html',
  styleUrl: './designation.component.css'
})
export class DesignationComponent {
 designation: Designation = { DesignationName: '', IsActive: true };
  designations: Designation[] = [];
  isEditMode = false;
  searchText = '';

  // Pagination
  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadDesignations();
  }

  loadDesignations() {
    // Sample Data – Replace with API call
    this.designations = [
      { DesignationID: 1, DesignationName: 'Software Engineer', IsActive: true },
      { DesignationID: 2, DesignationName: 'Project Manager', IsActive: true },
      { DesignationID: 3, DesignationName: 'HR Executive', IsActive: false },
    ];
  }

  onSubmit() {
    if (this.isEditMode) {
      const index = this.designations.findIndex(d => d.DesignationID === this.designation.DesignationID);
      if (index !== -1) this.designations[index] = { ...this.designation };
    } else {
      const newId = this.designations.length + 1;
      this.designations.push({ DesignationID: newId, ...this.designation });
    }
    this.resetForm();
  }

  editDesignation(des: Designation) {
    this.isEditMode = true;
    this.designation = { ...des };
  }

  deleteDesignation(des: Designation) {
    this.designations = this.designations.filter(d => d.DesignationID !== des.DesignationID);
  }

  resetForm() {
    this.designation = { DesignationName: '', IsActive: true };
    this.isEditMode = false;
  }

  // Filtering + Pagination
  filteredDesignations() {
    return this.designations.filter(d =>
      d.DesignationName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  paginatedDesignations() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredDesignations().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.filteredDesignations().length / this.pageSize);
  }

  pagesArray() {
    return Array(this.totalPages()).fill(0).map((_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) this.currentPage = page;
  }
}

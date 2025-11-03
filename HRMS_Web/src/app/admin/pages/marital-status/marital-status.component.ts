import { Component } from '@angular/core';
import { MaritalStatus } from '../../layout/models/marital-status.model';
@Component({
  selector: 'app-marital-status',
  standalone: false,
  templateUrl: './marital-status.component.html',
  styleUrl: './marital-status.component.css'
})
export class MaritalStatusComponent {
statuses: MaritalStatus[] = [
    { MaritalStatusID: 1, StatusName: 'Single', IsActive: true },
    { MaritalStatusID: 2, StatusName: 'Married', IsActive: true },
    { MaritalStatusID: 3, StatusName: 'Divorced', IsActive: false },
    { MaritalStatusID: 4, StatusName: 'Widowed', IsActive: true },
  ];

  maritalStatus: MaritalStatus = { MaritalStatusID: 0, StatusName: '', IsActive: true };
  isEditMode = false;

  // Pagination & Search
  currentPage: number = 1;
  pageSize: number = 5;
  searchText: string = '';

  // Filter
  filteredStatuses(): MaritalStatus[] {
    if (!this.searchText) return this.statuses;
    return this.statuses.filter(s =>
      s.StatusName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Paginate
  paginatedStatuses(): MaritalStatus[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredStatuses().slice(start, start + this.pageSize);
  }

  totalPages(): number {
    return Math.ceil(this.filteredStatuses().length / this.pageSize);
  }

  pagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage = page;
  }

  // Form Actions
  onSubmit() {
    if (this.isEditMode) {
      const index = this.statuses.findIndex(s => s.MaritalStatusID === this.maritalStatus.MaritalStatusID);
      if (index !== -1) this.statuses[index] = { ...this.maritalStatus };
      this.isEditMode = false;
    } else {
      const newId = this.statuses.length > 0 ? Math.max(...this.statuses.map(s => s.MaritalStatusID)) + 1 : 1;
      this.statuses.push({ ...this.maritalStatus, MaritalStatusID: newId });
    }
    this.resetForm();
  }

  editStatus(s: MaritalStatus) {
    this.maritalStatus = { ...s };
    this.isEditMode = true;
  }

  deleteStatus(s: MaritalStatus) {
    this.statuses = this.statuses.filter(st => st.MaritalStatusID !== s.MaritalStatusID);
  }

  resetForm() {
    this.maritalStatus = { MaritalStatusID: 0, StatusName: '', IsActive: true };
    this.isEditMode = false;
  }
}

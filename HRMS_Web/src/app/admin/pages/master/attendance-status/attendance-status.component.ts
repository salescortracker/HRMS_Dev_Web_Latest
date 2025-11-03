import { Component } from '@angular/core';
import { AttendanceStatus } from '../../../layout/models/attendance-status.model';
@Component({
  selector: 'app-attendance-status',
  standalone: false,
  templateUrl: './attendance-status.component.html',
  styleUrl: './attendance-status.component.css'
})
export class AttendanceStatusComponent {

  status: AttendanceStatus = { AttendanceStatusName: '', IsActive: true };
  statuses: AttendanceStatus[] = [];
  isEditMode = false;
  searchText = '';

  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadStatuses();
  }

  loadStatuses() {
    // Sample data – replace with API call
    this.statuses = [
      { AttendanceStatusID: 1, AttendanceStatusName: 'Present', IsActive: true },
      { AttendanceStatusID: 2, AttendanceStatusName: 'Absent', IsActive: true },
      { AttendanceStatusID: 3, AttendanceStatusName: 'Half-Day', IsActive: false },
      { AttendanceStatusID: 4, AttendanceStatusName: 'On Leave', IsActive: true }
    ];
  }

  onSubmit() {
    if (this.isEditMode) {
      const index = this.statuses.findIndex(s => s.AttendanceStatusID === this.status.AttendanceStatusID);
      if (index !== -1) this.statuses[index] = { ...this.status };
    } else {
      const newId = this.statuses.length + 1;
      this.statuses.push({ AttendanceStatusID: newId, ...this.status });
    }
    this.resetForm();
  }

  editStatus(s: AttendanceStatus) {
    this.isEditMode = true;
    this.status = { ...s };
  }

  deleteStatus(s: AttendanceStatus) {
    this.statuses = this.statuses.filter(x => x.AttendanceStatusID !== s.AttendanceStatusID);
  }

  resetForm() {
    this.status = { AttendanceStatusName: '', IsActive: true };
    this.isEditMode = false;
  }

  // Filtering + Pagination
  filteredStatuses() {
    return this.statuses.filter(s =>
      s.AttendanceStatusName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  paginatedStatuses() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredStatuses().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.filteredStatuses().length / this.pageSize);
  }

  pagesArray() {
    return Array(this.totalPages()).fill(0).map((_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) this.currentPage = page;
  }
}

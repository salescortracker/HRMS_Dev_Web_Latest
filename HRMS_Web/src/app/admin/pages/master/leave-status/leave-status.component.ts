import { Component } from '@angular/core';
import { LeaveStatus } from '../../../layout/models/leave-status.model';
@Component({
  selector: 'app-leave-status',
  standalone: false,
  templateUrl: './leave-status.component.html',
  styleUrl: './leave-status.component.css'
})
export class LeaveStatusComponent {
status: LeaveStatus = { LeaveStatusName: '', IsActive: true };
  statuses: LeaveStatus[] = [];
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
      { LeaveStatusID: 1, LeaveStatusName: 'Pending', IsActive: true },
      { LeaveStatusID: 2, LeaveStatusName: 'Approved', IsActive: true },
      { LeaveStatusID: 3, LeaveStatusName: 'Rejected', IsActive: false },
      { LeaveStatusID: 4, LeaveStatusName: 'Canceled', IsActive: true }
    ];
  }

  onSubmit() {
    if (this.isEditMode) {
      const index = this.statuses.findIndex(s => s.LeaveStatusID === this.status.LeaveStatusID);
      if (index !== -1) this.statuses[index] = { ...this.status };
    } else {
      const newId = this.statuses.length + 1;
      this.statuses.push({ LeaveStatusID: newId, ...this.status });
    }
    this.resetForm();
  }

  editStatus(s: LeaveStatus) {
    this.isEditMode = true;
    this.status = { ...s };
  }

  deleteStatus(s: LeaveStatus) {
    this.statuses = this.statuses.filter(x => x.LeaveStatusID !== s.LeaveStatusID);
  }

  resetForm() {
    this.status = { LeaveStatusName: '', IsActive: true };
    this.isEditMode = false;
  }

  // Filtering + Pagination
  filteredStatuses() {
    return this.statuses.filter(s =>
      s.LeaveStatusName.toLowerCase().includes(this.searchText.toLowerCase())
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

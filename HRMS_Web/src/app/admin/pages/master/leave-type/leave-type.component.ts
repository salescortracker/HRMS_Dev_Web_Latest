import { Component } from '@angular/core';
import { LeaveType } from '../../../layout/models/leave-type.model';
@Component({
  selector: 'app-leave-type',
  standalone: false,
  templateUrl: './leave-type.component.html',
  styleUrl: './leave-type.component.css'
})
export class LeaveTypeComponent {
leave: LeaveType = { LeaveTypeName: '', IsActive: true };
  leaves: LeaveType[] = [];
  isEditMode = false;
  searchText = '';

  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves() {
    // Sample data – replace with API call
    this.leaves = [
      { LeaveTypeID: 1, LeaveTypeName: 'Casual', IsActive: true },
      { LeaveTypeID: 2, LeaveTypeName: 'Sick', IsActive: true },
      { LeaveTypeID: 3, LeaveTypeName: 'Earned', IsActive: false }
    ];
  }

  onSubmit() {
    if (this.isEditMode) {
      const index = this.leaves.findIndex(l => l.LeaveTypeID === this.leave.LeaveTypeID);
      if (index !== -1) this.leaves[index] = { ...this.leave };
    } else {
      const newId = this.leaves.length + 1;
      this.leaves.push({ LeaveTypeID: newId, ...this.leave });
    }
    this.resetForm();
  }

  editLeave(l: LeaveType) {
    this.isEditMode = true;
    this.leave = { ...l };
  }

  deleteLeave(l: LeaveType) {
    this.leaves = this.leaves.filter(x => x.LeaveTypeID !== l.LeaveTypeID);
  }

  resetForm() {
    this.leave = { LeaveTypeName: '', IsActive: true };
    this.isEditMode = false;
  }

  // Filtering + Pagination
  filteredLeaves() {
    return this.leaves.filter(l =>
      l.LeaveTypeName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  paginatedLeaves() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredLeaves().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.filteredLeaves().length / this.pageSize);
  }

  pagesArray() {
    return Array(this.totalPages()).fill(0).map((_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) this.currentPage = page;
  }
}

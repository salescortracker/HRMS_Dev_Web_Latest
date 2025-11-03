import { Component } from '@angular/core';
import { ExpenseStatus } from '../../../layout/models/expense-status.model';
@Component({
  selector: 'app-expense-status',
  standalone: false,
  templateUrl: './expense-status.component.html',
  styleUrl: './expense-status.component.css'
})
export class ExpenseStatusComponent {
 status: ExpenseStatus = { ExpenseStatusName: '', IsActive: true };
  statuses: ExpenseStatus[] = [];
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
      { ExpenseStatusID: 1, ExpenseStatusName: 'Pending', IsActive: true },
      { ExpenseStatusID: 2, ExpenseStatusName: 'Approved', IsActive: true },
      { ExpenseStatusID: 3, ExpenseStatusName: 'Rejected', IsActive: false },
      { ExpenseStatusID: 4, ExpenseStatusName: 'Paid', IsActive: true }
    ];
  }

  onSubmit() {
    if (this.isEditMode) {
      const index = this.statuses.findIndex(s => s.ExpenseStatusID === this.status.ExpenseStatusID);
      if (index !== -1) this.statuses[index] = { ...this.status };
    } else {
      const newId = this.statuses.length + 1;
      this.statuses.push({ ExpenseStatusID: newId, ...this.status });
    }
    this.resetForm();
  }

  editStatus(s: ExpenseStatus) {
    this.isEditMode = true;
    this.status = { ...s };
  }

  deleteStatus(s: ExpenseStatus) {
    this.statuses = this.statuses.filter(x => x.ExpenseStatusID !== s.ExpenseStatusID);
  }

  resetForm() {
    this.status = { ExpenseStatusName: '', IsActive: true };
    this.isEditMode = false;
  }

  // Filtering + Pagination
  filteredStatuses() {
    return this.statuses.filter(s =>
      s.ExpenseStatusName.toLowerCase().includes(this.searchText.toLowerCase())
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

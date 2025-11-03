import { Component } from '@angular/core';
import { ProjectStatus } from '../../../layout/models/project-status.model';
@Component({
  selector: 'app-project-status',
  standalone: false,
  templateUrl: './project-status.component.html',
  styleUrl: './project-status.component.css'
})
export class ProjectStatusComponent {
status: ProjectStatus = { ProjectStatusName: '', IsActive: true };
  statuses: ProjectStatus[] = [];
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
      { ProjectStatusID: 1, ProjectStatusName: 'Planned', IsActive: true },
      { ProjectStatusID: 2, ProjectStatusName: 'In Progress', IsActive: true },
      { ProjectStatusID: 3, ProjectStatusName: 'Completed', IsActive: true },
      { ProjectStatusID: 4, ProjectStatusName: 'On Hold', IsActive: false }
    ];
  }

  onSubmit() {
    if (this.isEditMode) {
      const index = this.statuses.findIndex(s => s.ProjectStatusID === this.status.ProjectStatusID);
      if (index !== -1) this.statuses[index] = { ...this.status };
    } else {
      const newId = this.statuses.length + 1;
      this.statuses.push({ ProjectStatusID: newId, ...this.status });
    }
    this.resetForm();
  }

  editStatus(s: ProjectStatus) {
    this.isEditMode = true;
    this.status = { ...s };
  }

  deleteStatus(s: ProjectStatus) {
    this.statuses = this.statuses.filter(x => x.ProjectStatusID !== s.ProjectStatusID);
  }

  resetForm() {
    this.status = { ProjectStatusName: '', IsActive: true };
    this.isEditMode = false;
  }

  // Filtering + Pagination
  filteredStatuses() {
    return this.statuses.filter(s =>
      s.ProjectStatusName.toLowerCase().includes(this.searchText.toLowerCase())
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

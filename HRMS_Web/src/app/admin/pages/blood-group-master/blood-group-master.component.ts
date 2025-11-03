import { Component } from '@angular/core';
import { BloodGroup } from '../../layout/models/Bloodgroup.model';
@Component({
  selector: 'app-blood-group-master',
  standalone: false,
  templateUrl: './blood-group-master.component.html',
  styleUrl: './blood-group-master.component.css'
})
export class BloodGroupMasterComponent {
bloodGroups: BloodGroup[] = [
    { BloodgroupID: 1, BloodGroupName: 'A+', IsActive: true },
    { BloodgroupID: 2, BloodGroupName: 'B-', IsActive: false },
    { BloodgroupID: 3, BloodGroupName: 'O+', IsActive: true },
    { BloodgroupID: 4, BloodGroupName: 'AB-', IsActive: true },
    { BloodgroupID: 5, BloodGroupName: 'B+', IsActive: false },
    { BloodgroupID: 6, BloodGroupName: 'O-', IsActive: true },
    { BloodgroupID: 7, BloodGroupName: 'A-', IsActive: true },
    // ...add more sample data for testing
  ];

  bloodGroup: BloodGroup = { BloodgroupID: 0, BloodGroupName: '', IsActive: false };
  isEditMode = false;

  // Pagination & Search
  currentPage: number = 1;
  pageSize: number = 5;
  searchText: string = '';

  // Filter BloodGroups based on search text
  filteredBloodGroups(): BloodGroup[] {
    if (!this.searchText) return this.bloodGroups;
    return this.bloodGroups.filter(bg =>
      bg.BloodGroupName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Return paginated array
  paginatedBloodGroups(): BloodGroup[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredBloodGroups().slice(start, start + this.pageSize);
  }

  totalPages(): number {
    return Math.ceil(this.filteredBloodGroups().length / this.pageSize);
  }

  pagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage = page;
  }

  // Form Logic
  onSubmit() {
    if (this.isEditMode) {
      const index = this.bloodGroups.findIndex(bg => bg.BloodgroupID === this.bloodGroup.BloodgroupID);
      if (index !== -1) this.bloodGroups[index] = { ...this.bloodGroup };
      this.isEditMode = false;
    } else {
      const newId = this.bloodGroups.length > 0 ? Math.max(...this.bloodGroups.map(bg => bg.BloodgroupID)) + 1 : 1;
      this.bloodGroups.push({ ...this.bloodGroup, BloodgroupID: newId });
    }
    this.resetForm();
  }

  editBloodGroup(bg: BloodGroup) {
    this.bloodGroup = { ...bg };
    this.isEditMode = true;
  }

  deleteBloodGroup(bg: BloodGroup) {
    this.bloodGroups = this.bloodGroups.filter(b => b.BloodgroupID !== bg.BloodgroupID);
  }

  resetForm() {
    this.bloodGroup = { BloodgroupID: 0, BloodGroupName: '', IsActive: false };
    this.isEditMode = false;
  }
}

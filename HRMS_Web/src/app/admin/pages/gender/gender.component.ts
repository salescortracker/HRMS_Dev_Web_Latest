import { Component } from '@angular/core';
import { Gender } from '../../layout/models/gender.model';
@Component({
  selector: 'app-gender',
  standalone: false,
  templateUrl: './gender.component.html',
  styleUrl: './gender.component.css'
})
export class GenderComponent {
 genders: Gender[] = [
    { GenderID: 1, GenderName: 'Male', IsActive: true },
    { GenderID: 2, GenderName: 'Female', IsActive: true },
    { GenderID: 3, GenderName: 'Other', IsActive: false },
  ];

  gender: Gender = { GenderID: 0, GenderName: '', IsActive: true };
  isEditMode = false;

  // Pagination & Search
  currentPage: number = 1;
  pageSize: number = 5;
  searchText: string = '';

  // Filter
  filteredGenders(): Gender[] {
    if (!this.searchText) return this.genders;
    return this.genders.filter(g =>
      g.GenderName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Paginate
  paginatedGenders(): Gender[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredGenders().slice(start, start + this.pageSize);
  }

  totalPages(): number {
    return Math.ceil(this.filteredGenders().length / this.pageSize);
  }

  pagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage = page;
  }

  // Form methods
  onSubmit() {
    if (this.isEditMode) {
      const index = this.genders.findIndex(g => g.GenderID === this.gender.GenderID);
      if (index !== -1) this.genders[index] = { ...this.gender };
      this.isEditMode = false;
    } else {
      const newId = this.genders.length > 0 ? Math.max(...this.genders.map(g => g.GenderID)) + 1 : 1;
      this.genders.push({ ...this.gender, GenderID: newId });
    }
    this.resetForm();
  }

  editGender(g: Gender) {
    this.gender = { ...g };
    this.isEditMode = true;
  }

  deleteGender(g: Gender) {
    this.genders = this.genders.filter(gg => gg.GenderID !== g.GenderID);
  }

  resetForm() {
    this.gender = { GenderID: 0, GenderName: '', IsActive: true };
    this.isEditMode = false;
  }

}

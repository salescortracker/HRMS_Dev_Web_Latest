import { Component } from '@angular/core';
import { HelpdeskCategory } from '../../../layout/models/helpdesk-category.model';
@Component({
  selector: 'app-helpdesk-category',
  standalone: false,
  templateUrl: './helpdesk-category.component.html',
  styleUrl: './helpdesk-category.component.css'
})
export class HelpdeskCategoryComponent {
  category: HelpdeskCategory = { CategoryName: '', IsActive: true };
  categories: HelpdeskCategory[] = [];
  isEditMode = false;
  searchText = '';

  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    // Sample data – replace with API call
    this.categories = [
      { HelpdeskCategoryID: 1, CategoryName: 'IT Support', IsActive: true },
      { HelpdeskCategoryID: 2, CategoryName: 'HR Query', IsActive: true },
      { HelpdeskCategoryID: 3, CategoryName: 'Payroll Issue', IsActive: false }
    ];
  }

  onSubmit() {
    if (this.isEditMode) {
      const index = this.categories.findIndex(c => c.HelpdeskCategoryID === this.category.HelpdeskCategoryID);
      if (index !== -1) this.categories[index] = { ...this.category };
    } else {
      const newId = this.categories.length + 1;
      this.categories.push({ HelpdeskCategoryID: newId, ...this.category });
    }
    this.resetForm();
  }

  editCategory(c: HelpdeskCategory) {
    this.isEditMode = true;
    this.category = { ...c };
  }

  deleteCategory(c: HelpdeskCategory) {
    this.categories = this.categories.filter(x => x.HelpdeskCategoryID !== c.HelpdeskCategoryID);
  }

  resetForm() {
    this.category = { CategoryName: '', IsActive: true };
    this.isEditMode = false;
  }

  // Filtering + Pagination
  filteredCategories() {
    return this.categories.filter(c =>
      c.CategoryName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  paginatedCategories() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCategories().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.filteredCategories().length / this.pageSize);
  }

  pagesArray() {
    return Array(this.totalPages()).fill(0).map((_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) this.currentPage = page;
  }
}

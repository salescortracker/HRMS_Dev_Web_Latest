import { Component } from '@angular/core';
import { KpiCategory } from '../../../layout/models/kpi-category.model';
@Component({
  selector: 'app-kpi-category',
  standalone: false,
  templateUrl: './kpi-category.component.html',
  styleUrl: './kpi-category.component.css'
})
export class KpiCategoryComponent {
kpi: KpiCategory = { KpiCategoryName: '', IsActive: true };
  kpis: KpiCategory[] = [];
  isEditMode = false;
  searchText = '';

  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadKpis();
  }

  loadKpis() {
    // Sample data – replace with API call
    this.kpis = [
      { KpiCategoryID: 1, KpiCategoryName: 'Productivity', IsActive: true },
      { KpiCategoryID: 2, KpiCategoryName: 'Attendance', IsActive: true },
      { KpiCategoryID: 3, KpiCategoryName: 'Quality', IsActive: false }
    ];
  }

  onSubmit() {
    if (this.isEditMode) {
      const index = this.kpis.findIndex(k => k.KpiCategoryID === this.kpi.KpiCategoryID);
      if (index !== -1) this.kpis[index] = { ...this.kpi };
    } else {
      const newId = this.kpis.length + 1;
      this.kpis.push({ KpiCategoryID: newId, ...this.kpi });
    }
    this.resetForm();
  }

  editKpi(k: KpiCategory) {
    this.isEditMode = true;
    this.kpi = { ...k };
  }

  deleteKpi(k: KpiCategory) {
    this.kpis = this.kpis.filter(x => x.KpiCategoryID !== k.KpiCategoryID);
  }

  resetForm() {
    this.kpi = { KpiCategoryName: '', IsActive: true };
    this.isEditMode = false;
  }

  // Filtering + Pagination
  filteredKpis() {
    return this.kpis.filter(k =>
      k.KpiCategoryName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  paginatedKpis() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredKpis().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.filteredKpis().length / this.pageSize);
  }

  pagesArray() {
    return Array(this.totalPages()).fill(0).map((_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) this.currentPage = page;
  }
}

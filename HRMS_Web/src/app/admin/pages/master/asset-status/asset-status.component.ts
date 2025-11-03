import { Component } from '@angular/core';
import { AssetStatus } from '../../../layout/models/asset-status.model';
@Component({
  selector: 'app-asset-status',
  standalone: false,
  templateUrl: './asset-status.component.html',
  styleUrl: './asset-status.component.css'
})
export class AssetStatusComponent {
asset: AssetStatus = { AssetStatusName: '', IsActive: true };
  assets: AssetStatus[] = [];
  isEditMode = false;
  searchText = '';

  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadAssets();
  }

  loadAssets() {
    // Sample data – replace with API call
    this.assets = [
      { AssetStatusID: 1, AssetStatusName: 'Available', IsActive: true },
      { AssetStatusID: 2, AssetStatusName: 'Assigned', IsActive: true },
      { AssetStatusID: 3, AssetStatusName: 'Under Maintenance', IsActive: true },
      { AssetStatusID: 4, AssetStatusName: 'Retired', IsActive: false }
    ];
  }

  onSubmit() {
    if (this.isEditMode) {
      const index = this.assets.findIndex(a => a.AssetStatusID === this.asset.AssetStatusID);
      if (index !== -1) this.assets[index] = { ...this.asset };
    } else {
      const newId = this.assets.length + 1;
      this.assets.push({ AssetStatusID: newId, ...this.asset });
    }
    this.resetForm();
  }

  editAsset(a: AssetStatus) {
    this.isEditMode = true;
    this.asset = { ...a };
  }

  deleteAsset(a: AssetStatus) {
    this.assets = this.assets.filter(x => x.AssetStatusID !== a.AssetStatusID);
  }

  resetForm() {
    this.asset = { AssetStatusName: '', IsActive: true };
    this.isEditMode = false;
  }

  // Filtering + Pagination
  filteredAssets() {
    return this.assets.filter(a =>
      a.AssetStatusName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  paginatedAssets() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredAssets().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.filteredAssets().length / this.pageSize);
  }

  pagesArray() {
    return Array(this.totalPages()).fill(0).map((_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) this.currentPage = page;
  }
}

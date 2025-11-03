import { Component } from '@angular/core';
import { PolicyCategory } from '../../../layout/models/policy-category.model';
@Component({
  selector: 'app-policy-category',
  standalone: false,
  templateUrl: './policy-category.component.html',
  styleUrl: './policy-category.component.css'
})
export class PolicyCategoryComponent {
 policy: PolicyCategory = { PolicyCategoryName: '', IsActive: true };
  policies: PolicyCategory[] = [];
  isEditMode = false;
  searchText = '';

  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies() {
    // Sample data – replace with API call
    this.policies = [
      { PolicyCategoryID: 1, PolicyCategoryName: 'Leave', IsActive: true },
      { PolicyCategoryID: 2, PolicyCategoryName: 'Travel', IsActive: true },
      { PolicyCategoryID: 3, PolicyCategoryName: 'IT', IsActive: false }
    ];
  }

  onSubmit() {
    if (this.isEditMode) {
      const index = this.policies.findIndex(p => p.PolicyCategoryID === this.policy.PolicyCategoryID);
      if (index !== -1) this.policies[index] = { ...this.policy };
    } else {
      const newId = this.policies.length + 1;
      this.policies.push({ PolicyCategoryID: newId, ...this.policy });
    }
    this.resetForm();
  }

  editPolicy(p: PolicyCategory) {
    this.isEditMode = true;
    this.policy = { ...p };
  }

  deletePolicy(p: PolicyCategory) {
    this.policies = this.policies.filter(x => x.PolicyCategoryID !== p.PolicyCategoryID);
  }

  resetForm() {
    this.policy = { PolicyCategoryName: '', IsActive: true };
    this.isEditMode = false;
  }

  // Filtering + Pagination
  filteredPolicies() {
    return this.policies.filter(p =>
      p.PolicyCategoryName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  paginatedPolicies() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredPolicies().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.filteredPolicies().length / this.pageSize);
  }

  pagesArray() {
    return Array(this.totalPages()).fill(0).map((_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) this.currentPage = page;
  }
}

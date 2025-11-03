import { Component } from '@angular/core';
import { Relationship } from '../../../layout/models/relationship.model';
@Component({
  selector: 'app-relationship',
  standalone: false,
  templateUrl: './relationship.component.html',
  styleUrl: './relationship.component.css'
})
export class RelationshipComponent {
relationship: Relationship = { RelationshipName: '', IsActive: true };
  relationships: Relationship[] = [];
  isEditMode = false;
  searchText = '';

  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadRelationships();
  }

  loadRelationships() {
    // Sample data – replace with API call
    this.relationships = [
      { RelationshipID: 1, RelationshipName: 'Spouse', IsActive: true },
      { RelationshipID: 2, RelationshipName: 'Child', IsActive: true },
      { RelationshipID: 3, RelationshipName: 'Parent', IsActive: false }
    ];
  }

  onSubmit() {
    if (this.isEditMode) {
      const index = this.relationships.findIndex(r => r.RelationshipID === this.relationship.RelationshipID);
      if (index !== -1) this.relationships[index] = { ...this.relationship };
    } else {
      const newId = this.relationships.length + 1;
      this.relationships.push({ RelationshipID: newId, ...this.relationship });
    }
    this.resetForm();
  }

  editRelationship(r: Relationship) {
    this.isEditMode = true;
    this.relationship = { ...r };
  }

  deleteRelationship(r: Relationship) {
    this.relationships = this.relationships.filter(x => x.RelationshipID !== r.RelationshipID);
  }

  resetForm() {
    this.relationship = { RelationshipName: '', IsActive: true };
    this.isEditMode = false;
  }

  // Filtering + Pagination
  filteredRelationships() {
    return this.relationships.filter(r =>
      r.RelationshipName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  paginatedRelationships() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRelationships().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.filteredRelationships().length / this.pageSize);
  }

  pagesArray() {
    return Array(this.totalPages()).fill(0).map((_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) this.currentPage = page;
  }
}

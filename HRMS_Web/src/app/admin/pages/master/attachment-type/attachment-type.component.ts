import { Component } from '@angular/core';
import { AttachmentType } from '../../../layout/models/attachment-type.model';
@Component({
  selector: 'app-attachment-type',
  standalone: false,
  templateUrl: './attachment-type.component.html',
  styleUrl: './attachment-type.component.css'
})
export class AttachmentTypeComponent {
attachment: AttachmentType = { AttachmentTypeName: '', IsActive: true };
  attachments: AttachmentType[] = [];
  isEditMode = false;
  searchText = '';

  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadAttachments();
  }

  loadAttachments() {
    // Sample data – replace with API call
    this.attachments = [
      { AttachmentTypeID: 1, AttachmentTypeName: 'Resume', IsActive: true },
      { AttachmentTypeID: 2, AttachmentTypeName: 'ID Proof', IsActive: true },
      { AttachmentTypeID: 3, AttachmentTypeName: 'Certificates', IsActive: false }
    ];
  }

  onSubmit() {
    if (this.isEditMode) {
      const index = this.attachments.findIndex(a => a.AttachmentTypeID === this.attachment.AttachmentTypeID);
      if (index !== -1) this.attachments[index] = { ...this.attachment };
    } else {
      const newId = this.attachments.length + 1;
      this.attachments.push({ AttachmentTypeID: newId, ...this.attachment });
    }
    this.resetForm();
  }

  editAttachment(a: AttachmentType) {
    this.isEditMode = true;
    this.attachment = { ...a };
  }

  deleteAttachment(a: AttachmentType) {
    this.attachments = this.attachments.filter(x => x.AttachmentTypeID !== a.AttachmentTypeID);
  }

  resetForm() {
    this.attachment = { AttachmentTypeName: '', IsActive: true };
    this.isEditMode = false;
  }

  // Filtering + Pagination
  filteredAttachments() {
    return this.attachments.filter(a =>
      a.AttachmentTypeName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  paginatedAttachments() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredAttachments().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.filteredAttachments().length / this.pageSize);
  }

  pagesArray() {
    return Array(this.totalPages()).fill(0).map((_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) this.currentPage = page;
  }
}

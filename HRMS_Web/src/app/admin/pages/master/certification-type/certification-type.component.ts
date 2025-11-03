import { Component } from '@angular/core';
import { CertificationType } from '../../../layout/models/certification-type.model';
@Component({
  selector: 'app-certification-type',
  standalone: false,
  templateUrl: './certification-type.component.html',
  styleUrl: './certification-type.component.css'
})
export class CertificationTypeComponent {

  certification: CertificationType = { CertificationTypeName: '', IsActive: true };
  certifications: CertificationType[] = [];
  isEditMode = false;
  searchText = '';

  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadCertifications();
  }

  loadCertifications() {
    // Sample Data – replace with API call
    this.certifications = [
      { CertificationTypeID: 1, CertificationTypeName: 'PMP', IsActive: true },
      { CertificationTypeID: 2, CertificationTypeName: 'AWS', IsActive: true },
      { CertificationTypeID: 3, CertificationTypeName: 'ISO', IsActive: false }
    ];
  }

  onSubmit() {
    if (this.isEditMode) {
      const index = this.certifications.findIndex(c => c.CertificationTypeID === this.certification.CertificationTypeID);
      if (index !== -1) this.certifications[index] = { ...this.certification };
    } else {
      const newId = this.certifications.length + 1;
      this.certifications.push({ CertificationTypeID: newId, ...this.certification });
    }
    this.resetForm();
  }

  editCertification(c: CertificationType) {
    this.isEditMode = true;
    this.certification = { ...c };
  }

  deleteCertification(c: CertificationType) {
    this.certifications = this.certifications.filter(x => x.CertificationTypeID !== c.CertificationTypeID);
  }

  resetForm() {
    this.certification = { CertificationTypeName: '', IsActive: true };
    this.isEditMode = false;
  }

  // Filtering + Pagination
  filteredCertifications() {
    return this.certifications.filter(c =>
      c.CertificationTypeName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  paginatedCertifications() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCertifications().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.filteredCertifications().length / this.pageSize);
  }

  pagesArray() {
    return Array(this.totalPages()).fill(0).map((_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) this.currentPage = page;
  }
}

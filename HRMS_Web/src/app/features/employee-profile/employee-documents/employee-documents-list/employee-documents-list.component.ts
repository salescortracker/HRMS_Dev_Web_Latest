import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService, DocumentTypeDto, EmployeeDocumentDto } from '../../../../admin/servies/admin.service';
import { finalize, Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-documents-list',
  standalone: false,
  templateUrl: './employee-documents-list.component.html',
  styleUrl: './employee-documents-list.component.css'
})
export class EmployeeDocumentsListComponent implements OnInit {
    documentForm!: FormGroup;
  documents: EmployeeDocumentDto[] = [];
  documentTypeList: DocumentTypeDto[] = [];

  // 🔍 Filter, sort, paginate
  searchText: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  // 📄 Form state
  selectedFile: File | null = null;
  selectedDocumentId?: number;
  isEditMode = false;
  loading = false;

  private employeeId = 1003; // Replace with dynamic ID later

  constructor(private fb: FormBuilder, private adminService: AdminService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDocuments();
    this.loadDocumentTypes();
  }

  private initForm(): void {
    this.documentForm = this.fb.group({
      documentTypeId: ['', Validators.required],
      documentName: ['', Validators.required],
      documentNumber: [''],
      issuedDate: ['', Validators.required],
      expiryDate: [''],
      remarks: [''],
      isConfidential: [false],
      documentFile: [null, Validators.required],
    });
  }

  private loadDocuments(): void {
    this.adminService.getEmployeeDocuments(this.employeeId).subscribe({
      next: (data) => {
        this.documents = data || [];
        this.updatePagination();
      },
      error: (err) => console.error('Error loading documents:', err)
    });
  }

  private loadDocumentTypes(): void {
    this.adminService.getAllDocumentTypes().subscribe({
      next: (data) => (this.documentTypeList = data || []),
      error: (err) => console.error('Error loading document types:', err)
    });
  }

  // 📂 File selection
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.documentForm.patchValue({ documentFile: file });
    }
  }

  // 💾 Save or update document
 saveDocument(): void {
  // Allow empty file only if editing
  const fileControl = this.documentForm.get('documentFile');
  if (!this.isEditMode && !fileControl?.value) {
    Swal.fire('Warning', 'Please fill all required fields.', 'warning');
    return;
  }

  if (this.documentForm.invalid) {
    Swal.fire('Warning', 'Please fill all required fields.', 'warning');
    return;
  }

  const formData = new FormData();
  Object.entries(this.documentForm.value).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value instanceof Blob ? value : String(value));
    }
  });

  if (this.selectedFile) {
    formData.append('documentFile', this.selectedFile);
  }

  formData.append('employeeId', String(this.employeeId));

  this.loading = true;

  const request$ = this.isEditMode && this.selectedDocumentId
    ? this.adminService.updateEmployeeDocument(this.selectedDocumentId, formData)
    : this.adminService.addEmployeeDocument(formData);

  request$.pipe(finalize(() => (this.loading = false))).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: this.isEditMode ? 'Document Updated' : 'Document Saved',
        showConfirmButton: false,
        timer: 1500,
      });
      this.resetForm();
      this.loadDocuments();
    },
    error: (err) => {
      console.error('Save error:', err);
      Swal.fire('Error', 'Something went wrong while saving.', 'error');
    },
  });
}

  editDocument(doc: EmployeeDocumentDto): void {
    this.isEditMode = true;
    this.selectedDocumentId = doc.id;
    this.documentForm.patchValue({
      documentTypeId: doc.documentTypeId,
      documentName: doc.documentName,
      documentNumber: doc.documentNumber,
      issuedDate: doc.issuedDate,
      expiryDate: doc.expiryDate,
      remarks: doc.remarks,
      isConfidential: doc.isConfidential
    });
  }

  deleteDocument(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the document!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteEmployeeDocument(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Document deleted successfully.', 'success');
            this.loadDocuments();
          },
          error: () => Swal.fire('Error', 'Failed to delete document.', 'error'),
        });
      }
    });
  }

  viewDocument(filePath: string | undefined): void {
    if (!filePath) {
      Swal.fire('Error', 'No file path available.', 'error');
      return;
    }
    const fullPath = `https://localhost:7146/${filePath}`;
    window.open(fullPath, '_blank');
  }

  resetForm(): void {
    this.documentForm.reset();
    this.selectedFile = null;
    this.isEditMode = false;
    this.selectedDocumentId = undefined;
  }

  // 🔍 Filtering
  onFilterChange(): void {
    this.currentPage = 1;
  }

  filteredDocuments(): EmployeeDocumentDto[] {
    let filtered = this.documents;
    if (this.searchText.trim()) {
      const lower = this.searchText.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.documentName?.toLowerCase().includes(lower) ||
        doc.documentNumber?.toLowerCase().includes(lower) ||
        doc.remarks?.toLowerCase().includes(lower)
      );
    }

    // Sorting
    if (this.sortColumn) {
      filtered = filtered.sort((a: any, b: any) => {
        const valA = a[this.sortColumn] ?? '';
        const valB = b[this.sortColumn] ?? '';
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
    }

    // Pagination
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.updatePagination();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.documents.length / this.pageSize);
  }

  // 🔹 NEW: Get document type name safely
  getDocumentTypeName(documentTypeId: number | undefined): string {
    const type = this.documentTypeList.find(t => t.id === documentTypeId);
    return type ? type.typeName : '-';
  }

}
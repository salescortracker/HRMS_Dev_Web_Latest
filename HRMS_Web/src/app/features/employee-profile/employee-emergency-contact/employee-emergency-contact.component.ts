import { Component } from '@angular/core';
import { EmployeeEmergencyContact } from '../../../admin/layout/models/employee-emergency-contact.model';
import { AdminService } from '../../../admin/servies/admin.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-emergency-contact',
  standalone: false,
  templateUrl: './employee-emergency-contact.component.html',
  styleUrl: './employee-emergency-contact.component.css'
})
export class EmployeeEmergencyContactComponent {
  contacts: EmployeeEmergencyContact[] = [];
  formModel: Partial<EmployeeEmergencyContact> = {};
  isEdit = false;
  editId: number | null = null;
  employeeId = 1;

  // 🔹 Filters & Sorting
  searchText = '';
  sortColumn: keyof EmployeeEmergencyContact | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  // 🔹 Pagination
  pageSize = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(private contactService: AdminService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts() {
    this.contactService.getContactsByEmployeeId(this.employeeId).subscribe({
      next: (res) => (this.contacts = res),
      error: (err) => console.error('Error loading contacts:', err)
    });
  }

  saveContact(form: NgForm) {
    if (!form.valid) return;

    const payload: EmployeeEmergencyContact = {
      ...this.formModel,
      employeeId: this.employeeId
    } as EmployeeEmergencyContact;

    if (this.isEdit && this.editId) {
      this.contactService.updateContact(this.editId, payload).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Contact updated successfully.',
            timer: 2000,
            showConfirmButton: false
          });
          this.cancelEdit(form);
          this.loadContacts();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Update Failed!',
            text: 'Something went wrong while updating.',
          });
          console.error('Update failed:', err);
        }
      });
    } else {
      this.contactService.createContact(payload).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Added!',
            text: 'Contact added successfully.',
            timer: 2000,
            showConfirmButton: false
          });
          form.resetForm();
          this.loadContacts();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Create Failed!',
            text: 'Unable to add contact.',
          });
          console.error('Create failed:', err);
        }
      });
    }
  }

  editContact(contact: EmployeeEmergencyContact) {
    this.isEdit = true;
    this.editId = contact.emergencyContactId;
    this.formModel = { ...contact };
  }

  deleteContact(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactService.deleteContact(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Contact deleted successfully.',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadContacts();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed!',
              text: 'Something went wrong while deleting.',
            });
            console.error('Delete failed:', err);
          }
        });
      }
    });
  }

  cancelEdit(form?: NgForm) {
    this.isEdit = false;
    this.editId = null;
    this.formModel = {};
    if (form) form.resetForm();
  }

  // 🔹 Sorting
  sortBy(column: keyof EmployeeEmergencyContact) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  getSortedContacts(): EmployeeEmergencyContact[] {
    let data = [...this.contacts];
    if (this.sortColumn) {
      data.sort((a, b) => {
        const valA = (a[this.sortColumn!] ?? '') as any;
        const valB = (b[this.sortColumn!] ?? '') as any;
        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }

  filteredContacts(): EmployeeEmergencyContact[] {
    let data = this.getSortedContacts().filter(c =>
      c.contactName?.toLowerCase().includes(this.searchText.toLowerCase())
    );

    const startIndex = (this.currentPage - 1) * this.pageSize;
    return data.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(
      this.getSortedContacts().filter(c =>
        c.contactName?.toLowerCase().includes(this.searchText.toLowerCase())
      ).length / this.pageSize
    );
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.formModel = {};
    this.isEdit = false;
    this.editId = null;
    Swal.fire({
      icon: 'info',
      title: 'Form Reset',
      text: 'The form has been cleared.',
      timer: 1500,
      showConfirmButton: false
    });
  }
}

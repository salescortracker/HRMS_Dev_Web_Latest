import { Component, OnInit } from '@angular/core';
import {  AdminService, EmployeeFamilyDetail } from '../../../../admin/servies/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-employee-family-details',
  standalone: false,
  templateUrl: './employee-family-details.component.html',
  styleUrls: ['./employee-family-details.component.css']
})
export class EmployeeFamilyDetailsComponent implements OnInit {
 familyForm!: FormGroup;
  familyMembers: EmployeeFamilyDetail[] = [];
  isEditing = false;
  editId: number | null = null;

  employeeId = 101; // 🔹 Replace with logged-in employee ID later

  constructor(private fb: FormBuilder, private adminService: AdminService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadFamilyMembers();
  }

  initializeForm(): void {
    this.familyForm = this.fb.group({
      name: ['', Validators.required],
      relationship: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      occupation: [''],
      phone: [''],
      address: [''],
      isDependent: [false, Validators.required]
    });
  }

  // ✅ Fetch dynamic data from API
  loadFamilyMembers(): void {
   this.adminService.getEmployeeFamilyDetails(this.employeeId).subscribe({
    next: (data) => {
      // optional: filter results by employeeId in UI if needed
      this.familyMembers = data.filter(x => x.employeeId === this.employeeId);
    },
    error: (err) => console.error('Error loading family details:', err)
  });
  }

  // ✅ Create or update record
  onSubmit(): void {
    if (this.familyForm.invalid) return;

    const formValue = this.familyForm.value as EmployeeFamilyDetail;
    const model: EmployeeFamilyDetail = {
      ...formValue,
      familyId: this.editId || 0,
      employeeId: this.employeeId,
      companyId: 1,
      regionId: 1,
      createdBy: 1,
      modifiedBy: null
    };

    if (this.isEditing && this.editId) {
      // Update
      this.adminService.updateEmployeeFamilyDetail(this.editId, model).subscribe({
        next: () => {
          this.loadFamilyMembers();
          this.resetForm();
        },
        error: (err) => console.error('Update failed:', err)
      });
    } else {
      // Create
      this.adminService.createEmployeeFamilyDetail(model).subscribe({
        next: () => {
          this.loadFamilyMembers();
          this.resetForm();
        },
        error: (err) => console.error('Create failed:', err)
      });
    }
  }

  // ✅ Edit existing record
  onEdit(member: EmployeeFamilyDetail): void {
    this.isEditing = true;
    this.editId = member.familyId;
    this.familyForm.patchValue(member);
  }

  // ✅ Delete record
  onDelete(member: EmployeeFamilyDetail): void {
    if (confirm('Are you sure you want to delete this family record?')) {
      this.adminService.deleteEmployeeFamilyDetail(member.familyId).subscribe({
        next: () => this.loadFamilyMembers(),
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }

  resetForm(): void {
    this.familyForm.reset({ isDependent: false });
    this.isEditing = false;
    this.editId = null;
  }
}
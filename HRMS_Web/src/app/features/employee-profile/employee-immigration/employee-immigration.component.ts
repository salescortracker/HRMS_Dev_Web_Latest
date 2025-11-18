import { Component, OnInit } from '@angular/core';
import { EmployeeImmigration } from '../../../admin/layout/models/employee-Immigration.model';
import { AdminService } from '../../../admin/servies/admin.service';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-immigration',
  standalone: false,
  templateUrl: './employee-immigration.component.html',
  styleUrl: './employee-immigration.component.css'
})
export class EmployeeImmigrationComponent implements OnInit {
  immigrationList: EmployeeImmigration[] = [];
  formModel: EmployeeImmigration = {} as EmployeeImmigration;
  isEditMode = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadImmigrations();
  }

  loadImmigrations(): void {
  this.adminService.getAllEmployeeImmigrations().subscribe({
    next: (data) => {
      console.log('Loaded immigration data:', data);
      this.immigrationList = data; // <-- this binds data to your HTML table
    },
    error: (err) => console.error('Error loading immigration data', err)
  });
}


 saveImmigration(form: NgForm): void {
  console.log('Form submitted:', this.formModel); // ✅ Debug line
  if (form.invalid) {
    alert('Please fill in required fields!');
    return;
  }

  if (this.isEditMode) {
    this.adminService.updateEmployeeImmigration(this.formModel.immigrationId, this.formModel).subscribe({
      next: () => {
        alert('Immigration record updated successfully!');
        this.resetForm(form);
        this.loadImmigrations();
      },
      error: (err) => console.error('Update failed', err)
    });
  } else {
    this.adminService.createEmployeeImmigration(this.formModel).subscribe({
      next: () => {
        alert('Immigration record added successfully!');
        this.resetForm(form);
        this.loadImmigrations();
      },
      error: (err) => console.error('Create failed', err)
    });
  }
}

  editImmigration(item: EmployeeImmigration): void {
    this.formModel = { ...item };
    this.isEditMode = true;
  }

  deleteImmigration(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.adminService.deleteEmployeeImmigration(id).subscribe({
        next: () => {
          alert('Record deleted successfully!');
          this.loadImmigrations();
        },
        error: (err) => console.error('Delete failed', err)
      });
    }
  }

  resetForm(form: NgForm): void {
    form.resetForm();
    this.formModel = {} as EmployeeImmigration;
    this.isEditMode = false;
  }
  onFileChange(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      (this.formModel as any)[field] = file.name;
    }
  }
}

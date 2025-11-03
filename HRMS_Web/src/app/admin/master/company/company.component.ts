
import { Component, OnInit } from '@angular/core';
import { AdminService,Company } from '../../servies/admin.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-company',
  standalone: false,
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent {
 // Model for form
  company: Company = this.getEmptyCompany();

  // List of companies
  companies: Company[] = [];

  // Control variables
  isEditMode = false;
  searchText = '';
  statusFilter: boolean | '' = '';

  constructor(private adminservice: AdminService,private spinner: NgxSpinnerService) {}

  // ------------------------------------------------------------
  // 🔹 OnInit - Load Companies
  // ------------------------------------------------------------
  ngOnInit(): void {
    this.loadCompanies();
  }

  // ------------------------------------------------------------
  // 🔹 Create empty company model
  // ------------------------------------------------------------
  getEmptyCompany(): Company {
    return {
      companyId: 0,
      companyName: '',
      companyCode: '',
      industryType: '',
      headquarters: '',
      isActive: true
    };
  }

  // ------------------------------------------------------------
  // 🔹 Load all companies
  // ------------------------------------------------------------
  loadCompanies(): void {
     this.spinner.show();
    this.adminservice.getCompanies().subscribe({
      next: (res:Company[]) => {
        this.companies = res;
         this.spinner.hide();
         console.log('Loaded companies:', this.companies);
      },
      error: (err) => {
        console.error('Error loading companies:', err);
      }
    });
  }

  // ------------------------------------------------------------
  // 🔹 Submit form - Add or Update
  // ------------------------------------------------------------
  onSubmit(): void {
     this.spinner.show();
    if (this.isEditMode) {
      // Update existing company
      this.adminservice.updateCompany(this.company.companyId, this.company).subscribe({
        next: () => {
           this.spinner.hide();
         Swal.fire({
          icon: 'success',
          title: 'Updated Successfully!',
          text: `${this.company.companyName} has been updated.`,
         showCloseButton: true,
          showConfirmButton: false
        });
          this.loadCompanies();
          this.resetForm();
        },
        error: (err) =>{
           this.spinner.hide();
          Swal.fire('Error', 'Update failed! Please contact IT Administrator.', 'error');
        }
      });
    } else {
      // Create new company
      this.adminservice.createCompany(this.company).subscribe({
        next: () => {
          this.spinner.hide();
           Swal.fire({
          icon: 'success',
          title: 'Added Successfully!',
          text: `${this.company.companyName} has been Added Successfully.`,
         
          showConfirmButton: false
          ,showCloseButton: true,
        });
         
          this.loadCompanies();
          this.resetForm();
        },
        error: (err) =>{
          this.spinner.hide();
              Swal.fire('Error', 'Create failed! Please contact IT Administrator.', 'error');
       
        }
          
      });
    }
  }

  // ------------------------------------------------------------
  // 🔹 Edit Company
  // ------------------------------------------------------------
  editCompany(c: Company): void {
    this.company = { ...c };
    console.log(this.company);
    this.isEditMode = true;
  }

  // ------------------------------------------------------------
  // 🔹 Delete Company
  // ------------------------------------------------------------
  deleteCompany(c: Company): void {
    Swal.fire({
  title: `Are you sure you want to delete ${c.companyName}?`,
  showDenyButton: true,
  showCancelButton: true,
  confirmButtonText: "Confirm",
  
}).then((result) => {
  /* Read more about isConfirmed, isDenied below */
  if (result.isConfirmed) {
    this.spinner.show();
      this.adminservice.deleteCompany(c.companyId).subscribe({
        next: () => {
          this.spinner.hide();
           Swal.fire({
          icon: 'success',
          title: 'Deleted Successfully!',
          text: `${this.company.companyName} has been Deleted.`,
         
          showConfirmButton: false
          ,showCloseButton: true,
        });
          this.loadCompanies();
        },
        error: (err) =>{
          this.spinner.hide();
           Swal.fire('Error', 'Delete failed! Please contact IT Administrator.', 'error');
        }
          
      });
  } else if (result.isDenied) {
    Swal.fire('Error', 'Delete failed! Please contact IT Administrator.', 'error');
      
  }
});
  
  }

  // ------------------------------------------------------------
  // 🔹 Toggle status (Active/Inactive)
  // ------------------------------------------------------------
  toggleStatus(c: Company): void {
    const updatedCompany = { ...c, IsActive: !c.isActive };
    this.adminservice.updateCompany(updatedCompany.companyId, updatedCompany).subscribe({
      next: () => {
        c.isActive = updatedCompany.IsActive;
      },
      error: (err) => {
         Swal.fire('Error', 'Status toggle failed.', 'error');
          console.error('Status toggle failed:', err)
      }
       
    });
  }

  // ------------------------------------------------------------
  // 🔹 Reset Form
  // ------------------------------------------------------------
  resetForm(): void {
    this.company = this.getEmptyCompany();
    this.isEditMode = false;
  }

  // ------------------------------------------------------------
  // 🔹 Filter Companies (search + status)
  // ------------------------------------------------------------
 filteredCompanies(): Company[] {
  if (!this.companies || this.companies.length === 0) return [];

  const search = this.searchText ? this.searchText.toLowerCase() : '';
  return this.companies.filter(c => {
    const name = c.companyName ? c.companyName.toLowerCase() : '';
    const matchesSearch = search === '' || name.includes(search);
    const matchesStatus = this.statusFilter === '' || c.isActive === this.statusFilter;
    return matchesSearch && matchesStatus;
  });
}
}

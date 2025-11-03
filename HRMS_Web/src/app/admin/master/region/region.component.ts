import { Component } from '@angular/core';
import { AdminService,Region,Company } from '../../servies/admin.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-region',
  standalone: false,
  templateUrl: './region.component.html',
  styleUrl: './region.component.css'
})
export class RegionComponent {
 regions: Region[] = [];
 companies: Company[] = [];
  region: Region = this.getEmptyRegion();
  isEditMode = false;
  searchText = '';
  statusFilter: boolean | '' = '';

  constructor(
    private adminservice: AdminService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
     this.loadRegions();
   
    
  }
 // ✅ Load Companies for dropdown
  loadCompanies(): void {
    this.adminservice.getCompanies().subscribe({
      next: (data) => {
      
 this.companies = data;
 

      },
      error: (err) => console.error('Error loading companies:', err)
    });
  }
  getCompanyName(companyID: number): string {
  const company = this.companies.filter(c => c.companyId === companyID);
  return company ? company[0].companyName : '-';
}
  getEmptyRegion(): Region {
    return { regionID: 0, companyID: 0, regionName: '', country: '', isActive: true };
  }

  loadRegions(): void {
    this.spinner.show();
    this.adminservice.getRegions().subscribe({
      next: (data:any) => {
        
        this.regions = data;
        this.spinner.hide();
      },
      error: (err:any) => {
        console.error('Error loading regions:', err);
        this.spinner.hide();
      }
    });
  }

  onSubmit(): void {
    this.spinner.show();

    if (this.isEditMode) {
      this.adminservice.updateRegion(this.region.regionID, this.region).subscribe({
        next: () => {
          Swal.fire('Updated!', 'Region updated successfully.', 'success');
          this.loadRegions();
          this.resetForm();
          this.spinner.hide();
        },
        error: () => this.spinner.hide()
      });
    } else {
      this.adminservice.createRegion(this.region).subscribe({
        next: () => {
          Swal.fire('Added!', 'Region added successfully.', 'success');
          this.loadRegions();
          this.resetForm();
          this.spinner.hide();
        },
        error: () => this.spinner.hide()
      });
    }
  }

  editRegion(r: Region): void {
    this.region = { ...r };
    this.isEditMode = true;
  }

  deleteRegion(r: Region): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete region "${r.regionName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.adminservice.deleteRegion(r.regionID).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Region deleted successfully.', 'success');
            this.loadRegions();
            this.spinner.hide();
          },
          error: () => this.spinner.hide()
        });
      }
    });
  }

  resetForm(): void {
    this.region = this.getEmptyRegion();
    this.isEditMode = false;
  }

  filteredRegions(): Region[] {
   const search = this.searchText?.trim().toLowerCase() || '';

  return this.regions.filter(r => {
    const regionName = r.regionName?.toLowerCase() || '';
    const matchesSearch = !search || regionName.includes(search);
    const matchesStatus = this.statusFilter === '' || r.isActive === this.statusFilter;
    return matchesSearch && matchesStatus;
  });
  }

  toggleStatus(r: Region): void {
    r.isActive = !r.isActive;
    this.adminservice.updateRegion(r.regionID, r).subscribe();
  }
}

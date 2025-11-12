import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs';
import { EmployeeReference } from '../layout/models/employee-reference.model';
import { EmployeeForm } from '../layout/models/employee-form.model';
// ------------ Model Interfaces ----------------
export interface Company {
  companyId: number;
  companyName: string;
  companyCode?: string;
  industryType?: string;
  headquarters?: string;
  isActive: boolean;
  CreatedBy?: string;
  CreatedDate?: Date;
  ModifiedBy?: string;
  ModifiedAt?: Date;
}

export interface Region {
  regionID: number;
  companyID: number;
  regionName: string;
  country: string;
  isActive: boolean;
}
export interface User {
  UserID?: number;
  companyId: number;
  regionId: number;
  employeeCode: string;
  fullName: string;
  email: string;
  roleId: number;
  password?: string;
  status: string;
}

export interface MenuMaster {
  menuID: number;
  menuName: string;
  parentMenuID?: number|null;
  url?: string;
  icon?: string;
  orderNo?: number;
  isActive: boolean | number;
  CreatedBy?: string;
  CreatedDate?: Date;
  ModifiedBy?: string;
  ModifiedAt?: Date;
}

export interface RoleMaster {
  roleId?: number| undefined;
  roleName: string;
  roleDescription?: string;
  isActive: boolean;
  createdBy?: string;
  createdAt?: Date;
  modifiedBy?: string;
  modifiedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'https://localhost:7146/api'; // 🔹 Change this to your actual API URL

  constructor(private http: HttpClient) {}
  // -------------------------------------------------------------
  // 🔹 GENERIC HELPERS
  // -------------------------------------------------------------

  private buildParams(params?: Record<string, any>): HttpParams {
    
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value);
        }
      });
    }
    return httpParams;
  }

  private getHeaders() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  }

  // Generic reusable CRUD
  private getAll<T>(endpoint: string, params?: Record<string, any>): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/${endpoint}`, { params: this.buildParams(params) });
  }

  private getById<T>(endpoint: string, id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}/${id}`);
  }

  private create<T>(endpoint: string, model: T): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, model, this.getHeaders());
  }

  private update<T>(endpoint: string, id: number, model: T): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}/${id}`, model, this.getHeaders());
  }

  private delete(endpoint: string, id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${endpoint}/${id}`);
  }

  // -------------------------------------------------------------
  // 🔹 COMPANY OPERATIONS
  // -------------------------------------------------------------
  getCompanies(params?: any): Observable<Company[]> {
    return this.getAll<Company>('UserManagement/GetCompany', params);
  }

  getCompanyById(id: number): Observable<Company> {
    return this.getById<Company>('UserManagement/GetCompanyById', id);
  }

  createCompany(model: Company): Observable<Company> {
    return this.create<Company>('UserManagement/SaveCompany', model);
  }

  updateCompany(id: number, model: Company): Observable<Company> {
    return this.update<Company>('UserManagement/UpdateCompany', id, model);
  }

  deleteCompany(id: number): Observable<void> {
    return this.delete('UserManagement/DeleteCompany', id);
  }

  // -------------------------------------------------------------
  // 🔹 REGION OPERATIONS
  // -------------------------------------------------------------
  getRegions(params?: any): Observable<Region[]> {
    return this.getAll<Region>('UserManagement/GetRegion', params);
  }

  getRegionById(id: number): Observable<Region> {
    return this.getById<Region>('UserManagement/GetRegionById', id);
  }

  createRegion(model: Region): Observable<Region> {
    return this.create<Region>('UserManagement/SaveRegion', model);
  }

  updateRegion(id: number, model: Region): Observable<Region> {
    return this.update<Region>('UserManagement/UpdateRegion', id, model);
  }

  deleteRegion(id: number): Observable<void> {
    return this.delete('UserManagement/DeleteRegion', id);
  }

  // -------------------------------------------------------------
  // 🔹 USER OPERATIONS
  // -------------------------------------------------------------
  // getUsers(params?: any): Observable<User[]> {
  //   return this.getAll<User>('UserManagement/getUsers', params);
  // }

  // getUserById(id: number): Observable<User> {
  //   return this.getById<User>('UserManagement/getUserById', id);
  // }

  // createUser(model: User): Observable<User> {
  //   return this.create<User>('UserManagement/createUser', model);
  // }

  // updateUser(id: number, model: User): Observable<User> {
  //   return this.update<User>('UserManagement/updateUser', id, model);
  // }

  // deleteUser(id: number): Observable<void> {
  //   return this.delete('UserManagement/deleteUser', id);
  // }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/UserManagement/GetAllUsers`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/UserManagement/GetUserById/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/UserManagement/CreateUser`, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/UserManagement/UpdateUser/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/UserManagement/DeleteUser/${id}`);
  }

  sendWelcomeEmail(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/UserManagement/SendEmail`, user);
  }

  // -------------------------------------------------------------
  // 🔹 MENU MASTER OPERATIONS
  // -------------------------------------------------------------
  getMenus(params?: any): Observable<MenuMaster[]> {
    return this.getAll<MenuMaster>('UserManagement/GetAllMenus', params);
  }

  getMenuById(id: number): Observable<MenuMaster> {
    return this.getById<MenuMaster>('UserManagement/GetMenuById', id);
  }

  createMenu(model: MenuMaster): Observable<MenuMaster> {
    return this.create<MenuMaster>('UserManagement/CreateMenu', model);
  }

  updateMenu(id: number, model: MenuMaster): Observable<MenuMaster> {
    return this.update<MenuMaster>('UserManagement/UpdateMenu', id, model);
  }

  deleteMenu(id: number): Observable<void> {
    return this.delete('UserManagement/DeleteMenu', id);
  }

  // -------------------------------------------------------------
  // 🔹 Role MASTER OPERATIONS
  // -------------------------------------------------------------
  getroles(params?: any): Observable<RoleMaster[]> {
    return this.getAll<RoleMaster>('UserManagement/GetAllRoles', params);
  }

  getrolesById(id: number): Observable<RoleMaster> {
    return this.getById<RoleMaster>('UserManagement/GetRoleById', id);
  }

  createRoles(model: RoleMaster): Observable<RoleMaster> {
    return this.create<RoleMaster>('UserManagement/CreateRole', model);
  }

  updateRoles(id: number, model: RoleMaster): Observable<RoleMaster> {
    return this.update<RoleMaster>('UserManagement/UpdateRole', id, model);
  }

  deleteRoles(id: number): Observable<void> {
    return this.delete('UserManagement/DeleteRole', id);
  }

// -------------------------------------------------------------
// 🔹 EMPLOYEE REFERENCE OPERATIONS
// -------------------------------------------------------------
getAllEmployeeReferences(): Observable<EmployeeReference[]> {
  return this.http.get<EmployeeReference[]>(`${this.baseUrl}/UserManagement/GetAllEmployeeReferences`);
}

getEmployeeReferenceById(id: number): Observable<EmployeeReference> {
  return this.http.get<EmployeeReference>(`${this.baseUrl}/UserManagement/GetEmployeeReferenceById/${id}`);
}

createEmployeeReference(model: EmployeeReference): Observable<EmployeeReference> {
  return this.http.post<EmployeeReference>(`${this.baseUrl}/UserManagement/CreateEmployeeReference`, model, this.getHeaders());
}

updateEmployeeReference(id: number, model: EmployeeReference): Observable<EmployeeReference> {
  return this.http.post<EmployeeReference>(`${this.baseUrl}/UserManagement/UpdateEmployeeReference/${id}`, model, this.getHeaders());
}

deleteEmployeeReference(id: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/UserManagement/DeleteEmployeeReference/${id}`);
}


// -------------------------------------------------------------
// 🔹 EMPLOYEE FORM / DOCUMENT UPLOAD OPERATIONS
// -------------------------------------------------------------

getAllEmployeeForms(): Observable<EmployeeForm[]> {
  return this.http.get<EmployeeForm[]>(`${this.baseUrl}/UserManagement/GetAllForms`);
}

getEmployeeFormById(id: number): Observable<EmployeeForm> {
  return this.http.get<EmployeeForm>(`${this.baseUrl}/UserManagement/GetFormById/${id}`);
}

// ✅ Create new form with file upload
createEmployeeForm(formData: FormData): Observable<any> {
  return this.http.post(`${this.baseUrl}/UserManagement/AddForm`, formData);
}

// ✅ Update form with file upload
updateEmployeeForm(id: number, formData: FormData): Observable<any> {
  return this.http.put(`${this.baseUrl}/UserManagement/UpdateForm/${id}`, formData);
}

// ✅ Delete form
deleteEmployeeForm(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/UserManagement/DeleteForm/${id}`);
}

// ✅ Get Active Document Types for Dropdown
getActiveDocumentTypes(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/UserManagement/GetActiveDocumentTypes`);
}

  


  // ✅ Role Permission APIs
  getPermissionsByRole(roleId: number|undefined): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/UserManagement/get-permissions/${roleId}`);
  }

  assignPermissions(roleId: number, permissions: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/UserManagement/assign-permissions/${roleId}`, permissions);
  }

  // ✅ Combined loader: Menus + Role Permissions merged
  getMenusWithPermissions(roleId: number|undefined): Observable<any[]> {
    return forkJoin({
      menus: this.getMenus(),
      permissions: this.getPermissionsByRole(roleId)
    }).pipe(
      map(({ menus, permissions }) => this.mergePermissions(menus, permissions))
    );
  }

  private mergePermissions(menus: MenuMaster[], permissions: any[]): any[] {
  // Function recursively maps permissions to each menu item
  const mapPermissions = (menuList: MenuMaster[]): any[] => {
    return menuList.map((menu): any => {
      const perm = permissions.find(p => p.menuId === menu.menuID);

      const mappedMenu: any = {
        ...menu,
        expanded: false,
        selected: perm ? perm.isActive : false,
        permissions: {
          view: perm ? perm.canView : false,
          add: perm ? perm.canAdd : false,
          edit: perm ? perm.canEdit : false,
          delete: perm ? perm.canDelete : false,
          approve: perm ? perm.canApprove : false
        },
        children: [] as any[]
      };

      // Recursively process children
      const childMenus = menus.filter(m => m.parentMenuID === menu.menuID);
      if (childMenus.length > 0) {
        mappedMenu.children = mapPermissions(childMenus);
      }

      return mappedMenu;
    });
  };

  // Start with root-level menus
  const rootMenus = menus.filter(m => !m.parentMenuID);
  return mapPermissions(rootMenus);
}


}

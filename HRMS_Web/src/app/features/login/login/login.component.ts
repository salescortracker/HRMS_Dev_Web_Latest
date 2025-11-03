import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  users = [
    { role: 'HR', username: 'hr_user', password: 'Hr@123', route: '/dashboard' },
    { role: 'Manager', username: 'manager_user', password: 'Mg@123', route: '/dashboard' },
    { role: 'Admin', username: 'admin_user', password: 'Admin@123', route: '/admin/dashboard' },
     { role: 'SuperAdmin', username: 'superadmin_user', password: 'Superadmin@123', route: '/dashboard' },
    { role: 'Finance', username: 'finance_user', password: 'Fn@123', route: '/dashboard' },
    { role: 'Employee', username: 'emp_user', password: 'emp@123', route: '/dashboard' }
  ];

  constructor(private router: Router) {}

  login() {
    const user = this.users.find(u => u.username === this.username && u.password === this.password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user)); // store user info
      this.router.navigate([user.route]);
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
  
  
}

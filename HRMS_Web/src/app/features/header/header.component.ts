import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
 role: string = '';
 constructor(private router: Router) {}
  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.role = currentUser.role;
    sessionStorage.setItem('role', this.role);
  }
   logout() {
    // Optional: clear localStorage/sessionStorage or token
    localStorage.clear();
    this.router.navigate(['/login']); // Navigate to admin login
  }
}

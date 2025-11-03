import { Component } from '@angular/core';
import { ExpenseCategory } from '../../../layout/models/expense-category-type.model';
@Component({
  selector: 'app-expense-category',
  standalone: false,
  templateUrl: './expense-category.component.html',
  styleUrl: './expense-category.component.css'
})
export class ExpenseCategoryComponent {
 expense: ExpenseCategory = { CategoryName: '', IsActive: true };
  expenses: ExpenseCategory[] = [];
  isEditMode = false;
  searchText = '';

  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses() {
    // Sample data – replace with API call
    this.expenses = [
      { ExpenseCategoryID: 1, CategoryName: 'Travel', IsActive: true },
      { ExpenseCategoryID: 2, CategoryName: 'Food', IsActive: true },
      { ExpenseCategoryID: 3, CategoryName: 'Office Supplies', IsActive: false }
    ];
  }

  onSubmit() {
    if (this.isEditMode) {
      const index = this.expenses.findIndex(e => e.ExpenseCategoryID === this.expense.ExpenseCategoryID);
      if (index !== -1) this.expenses[index] = { ...this.expense };
    } else {
      const newId = this.expenses.length + 1;
      this.expenses.push({ ExpenseCategoryID: newId, ...this.expense });
    }
    this.resetForm();
  }

  editExpense(e: ExpenseCategory) {
    this.isEditMode = true;
    this.expense = { ...e };
  }

  deleteExpense(e: ExpenseCategory) {
    this.expenses = this.expenses.filter(x => x.ExpenseCategoryID !== e.ExpenseCategoryID);
  }

  resetForm() {
    this.expense = { CategoryName: '', IsActive: true };
    this.isEditMode = false;
  }

  // Filtering + Pagination
  filteredExpenses() {
    return this.expenses.filter(e =>
      e.CategoryName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  paginatedExpenses() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredExpenses().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.filteredExpenses().length / this.pageSize);
  }

  pagesArray() {
    return Array(this.totalPages()).fill(0).map((_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) this.currentPage = page;
  }
}

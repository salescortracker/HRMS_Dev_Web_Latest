import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDocumentsListComponent } from './employee-documents-list.component';

describe('EmployeeDocumentsListComponent', () => {
  let component: EmployeeDocumentsListComponent;
  let fixture: ComponentFixture<EmployeeDocumentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeDocumentsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeDocumentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDenunciasComponent } from './admin-denuncias.component';

describe('AdminDenunciasComponent', () => {
  let component: AdminDenunciasComponent;
  let fixture: ComponentFixture<AdminDenunciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDenunciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDenunciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

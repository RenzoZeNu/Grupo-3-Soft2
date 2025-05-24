import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DenunciaFormComponent } from './denuncia-form.component';

describe('DenunciaFormComponent', () => {
  let component: DenunciaFormComponent;
  let fixture: ComponentFixture<DenunciaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DenunciaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DenunciaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

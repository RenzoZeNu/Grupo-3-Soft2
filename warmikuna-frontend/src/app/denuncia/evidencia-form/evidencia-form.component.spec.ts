import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenciaFormComponent } from './evidencia-form.component';

describe('EvidenciaFormComponent', () => {
  let component: EvidenciaFormComponent;
  let fixture: ComponentFixture<EvidenciaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvidenciaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvidenciaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

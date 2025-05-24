import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisDenunciasComponent } from './mis-denuncias.component';

describe('MisDenunciasComponent', () => {
  let component: MisDenunciasComponent;
  let fixture: ComponentFixture<MisDenunciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisDenunciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisDenunciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

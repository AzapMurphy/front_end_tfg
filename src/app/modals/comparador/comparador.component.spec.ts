import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparadorComponent } from './comparador.component';

describe('ComparadorComponent', () => {
  let component: ComparadorComponent;
  let fixture: ComponentFixture<ComparadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

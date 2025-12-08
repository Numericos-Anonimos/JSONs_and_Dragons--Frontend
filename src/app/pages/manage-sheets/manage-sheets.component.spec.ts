import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSheetsComponent } from './manage-sheets.component';

describe('ManageSheetsComponent', () => {
  let component: ManageSheetsComponent;
  let fixture: ComponentFixture<ManageSheetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSheetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

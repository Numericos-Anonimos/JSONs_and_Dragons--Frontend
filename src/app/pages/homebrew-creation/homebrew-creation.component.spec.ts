import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomebrewCreationComponent } from './homebrew-creation.component';

describe('HomebrewCreationComponent', () => {
  let component: HomebrewCreationComponent;
  let fixture: ComponentFixture<HomebrewCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomebrewCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomebrewCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

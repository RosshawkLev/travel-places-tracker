import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceDetailsPage } from './place-details-page.component';

describe('PlaceDetailsPage', () => {
  let component: PlaceDetailsPage;
  let fixture: ComponentFixture<PlaceDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceDetailsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceDetailsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

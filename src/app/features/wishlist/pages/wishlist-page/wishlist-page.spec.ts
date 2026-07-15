import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistPageComponent } from './wishlist-page.component';

describe('WishlistPageComponent', () => {
  let component: WishlistPageComponent;
  let fixture: ComponentFixture<WishlistPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishlistPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WishlistPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

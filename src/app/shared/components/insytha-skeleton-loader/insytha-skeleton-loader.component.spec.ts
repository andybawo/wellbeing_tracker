import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsythaSkeletonLoaderComponent } from './insytha-skeleton-loader.component';

describe('InsythaSkeletonLoaderComponent', () => {
  let component: InsythaSkeletonLoaderComponent;
  let fixture: ComponentFixture<InsythaSkeletonLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsythaSkeletonLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsythaSkeletonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

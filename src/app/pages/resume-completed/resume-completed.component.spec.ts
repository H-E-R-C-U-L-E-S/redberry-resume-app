import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeCompletedComponent } from './resume-completed.component';

describe('ResumeCompletedComponent', () => {
  let component: ResumeCompletedComponent;
  let fixture: ComponentFixture<ResumeCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumeCompletedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

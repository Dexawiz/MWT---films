import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupEditChild } from './group-edit-child';

describe('GroupEditChild', () => {
  let component: GroupEditChild;
  let fixture: ComponentFixture<GroupEditChild>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupEditChild]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupEditChild);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

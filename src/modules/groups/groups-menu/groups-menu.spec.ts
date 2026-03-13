import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsMenu } from './groups-menu';

describe('GroupsMenu', () => {
  let component: GroupsMenu;
  let fixture: ComponentFixture<GroupsMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupsMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupsMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

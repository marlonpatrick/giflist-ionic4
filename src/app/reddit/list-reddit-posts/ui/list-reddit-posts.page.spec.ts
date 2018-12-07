import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRedditPostsPage } from './list-reddit-posts.page';

describe('ListRedditPostsPage', () => {
  let component: ListRedditPostsPage;
  let fixture: ComponentFixture<ListRedditPostsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRedditPostsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRedditPostsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AspirantesPage } from './historial.page';

describe('AspirantesPage', () => {
  let component: AspirantesPage;
  let fixture: ComponentFixture<AspirantesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AspirantesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MantenimientoFaltasPage } from './mantenimiento-faltas.page';

describe('MantenimientoFaltasPage', () => {
  let component: MantenimientoFaltasPage;
  let fixture: ComponentFixture<MantenimientoFaltasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoFaltasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

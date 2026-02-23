import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MantenimientoFaltasPage } from './mantenimiento-faltas.page';

const routes: Routes = [
  {
    path: '',
    component: MantenimientoFaltasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MantenimientoFaltasPageRoutingModule {}

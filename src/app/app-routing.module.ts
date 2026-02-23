import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'principal',
    loadChildren: () => import('./pages/principal/principal.module').then( m => m.PrincipalPageModule)
  },
  {
    path: 'aspirantes',
    loadChildren: () => import('./pages/aspirantes/aspirantes.module').then( m => m.AspirantesPageModule)
  },
  {
    path: 'aspirantes',
    loadChildren: () => import('./pages/aspirantes/aspirantes.module').then( m => m.AspirantesPageModule)
  },
  {
    path: 'sanciones',
    loadChildren: () => import('./pages/sanciones/sanciones.module').then( m => m.SancionesPageModule)
  },
  {
    path: 'historial',
    loadChildren: () => import('./pages/historial/historial.module').then( m => m.HistorialPageModule)
  },
  {
    path: 'mantenimiento-faltas',
    loadChildren: () => import('./pages/mantenimiento-faltas/mantenimiento-faltas.module').then( m => m.MantenimientoFaltasPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  { path: 'configure', loadChildren: './lamps/configure/configure.module#ConfigurePageModule' },
  { path: 'lamp/:mac', loadChildren: './lamps/lamp/lamp.module#LampPageModule' },
  { path: 'discover', loadChildren: './discover/discover.module#DiscoverPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

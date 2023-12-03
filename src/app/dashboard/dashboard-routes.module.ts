import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { dashBoardRoutes } from './dashboard.routes';
import { RouterModule, Routes } from '@angular/router';

const rutasHijas: Routes = [{
  path: '',
  component: DashboardComponent,
  children: dashBoardRoutes,
  // canActivate: [authGuard], se comenta porque se debe añadir al guardian que no debe tampoco cargar el modulo usando el lazy
}];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(rutasHijas)
  ],
  exports:[
    RouterModule
  ]
})
export class DashboardRoutesModule {}

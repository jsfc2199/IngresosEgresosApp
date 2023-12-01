import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription, filter } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubscription: Subscription = new Subscription()
  ingresoEgresoSubscription: Subscription = new Subscription()

  constructor(private store: Store<AppState>, private ingresosEgresosService: IngresoEgresoService){}

  ngOnInit(): void {
    this.userSubscription = this.store.select('user').pipe(
      filter(auth => auth.user != null)
    ).subscribe(({user}) => {
      this.ingresoEgresoSubscription = this.ingresosEgresosService.initIngresosEgressosListener(user!.uid).subscribe(ingresosEgresos => {
        this.store.dispatch(ingresoEgresoActions.setItems({items:ingresosEgresos}))
      })
    })
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe()
    this.ingresoEgresoSubscription.unsubscribe()
  }

}

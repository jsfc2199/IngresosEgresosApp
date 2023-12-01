import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription, filter } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubscription: Subscription = new Subscription()

  constructor(private store: Store<AppState>, private ingresosEgresosService: IngresoEgresoService){}

  ngOnInit(): void {
    this.userSubscription = this.store.select('user').pipe(
      filter(auth => auth.user != null)
    ).subscribe(({user}) => {
      this.ingresosEgresosService.initIngresosEgressosListener(user!.uid)
    })
  }
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe()
  }

}

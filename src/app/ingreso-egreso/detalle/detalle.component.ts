import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
})
export class DetalleComponent implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>) {}

  ingresoEgresoItemsSubs: Subscription = new Subscription();
  ingresosEgresosItems: IngresoEgreso[] = [];

  ngOnInit(): void {
    this.ingresoEgresoItemsSubs = this.store
      .select('ingresosEgresos')
      .subscribe(({ items }) => {
        this.ingresosEgresosItems = items;
      });
  }

  borrar(uid: string) {
    console.log(uid);
  }

  ngOnDestroy(): void {
    this.ingresoEgresoItemsSubs.unsubscribe();
  }
}

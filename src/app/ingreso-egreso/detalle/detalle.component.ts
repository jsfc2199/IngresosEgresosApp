import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';

interface itemWithUid {
  descripcion:string,
  monto:number,
  tipo:string,
  uid:string
}
@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
})
export class DetalleComponent implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>, private ingresoEgresoService: IngresoEgresoService) {}

  ingresoEgresoItemsSubs: Subscription = new Subscription();
  ingresosEgresosItems: IngresoEgreso[] = [];

  ngOnInit(): void {
    this.ingresoEgresoItemsSubs = this.store
      .select('ingresosEgresos')
      .subscribe(({ items }) => {
        this.ingresosEgresosItems = items;
      });
  }

  borrar(uid: string | undefined) {
    this.ingresoEgresoService.borrarIngresoEgreso(uid!).then(()=>{
      Swal.fire({
        icon: 'success',
        title: 'Item eliminado',
        text: `Item eliminado: ${uid}`,
        footer: 'Success'
      });
    }).catch(error => {
      Swal.fire({
        icon: 'error',
        title: error.name,
        text: error.message,
        footer: error.code
      });
    })
  }

  ngOnDestroy(): void {
    this.ingresoEgresoItemsSubs.unsubscribe();
  }
}

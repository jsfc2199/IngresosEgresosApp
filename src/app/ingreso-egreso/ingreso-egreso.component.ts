import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import * as ui from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoEgresoForm: FormGroup = new FormGroup('');
  tipoMovimiento: string = 'ingreso';
  cargando: boolean = false;
  cargandoSubscripcion: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private ingresoEresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.cargandoSubscripcion = this.store.select('ui').subscribe((ui) => {
      this.cargando = ui.isLoading;
    });

    this.ingresoEgresoForm = this.formBuilder.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });
  }

  guardar() {
    if (this.ingresoEgresoForm.invalid) return;

    this.store.dispatch(ui.isLoading())

    const { descripcion, monto } = this.ingresoEgresoForm.value;

    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipoMovimiento);

    this.ingresoEresoService.crearIngresoEgreso(ingresoEgreso).then(() => {
        this.ingresoEgresoForm.reset();
        this.store.dispatch(ui.stopLoading())
        Swal.fire('Registro creado', descripcion, 'success');
      })
      .catch((e) => {
        this.store.dispatch(ui.stopLoading())
        Swal.fire('Hubo un error registrando la data', e.message, 'error');
      });
  }

  ngOnDestroy(): void {
    this.cargandoSubscripcion.unsubscribe();
  }
}

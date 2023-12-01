import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
})
export class IngresoEgresoComponent implements OnInit{

  ingresoEgresoForm: FormGroup = new FormGroup('')
  tipoMovimiento: string = 'ingreso'

  constructor(private formBuilder: FormBuilder, private ingresoEresoService: IngresoEgresoService){}

  ngOnInit(): void {
    this.ingresoEgresoForm = this.formBuilder.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required]
    })
  }

  guardar(){
    if(this.ingresoEgresoForm.invalid) return

    const {descripcion, monto} = this.ingresoEgresoForm.value

    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipoMovimiento)
    this.ingresoEresoService.crearIngresoEgreso(ingresoEgreso).then(()=> {
      this.ingresoEgresoForm.reset()
      Swal.fire('Registro creado', descripcion, 'success')
    }).catch(e => {
      Swal.fire('Hubo un error registrando la data', e.message, 'error')
    })

  }
}

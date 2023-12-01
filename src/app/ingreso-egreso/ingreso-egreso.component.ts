import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
})
export class IngresoEgresoComponent implements OnInit{

  ingresoEgresoForm: FormGroup = new FormGroup('')
  tipoMovimiento: string = 'ingreso'

  constructor(private formBuilder: FormBuilder){}

  ngOnInit(): void {
    this.ingresoEgresoForm = this.formBuilder.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required]
    })
  }

  guardar(){
    if(this.ingresoEgresoForm.invalid) return
  }
}

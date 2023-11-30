import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import * as ui from 'src/app/shared/ui.actions';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit, OnDestroy {
  registroForm!: FormGroup;
  cargando: boolean = false;
  subscription: Subscription = new Subscription()

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.registroForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.subscription = this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading)
  }

  crearUsuario() {
    if (this.registroForm.invalid) return;

    this.store.dispatch(ui.isLoading())

    const { nombre, correo, password } = this.registroForm.value;
    this.authService
      .crearUsuario(nombre, correo, password)
      .then((credencales) => {
        console.log('credenciales', credencales);

        this.store.dispatch(ui.stopLoading())

        // Swal.close()
        this.router.navigate(['/'])
      })
      .catch((err) => {

        this.store.dispatch(ui.stopLoading())

        Swal.fire({
        title: 'Oops!',
        text: err.message,
        icon: 'error'
      })
    });
  }

  ngOnDestroy() {
      this.subscription.unsubscribe()
  }
}

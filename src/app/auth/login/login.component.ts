import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import * as ui from 'src/app/shared/ui.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  cargando:boolean = false
  subcription: Subscription = new Subscription()

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.subcription = this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading)
  }

  iniciarSesion() {
    if (this.loginForm.invalid) return;

    //dispatch
    this.store.dispatch(ui.isLoading()) //se cambia el estado a true

    const { correo, password } = this.loginForm.value;
    this.authService
      .loginUsuario(correo, password)
      .then((credenciales) => {
        console.log(credenciales);
        // Swal.close()
        this.store.dispatch(ui.stopLoading()) //se cambia el estado a false
        this.router.navigate(['/']);
      })
      .catch((err) =>{
        this.store.dispatch(ui.stopLoading()) //se cambia el estado a false
        Swal.fire({
          title: 'Oops!',
          text: err.message,
          icon: 'error',
        })}
      );
  }

  ngOnDestroy(){
    this.subcription.unsubscribe()
  }
}

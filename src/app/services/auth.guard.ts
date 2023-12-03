import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { tap, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  return inject(AuthService)
    .isAuth()
    .pipe(
      //para es para disparar un efecto secundario
      tap((estado) => {
        if (!estado) router.navigate(['/login']);
      })
    );
};

export const authMatch: CanMatchFn = (route, state) => {
  const router = inject(Router);

  return inject(AuthService)
    .isAuth()
    .pipe(
      //para es para disparar un efecto secundario
      tap((estado) => {     
        if (!estado) router.navigate(['/login']);
      }),
      take(1),//cada que ingreso al modulo me suscribo a esto pero con el take 1 a su vez cancelo la suscripción
    );
};

import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

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

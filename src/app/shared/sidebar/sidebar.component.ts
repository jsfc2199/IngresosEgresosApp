import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, filter } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit, OnDestroy{
  constructor(private authService: AuthService, private router: Router, private store: Store<AppState>){}


  userSubscription: Subscription = new Subscription();
  activeUserName: string= ''

  ngOnInit(): void {
    this.userSubscription = this.store.select('user').pipe(filter(({user})=> user != null)).subscribe(user => {
      this.activeUserName = user.user!.nombre
    })
  }

  onLogout(){
    this.authService.logout().then( () =>{
      this.router.navigate(['/login'])
    })

  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}

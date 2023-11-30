import { Injectable } from '@angular/core';
import {
  Auth,
  Unsubscribe,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { Subscription, map } from 'rxjs';
import { Usuario, UsuarioDataFirebase } from '../models/usuario.model';
import { Firestore, getDoc, onSnapshot } from '@angular/fire/firestore';
import { collection, doc, setDoc } from '@firebase/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as auth from '../auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private store: Store<AppState>
  ) {}

  userSubscription!: Unsubscribe;

  //nos avisa cuando haya cambios en el estado del usuario
  initAuthListener() {
    authState(this.auth).subscribe(async (user) => {
      if (user) {
        //se usa onSnapshot para que llegado el caso que se actualice la información desde la base de datos directamente se actualice inmediatamente en la app
        //este metodo recibe dos argumentos, el path donde esta nuestro documento y un callback que tendrá la información que queremos

        this.userSubscription = onSnapshot(
          //acceder al documento de firebase pasando como argumento la base de datos y el path del documento
          doc(this.firestore, `${user.uid}/user`),

          //docData es la promesa que nos devuelve en el callback con la información perse del usuario
          (docData) => {
            //Como docData es de tipo DocumentSnapshot se puede obtener la información de esta usando el método .data()
            const docUserData = docData.data() as UsuarioDataFirebase;

            //se setea el usuario para pasarlo al dispatch
            const newUser = Usuario.fromFirebase(docUserData);

            //dispatch dela accion que setea el usuario
            this.store.dispatch(auth.setUser({ user: newUser }));
          }
        );
      } else {
        //Aquí se cancela la suscripción al onSnapshot
        //Se hace de esta forma porque el onSnapshot retorna una function que puede ser llamada para cancelar la suscripcion tal como indica la documentación
        //@returns
        //An unsubscribe function that can be called to cancel the snapshot listener.
        
        //Por lo anterior estamos preguntando si en la suscripción hay data, y si la hay ejecute la desuscripción a partir del retorno de la misma
        //Por ello se ejecuta this.userSubscription() como si fuera un método
        this.userSubscription ? this.userSubscription() : null
        this.store.dispatch(auth.unsetUser());
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password).then(
      ({ user }) => {
        const newUser = new Usuario(user.uid, nombre, user.email!);

        // Teniendo una referencia a la coleccion de usuarios por id
        const coleccionUsuarios = collection(this.firestore, `${user.uid}`);

        // se crea referencia al documento con nombre usuarios
        const documentRef = doc(coleccionUsuarios, 'user');

        setDoc(documentRef, { ...newUser }); //se debe enviar el objeto y no como instancia del objeto
      }
    );
  }

  loginUsuario(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  isAuth() {
    return authState(this.auth).pipe(
      map((firebaseUser) => firebaseUser != null)
    );
  }
}

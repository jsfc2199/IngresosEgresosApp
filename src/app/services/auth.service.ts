import { Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Firestore  } from '@angular/fire/firestore';
import { collection, doc, setDoc } from '@firebase/firestore';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  //nos avisa cuando haya cambios en el estado del usuario
  initAuthListener(){
    authState(this.auth).subscribe(user=>{
      console.log(user?.uid);
      console.log(user?.email);
    })
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
    .then(({user}) => {
      const newUser = new Usuario(user.uid, nombre, user.email!)

      // Teniendo una referencia a la coleccion de usuarios por id
      const coleccionUsuarios = collection(this.firestore, `${user.uid}`);

      // se crea referencia al documento con nombre usuarios
      const documentRef = doc(coleccionUsuarios, 'user');

      setDoc(documentRef, {...newUser}); //se debe enviar el objeto y no como instancia del objeto


    });
  }

  loginUsuario(email:string, password:string){
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  logout(){
    return signOut(this.auth)
  }

  isAuth(){
    return authState(this.auth).pipe(
      map(firebaseUser => firebaseUser != null)
    )
  }
}

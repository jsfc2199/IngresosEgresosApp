import { Injectable, OnDestroy } from '@angular/core';
import { Firestore, collection, collectionSnapshots, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { Subscription, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {


  constructor(
    private firestore: Firestore,
    private authService: AuthService
    ) { }


  crearIngresoEgreso(ingresoEgreso: IngresoEgreso){
    const uid = this.authService.user?.uid

    /*
    Esta insercion se diferencia de la del auth service
    En el auth serivce creabamos a partir del id la colección, para luego añador un documento a esta
    Es decir idColeccion/user donde idColeccion es la colección y user es el documento

    Aquí lo que queremos hacer es difente, queremos crear un documento ingreso-egreso, y a este añadirle una colección
    es decir idColeccion/ingreso-egreso/items donde idColeccion es la colección y ingreso-egreso es el documento e items es la colección
    final a la que añadiremos el nuevo documento

    Se deja comentada la forma larga para entender el pasó a pasó de lo ocurrido

    // Teniendo una referencia a la coleccion de usuarios por id
    const colectionIngresoEgreso = collection(this.firestore, `${uid}`);

    // se crea referencia al documento, es decir dentro del mismo uid quiero adicional el documento ingreso-egreso
    const documentRef = doc(colectionIngresoEgreso, 'ingreso-egreso');

    //se crea la coleccion items dentro del documento ingreso-egreso
    const coleccionItems = collection(documentRef, 'items');

    //se crean los documentos pero no se asinan por un nombre sino por un id genérico de firebase
    const docItems = doc(coleccionItems);

    setDoc(docItems, {...ingresoEgreso}).then(()=> console.log('documento insertado con exito', documentRef.id))
    */

    //Forma corta
    //Como sabemos que items es una colección que queremos tener en el documento ingreso-egreso, asignamos el path directamante
    const collectionIngresoEgreso = collection(this.firestore, `${uid}/ingreso-egreso/items`);

    //se crean los documentos dentro de la coleccion items pero no se asinan por un nombre sino por un id genérico de firebase
    const documentRef = doc(collectionIngresoEgreso);

    //se setea el documento a la coleccion definida por id generico
    //Nota Importante:
    /*
    Como comentamos el uid del modelo no es necesario pasarlo explicitamente, es decir, si fuera parte del modelo, debemos enviar { ...ingresoEgreso, uid }, es decir
    setDoc(documentRef, { ...ingresoEgreso, uid })

    No es necesario hacer un then para setDoc porque este devuelve un Promise<void>, en caso de requerir informacion se puede hacer de la siguiente manera
    setDoc(documentRef, { ...ingresoEgreso }).then(()=> console.log('documento insertado con exito', documentRef))
    */

    delete ingresoEgreso.uid

    return setDoc(documentRef, { ...ingresoEgreso })

  }

  initIngresosEgressosListener(uid: string){
    /*
    tal como se hizo con el usuario con el onSnapshot para escuchar los cambios si se hacen directos en la base de datos, el collectionSnapshosts nos permite hacer lo mismo
    pero ya para una colección, este retorna un observable al cual podemos suscribirnos
    collectionSnapshots recibe como argumento la ubicación de la coleccion en firebase

    Dado que es un observable ya a este podemos usar los operadores de rxjs. Usamos el pipe para pasar la información por el flujo que requeeramos

    Primero se usa el map para obtener como tal la coleccion items en firebase.
    Una vez tengamos la coleccion podemos mapear esta información, es decir, mapearemos los documentos dentro de items

    Dado que por cada documento dentro de items podemos conocer todos sus datos podemos simplemente retornar un objeto como queramos, en este caso uno con el uid del documento
    dentro de firebase y aparte la data del documento como dal es decir el monto, la descipcion y el tipo
    */
    return collectionSnapshots(collection(this.firestore, `${uid}/ingreso-egreso/items`))
    .pipe(
      map(collectionItems => {
          return collectionItems.map(documentoItem => {

            const documentData = documentoItem.data() as itemsData

            return {
              uid: documentoItem.id,
              ...documentData
            }

          })
        }))
  }

  borrarIngresoEgreso(uid: string){
    const userUid = this.authService.user?.uid

    //nos ubicamos en el documento relacionado a cada item
    const itemDoc = doc(this.firestore, `${userUid}/ingreso-egreso/items/${uid}`)

    //usamos el deleteDoc para borrar el documento que queremos
    return deleteDoc(itemDoc)
  }
}

interface itemsData {
  descripcion: string;
  monto: number;
  tipo: string;
}

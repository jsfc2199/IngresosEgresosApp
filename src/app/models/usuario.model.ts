export class Usuario {

  static fromFirebase(data: UsuarioDataFirebase){
    return new Usuario(data.uid, data.nombre, data.email)
  }

  constructor(
    public uid: string,
    public nombre: string,
    public email: string
  ) {}

}

export interface UsuarioDataFirebase{
  nombre: string;
  email: string;
  uid: string;
}

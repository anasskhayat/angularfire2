import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { mensaje } from "../interface/mensaje.interface";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<mensaje>;

  public chats: mensaje[]=[];
  public usuario: any={};



  constructor(private afs: AngularFirestore,
                public afAuth: AngularFireAuth) {

this.afAuth.authState.subscribe(user=>{
  console.log("el estado del usuario : ",user)
  if(!user){
    return;
  }
  
  this.usuario.nombre=user.displayName;
  this.usuario.uid=user.uid;
})


                 }
  
  login(proveedor: string) {
    if(proveedor === 'google'){
      this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }else{
      this.afAuth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider());

    }
  }
  logout() {
    this.usuario={};
    this.afAuth.auth.signOut();
  }

  cargarMensajes(){
    this.itemsCollection = this.afs.collection<mensaje>('chats',
                                                        ref=>ref.orderBy('fecha','desc')
                                                        .limit(10));
    return this.itemsCollection.valueChanges()
                               .map( (mensajes:mensaje[])=>{
                                console.log(mensajes);
                                
                                this.chats=[];
                                
                                for(let mens of mensajes){
                                  this.chats.unshift(mens);
                                }
                                   return this.chats;
                               })
  }

  agregarMensajes(text:string){

    let sms:mensaje={
      nombre:this.usuario.nombre,
      mensaje: text,
      fecha:new Date().getTime(),  
      uid: this.usuario.uid
    }

   return this.itemsCollection.add(sms);

  }
}

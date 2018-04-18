import { Component, OnInit } from '@angular/core';

import { ChatService } from "../../providers/chat.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})
export class ChatComponent implements OnInit {

  mensaje: string = "";
  elements: any;

  constructor(public _cs: ChatService) {

    this._cs.cargarMensajes()
      .subscribe( ()=>{
        setTimeout(() => {
           this.elements.scrollTop = this.elements.scrollHeight;
        }, 200);
       
      });
  }
  ngOnInit() {
    this.elements = document.getElementById('app-mensajes')
  }

  enviar_mensaje() {

    console.log(this.mensaje);

    if (this.mensaje.length === 0) {
      return;
    }

    this._cs.agregarMensajes( this.mensaje )
      .then( ()=> this.mensaje = "")
      .catch( (err)=> console.error("error en  enviado", err));
  }

}

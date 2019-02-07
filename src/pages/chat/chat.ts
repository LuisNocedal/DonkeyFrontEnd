import { Component, ViewChild } from '@angular/core';
import { IonicPage, 
  NavController, 
  NavParams,
  Content,
  AlertController,
  LoadingController,
  Events } from 'ionic-angular';
import { ChatService } from './chat.service';
import { Alerts } from '../../app/alerts';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';

//@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  providers: [ ChatService ]
})
export class ChatPage {

  @ViewChild(Content) content: Content

  amigo;

  mensajes;
  chat;

  mensaje;

  datosCargados = false;

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  private _chatService: ChatService,
  public alertCtrl: AlertController,
  public loadingCtrl: LoadingController,
  public alerts: Alerts,
  private socket: Socket,
  public events: Events) {

    console.log(navParams.data.amigo);
    this.amigo = navParams.data.amigo;
    this.cargarMensajes();

    this.events.unsubscribe('nuevo-mensaje');
    this.events.subscribe('nuevo-mensaje',(datos)=>{
      if(datos.idChat != this.chat.idChat){
        return;
      }
      this.cargarMensajes(false);
    })
  }

  cargarMensajes(mostrarLoader = true){

    var datos = {
      token: localStorage.getItem('token'),
      idAmigo: this.amigo.idUsuarioDonkey
    }

    let loader = this.loadingCtrl.create({
      content: "Cargando :)...",
    });
    if(mostrarLoader){
      loader.present();
    }

    this._chatService.cargarMensajes(datos).subscribe(result =>{
      loader.dismiss();
      if(result.sesion){
        this.datosCargados = true;
        this.mensajes = result.chat.mensajes;
        this.chat = result.chat.chat;
        setTimeout(()=>{
          console.log(this.content._scroll);
          if(this.content._scroll){
            this.content.scrollToBottom(0);
          }
        },100);
      }else{
        this.alerts.alertNoSesion();
      }
    },error =>{
      console.log(error);
      loader.dismiss();
      this.alerts.lanzarAlert(error);
    })

  }

  enviarMensaje(){

    var datos = {
      token: localStorage.getItem('token'),
      mensaje: this.mensaje,
      idAmigo: this.amigo.idUsuarioDonkey
    }

    let loader = this.loadingCtrl.create({
      content: "Cargando :)...",
    });
    loader.present();

    var datosMensaje = {
      idAmigo: this.amigo.idUsuarioDonkey,
      idChat: this.chat.idChat
    }

    this._chatService.enviarMensaje(datos).subscribe(result =>{
      loader.dismiss();
      if(result.sesion){
        this.socket.emit('enviar-mensaje',datosMensaje);
        this.mensaje = null;
        this.mensajes = result.chat.mensajes
        setTimeout(()=>{
          if(this.content){
            this.content.scrollToBottom(0);
          }
        },100);
      }else{
        this.alerts.alertNoSesion();
      }
    },error =>{
      console.log(error);
      loader.dismiss();
      this.alerts.lanzarAlert(error);
    })

  }

  ionViewCanLeave() {
    this.events.unsubscribe('nuevo-mensaje');
    console.log('Saliendo');
    //console.log('ionViewDidLoad ChatPage');
  }

}

import { Component } from '@angular/core';
import { IonicPage, 
  NavController, 
  NavParams,
  AlertController,
  LoadingController,
  Events  } from 'ionic-angular';
import { AmigosService } from './amigos.service';
import { Alerts } from '../../app/alerts';
import { Socket } from 'ng-socket-io';
import { ChatPage } from '../chat/chat';
import { Observable } from 'rxjs/Observable';

//@IonicPage()
@Component({
  selector: 'page-amigos',
  templateUrl: 'amigos.html',
  providers: [ AmigosService ]
})
export class AmigosPage {

  usuarios;

  seccion = 'amigos';

  solicitudes;
  amigos;

  datosCargados = false;

  resolucion;

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  private _amigosService: AmigosService,
  public alertCtrl: AlertController,
  public loadingCtrl: LoadingController,
  public alerts: Alerts,
  private socket: Socket,
  private events: Events) {

    this.resolucion = screen.width;
    console.log(this.resolucion);
    window.onresize = (event) => {
      this.resolucion = screen.width;
      console.log(this.resolucion);
    };

    this.events.unsubscribe('invitacionAmistad');
    this.events.subscribe('invitacionAmistad',()=>{
      this.cargarDatosIniciales(false);
    })

  }

  ionViewDidEnter() {
    this.events.unsubscribe('nuevo-mensaje');
    this.events.subscribe('nuevo-mensaje',(datos)=>{
      console.log(datos);
      this.cargarDatosIniciales(false);
    })
    this.cargarDatosIniciales();
  }

  ionViewWillUnload() {
  }

  cargarDatosIniciales(mostrarLoader = true){

    var datos = {
      token: localStorage.getItem('token')
    }

    let loader = this.loadingCtrl.create({
      content: "Cargando :)...",
    });
    if(mostrarLoader){
      loader.present();
    }

    this._amigosService.cargarDatosIniciales(datos).subscribe(result =>{
      if(result.sesion){
        loader.dismiss();
        this.datosCargados = true;
        this.solicitudes = result.solicitudes;
        this.amigos = result.amigos;
      }else{
        this.alerts.alertNoSesion();
      }
    },error=>{
      console.log(error);
      loader.dismiss();
      this.alerts.lanzarAlert(error);
    })

  }

  buscarUsuario(e){
    console.log(e.target.value);

    var datos = {
      token: localStorage.getItem('token'),
      busqueda: e.target.value
    }

    this._amigosService.buscarUsuario(datos).subscribe(result=>{

      if(result.sesion){
        this.usuarios = result.usuarios;
      }else{
        this.alerts.alertNoSesion();
      }

    },error=>{
      console.log(error);
      this.alerts.lanzarAlert(error);
    })
  }

  solicitudAmistad(idUsuario,cancelada = false){

    var datos = {
      token: localStorage.getItem('token'),
      idUsuario: idUsuario,
      cancelada: cancelada
    }

    let loader = this.loadingCtrl.create({
      content: "Cargando :)...",
    });
    loader.present();

    this._amigosService.solicitudAmistad(datos).subscribe(result =>{
      loader.dismiss();
      if(result.sesion){
        let alert = this.alertCtrl.create({
          title: 'Solicitud',
          subTitle: result.mensaje,
          buttons: ['Aceptar']
        });
        alert.present();
        for (let i = 0; i < this.usuarios.length; i++) {
          if(this.usuarios[i].idUsuarioDonkey == idUsuario){
            this.usuarios[i].pendiente = (cancelada)?0:1;
            console.log(this.usuarios[i]); 
          }        
        }
        if(!cancelada){
          this.socket.emit('enviar-invitacion-amistad',{
            idUsuario: idUsuario
          });
        }
      }else{
        this.alerts.alertNoSesion();
      }
    },error =>{
      console.log(error);
      loader.dismiss();
      this.alerts.lanzarAlert(error);
    })

  }

  responderSolicitud(idSolicitud,respuesta){

    var datos = {
      token: localStorage.getItem('token'),
      idSolicitud: idSolicitud,
      respuesta: respuesta
    }

    let loader = this.loadingCtrl.create({
      content: "Cargando :)...",
    });
    loader.present();

    this._amigosService.responderSolicitud(datos).subscribe(result =>{
      loader.dismiss();
      if(result.sesion){
        this.solicitudes = result.solicitudes;
        this.amigos = result.amigos;
      }else{
        this.alerts.alertNoSesion();
      }
    },error =>{
      console.log(error);
      loader.dismiss();
      this.alerts.lanzarAlert(error);
    })

  }

  irChat(amigo){
    this.navCtrl.push(ChatPage,{amigo});
  }

}

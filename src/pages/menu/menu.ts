import { Component } from '@angular/core';
import { IonicPage, 
  NavController, 
  NavParams, 
  LoadingController, 
  AlertController,
  Events,
  PopoverController, 
  Config} from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { Configuraciones } from '../../app/config';

import { InicioPage } from '../inicio/inicio';
import { MenuService } from './menu.service';
import { LoginPage } from '../login/login';
import { MarcadoresPage } from '../marcadores/marcadores';
import { Alerts } from '../../app/alerts';
import { CuentaPage } from '../cuenta/cuenta';
import { AmigosPage } from '../amigos/amigos';
import { InicioPvpPage } from '../inicio-pvp/inicio-pvp';
import { InvitacionPvpPage } from '../invitacion-pvp/invitacion-pvp';
import { PartidaPvpPage } from '../partida-pvp/partida-pvp';
import { LocalNotifications } from '@ionic-native/local-notifications';

//@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
  providers: [ MenuService, LocalNotifications ]
})
export class MenuPage {

  avatar;
  usuario;

  rootPage:any = InicioPage;

  popoverInvitacion;

  version = "";

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  private _menuService: MenuService,
  public alerts: Alerts,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public events: Events,
  private socket: Socket,
  public popoverCtrl: PopoverController,
  private localNotifications: LocalNotifications,
  private config: Configuraciones) {
    
    this.version = config.version;

    this.socket.connect();

    events.unsubscribe('recargarDatosUsuario');

    events.subscribe('recargarDatosUsuario',()=>{
      this.cargarDatosUsuario();
    })

    events.unsubscribe('salir');

    events.subscribe('salir',()=>{
      this.salir();
    })

    this.cargarDatosUsuario();
    this.eventos().subscribe(event=>{})
  }

  eventos(){
    let observable = new Observable(observer => {
      this.socket.on('recibir-invitacion-pvp', (datos) => {
        if(datos.idUsuarioRetado != localStorage.getItem('idUsuario')){
          return;
        }
        this.localNotifications.schedule({
          id: 1,
          text: datos.mensaje
        });        
        this.invitacionPartida(datos);
        observer.next(datos);
      });
  
      this.socket.on('iniciar-partida-pvp', (datos) => {
        console.log(datos);
        if(datos.idUsuarioRetador != localStorage.getItem('idUsuario')
        && datos.idUsuarioRetado != localStorage.getItem('idUsuario')){
          return;
        }
        this.navCtrl.setRoot(PartidaPvpPage,{datosPartida:datos});
        observer.next(datos);
      });

      this.socket.on('recibir-invitacion-amistad', datos => {
        if(datos.idUsuario != localStorage.getItem('idUsuario')){
          return;
        }
        this.localNotifications.schedule({
          id: 1,
          text: 'Tienes una nueva solicitud de amistad :D'
        });
        this.events.publish('invitacionAmistad');
      });

      this.socket.on('nuevo-mensaje', datos =>{
        console.log(datos);
        if(datos.idAmigo != localStorage.getItem('idUsuario')){
          return;
        }
        this.events.publish('nuevo-mensaje',datos);
      })
    })

    return observable;
  }

  cargarDatosUsuario(){

    var datos = {
      token: localStorage.getItem('token')
    }

    let loader = this.loadingCtrl.create({
      content: "Cargando :)...",
    });
    //loader.present();

    this._menuService.datosUsuario(datos).subscribe(result =>{

      loader.dismiss();

      if(result.sesion){
        this.avatar = result.datosUsuario.avatar;
        this.usuario = result.datosUsuario.usuario;
      }else{
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'La sesión está abierta en otro dispositivo.',
          buttons: ['Aceptar']
        });
        alert.present();
        this.salir();
      }

    },error => {
      console.log(error);
      loader.dismiss();
      this.alerts.lanzarAlert(error);
    });

  }

  invitacionPartida(datos){
    if(this.popoverInvitacion){
      this.popoverInvitacion.dismiss();
    }
    this.popoverInvitacion = this.popoverCtrl.create(InvitacionPvpPage,{datosInvitacion:datos},{
      cssClass: 'invitacion'
    });
    let ev = {
      target : {
        getBoundingClientRect : () => {
          return {
            top: '0'
          };
        }
      }
    };
    this.popoverInvitacion.present({ev});
  }

  inicio(){
    this.rootPage = InicioPage;
  }

  inicioPvp(){
    this.rootPage = InicioPvpPage;
  }

  amigos(){
    this.rootPage = AmigosPage;
  }

  marcadores(){
    this.rootPage = MarcadoresPage;
  }
  
  cuenta(){
    this.rootPage = CuentaPage;
  }

  salir(){
    this.socket.removeAllListeners();
    this.socket.disconnect();
    localStorage.clear();
    this.navCtrl.setRoot(LoginPage);
  }

  ionViewDidLoad() {
  }

}

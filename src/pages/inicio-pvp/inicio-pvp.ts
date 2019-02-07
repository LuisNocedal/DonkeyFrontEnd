import { Component } from '@angular/core';
import { IonicPage, 
  NavController, 
  NavParams,
  AlertController,
  LoadingController } from 'ionic-angular';
import { InicioPvpService } from './inicio-pvp.service';
import { Alerts } from '../../app/alerts';
import { Socket } from 'ng-socket-io';

//@IonicPage()
@Component({
  selector: 'page-inicio-pvp',
  templateUrl: 'inicio-pvp.html',
  providers: [ InicioPvpService ]
})
export class InicioPvpPage {

  amigos;
  datosUsuario;

  resolucion;

  datosCargados = false;

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  private _inicioPvpService: InicioPvpService,
  public alertCtrl: AlertController,
  public loadingCtrl: LoadingController,
  public alerts: Alerts,
  private socket: Socket) {

    this.resolucion = screen.width;
    console.log(this.resolucion);
    window.onresize = (event) => {
      this.resolucion = screen.width;
      console.log(this.resolucion);
    };

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad InicioPvpPage');
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(){

    var datos = {
      token: localStorage.getItem('token')
    }

    let loader = this.loadingCtrl.create({
      content: "Cargando :)...",
    });
    loader.present();

    this._inicioPvpService.datosIniciales(datos).subscribe(result =>{
      loader.dismiss();
      if(result.sesion){
        this.datosCargados = true;
        this.amigos = result.amigos;
        this.datosUsuario = result.datosUsuario;
      }else{
        this.alerts.alertNoSesion();
      }
    },error =>{
      console.log(error);
      loader.dismiss();
      this.alerts.lanzarAlert(error);
    })

  }

  retar(amigo){

    var datos = {
      idUsuarioRetado: amigo.idUsuarioDonkey,
      idUsuarioRetador: localStorage.getItem('idUsuario'),
      mensaje: this.datosUsuario.usuario + ' te ha retado a jugar.',
      avatar: this.datosUsuario.avatar,
      nivel: this.datosUsuario.nivel
    }

    this.socket.emit('enviar-invitacion-pvp', datos);
  }

  ionViewCanLeave(){
  }

}

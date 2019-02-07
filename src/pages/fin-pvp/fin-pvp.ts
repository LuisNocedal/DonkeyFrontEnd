import { Component } from '@angular/core';
import { IonicPage, 
  NavController, 
  NavParams,
  AlertController,
  LoadingController } from 'ionic-angular';
import { FinPvpService } from './fin-pvp.service';
import { MenuPage } from '../menu/menu';
import { Alerts } from '../../app/alerts';

//@IonicPage()
@Component({
  selector: 'page-fin-pvp',
  templateUrl: 'fin-pvp.html',
  providers: [ FinPvpService ]
})
export class FinPvpPage {

  respuestasUsuarios;

  mensaje;

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  private _finPvpService: FinPvpService,
  private alerts: Alerts,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController) {
  this.respuestasUsuarios = navParams.data.respuestasUsuarios;

    console.log(this.respuestasUsuarios);

    var correctasUsuario = 0;
    var correctasContrincante = 0;

    for (let i = 0; i < 5; i++) {
      if(this.respuestasUsuarios.usuario[i].respuesta == 'c'){
        correctasUsuario += 1
      }
    }

    for (let i = 0; i < 5; i++) {
      if(this.respuestasUsuarios.contrincante[i].respuesta == 'c'){
        correctasContrincante += 1
      }
    }

    console.log('Usuario: '+correctasUsuario);
    console.log('Contrincante: '+correctasContrincante);

    if(correctasUsuario == correctasContrincante){
      this.mensaje = "Empate"
    }else if (correctasUsuario > correctasContrincante){
      this.mensaje = "Ganaste"
      this.guardarGanador(navParams.data.idPartida);
    }else if (correctasContrincante > correctasUsuario) {
      this.mensaje = "Perdiste"
    }
  }

  continuar(){
    this.navCtrl.setRoot(MenuPage);
  }

  guardarGanador(idPartida){

    var datos = {
      token: localStorage.getItem('token'),
      idPartida: idPartida
    }

    let loader = this.loadingCtrl.create({
      content: "Cargando :)...",
    });
    loader.present();

    this._finPvpService.guardarGanador(datos).subscribe(result =>{
      if(result.sesion){
        loader.dismiss();
      }else{
        this.alerts.alertNoSesion();
      }
    },error => {
      console.log(error);
      loader.dismiss();
      this.alerts.lanzarAlert(error);
    })

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad FinPvpPage');
  }

}

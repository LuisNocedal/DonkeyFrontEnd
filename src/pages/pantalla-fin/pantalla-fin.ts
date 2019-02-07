import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { PantallaFinService } from './pantalla-fin.service';
import { MenuPage } from '../menu/menu';
import { Alerts } from '../../app/alerts';

//@IonicPage()
@Component({
  selector: 'page-pantalla-fin',
  templateUrl: 'pantalla-fin.html',
  providers: [ PantallaFinService ]
})
export class PantallaFinPage {

  puntos;
  contestadas;
  idCategoria;

  constructor(
  public navCtrl: NavController, 
  public navParams: NavParams,
  public _pantallaFinService: PantallaFinService,
  public loadingCtrl: LoadingController,
  private alerts: Alerts) {

    this.puntos = navParams.data.puntos;
    this.contestadas = navParams.data.contestadas;
    this.idCategoria = navParams.data.idCategoria;
    
    this.guardarPuntos();
  }

  guardarPuntos(){

    var datos = {
      token: localStorage.getItem('token'),
      puntos: this.puntos,
      idCategoria: this.idCategoria
    }

    let loader = this.loadingCtrl.create({
      content: "Cargando :)...",
    });
    loader.present();

    this._pantallaFinService.guardarPuntos(datos).subscribe(result => {

      loader.dismiss();

      if(!result.sesion){
        this.alerts.alertNoSesion();
      }

    },error => {
      console.log(error);
      loader.dismiss();
      this.alerts.lanzarAlert(error);
    })

  }

  continuar(){
    this.navCtrl.goToRoot({
      animate: true
    });
  }

  ionViewDidLoad() {
    
  }

}

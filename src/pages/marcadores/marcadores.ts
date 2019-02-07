import { Component } from '@angular/core';
import { IonicPage, 
  NavController, 
  NavParams,
  AlertController,
  LoadingController } from 'ionic-angular';
import { Alerts } from '../../app/alerts';
import { MarcadoresService } from './marcadores.service';

//@IonicPage()
@Component({
  selector: 'page-marcadores',
  templateUrl: 'marcadores.html',
  providers: [ MarcadoresService ]
})
export class MarcadoresPage {

  marcadorGeneral;

  usuarioActual;

  resolucion;

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  private _marcadoresService: MarcadoresService,
  public alertCtrl: AlertController,
  public loadingCtrl: LoadingController,
  public alerts: Alerts,) {

    this.usuarioActual = localStorage.getItem('idUsuarioDonkey');

    this.cargaMarcadores();

    this.resolucion = screen.width;
    console.log(this.resolucion);
    window.onresize = (event) => {
      this.resolucion = screen.width;
      console.log(this.resolucion);
    };

  }

  cargaMarcadores(){

    var datos = {
      token: localStorage.getItem('token')
    }

    let loader = this.loadingCtrl.create({
      content: "Cargando :)...",
    });
    loader.present();
    
    this._marcadoresService.datosIniciales(datos).subscribe(result => {
      loader.dismiss();
      if(result.sesion){
        this.marcadorGeneral = result.marcadorGeneral;
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
  }

}

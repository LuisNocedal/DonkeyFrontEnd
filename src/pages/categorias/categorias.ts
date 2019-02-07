import { Component } from '@angular/core';
import { IonicPage, 
  NavController, 
  NavParams,
  AlertController,
  LoadingController } from 'ionic-angular';
import { Alerts } from '../../app/alerts';
import { CategoriasService } from './categorias.service';
import { PantallaInicioPage } from '../pantalla-inicio/pantalla-inicio';

//@IonicPage()
@Component({
  selector: 'page-categorias',
  templateUrl: 'categorias.html',
  providers: [ CategoriasService ]
})
export class CategoriasPage {

  carrera;

  categorias;

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  private _categoriasService: CategoriasService,
  public alertCtrl: AlertController,
  public loadingCtrl: LoadingController,
  public alerts: Alerts) {
    this.carrera = navParams.data.carrera;
    console.log(this.carrera);
    this.cargarDatosIniciales();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad CategoriasPage');
  }

  cargarDatosIniciales(){

    var datos = {
      token: localStorage.getItem('token'),
      idCarrera: this.carrera.idCarrera
    }

    let loader = this.loadingCtrl.create({
      content: "Cargando :)...",
    });
    loader.present();

    this._categoriasService.datosIniciales(datos).subscribe(result => {
      loader.dismiss();
      if(result.sesion){
        this.categorias = result.categorias;
      }else{
        this.alerts.alertNoSesion();
      }
    },error => {
      console.log(error);
      loader.dismiss();
      this.alerts.lanzarAlert(error);
    })

  }

  irPantallaInicio(categoria){
    this.navCtrl.push(PantallaInicioPage,{categoria: categoria});
  }

}

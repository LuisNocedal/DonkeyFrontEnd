import { Component } from '@angular/core';
import { IonicPage, 
  NavController, 
  NavParams,
  AlertController,
  LoadingController } from 'ionic-angular';
import { InicioService } from './inicio.service';
import { CategoriasPage } from '../categorias/categorias';
import { Alerts } from '../../app/alerts';
import { InicioPvpPage } from '../inicio-pvp/inicio-pvp';

//@IonicPage()
@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
  providers: [ InicioService ]
})
export class InicioPage {

  datosUsuario;
  carreras;

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  private _inicioService: InicioService,
  public alertCtrl: AlertController,
  public loadingCtrl: LoadingController,
  public alerts: Alerts) {


  }

  ionViewDidLoad() {
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

    this._inicioService.datosIniciales(datos).subscribe(result =>{
      loader.dismiss();
      if(result.sesion){
        this.carreras = result.carreras;
        this.datosUsuario = result.datosUsuario;
      }else{
        //this.alerts.alertNoSesion(LoginPage);
      }
    },error => {
      console.log(error);
      loader.dismiss();
      this.alerts.lanzarAlert(error);
    })

  }

  irCarrera(carrera){
    this.navCtrl.push(CategoriasPage,{carrera: carrera});
  }

  partidaPVP(){
    this.navCtrl.push(InicioPvpPage);
  }

}

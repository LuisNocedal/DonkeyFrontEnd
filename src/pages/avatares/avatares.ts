import { Component } from '@angular/core';
import { IonicPage, 
  NavController, 
  NavParams,
  ViewController,
  AlertController,
  LoadingController } from 'ionic-angular';
import { AvataresService } from './avatares.service';
import { Alerts } from '../../app/alerts';

//@IonicPage()
@Component({
  selector: 'page-avatares',
  templateUrl: 'avatares.html',
  providers: [ AvataresService ]
})
export class AvataresPage {

  avatares;

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  public viewCtrl: ViewController,
  private _avataresService: AvataresService,
  public alertCtrl: AlertController,
  public loadingCtrl: LoadingController,
  public alerts: Alerts) {

  }

  ionViewDidLoad() {
    this.datosInciales();
  }

  datosInciales(){

    var datos = {};

    let loader = this.loadingCtrl.create({
      content: "Cargando :)...",
    });
    loader.present();

    this._avataresService.datosIniciales(datos).subscribe(result =>{
      loader.dismiss();
      this.avatares = result.avatares;
    },error => {
      console.log(error);
      loader.dismiss();
      this.alerts.lanzarAlert(error);
    })

  }

  seleccionar(idAvatar,imagen){
    this.viewCtrl.dismiss({avatar:{
      idAvatar: idAvatar,
      imagen: imagen
    }})
  }

  cerrar(){
    this.viewCtrl.dismiss();
  }

}

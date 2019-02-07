import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PartidaPage } from '../partida/partida';

//@IonicPage()
@Component({
  selector: 'page-pantalla-inicio',
  templateUrl: 'pantalla-inicio.html',
})
export class PantallaInicioPage {

  categoria;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.categoria = navParams.data.categoria;

  }

  ionViewDidLoad() {
  }

  irPartida(){
    
    this.navCtrl.setRoot(PartidaPage,{categoria: this.categoria});

  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';

//@IonicPage()
@Component({
  selector: 'page-invitacion-pvp',
  templateUrl: 'invitacion-pvp.html',
})
export class InvitacionPvpPage {

  datosInvitacion

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  public viewCtrl: ViewController,
  private socket: Socket) {

    this.datosInvitacion = navParams.data.datosInvitacion;

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad InvitacionPvpPage');
  }

  aceptar(){
    var datos = {
      idUsuarioRetador: this.datosInvitacion.idUsuarioRetador,
      idUsuarioRetado: localStorage.getItem('idUsuario'),
    }

    this.socket.emit('aceptar-invitacion-pvp', datos);

    this.viewCtrl.dismiss();
  }

  rechazar(){
    this.viewCtrl.dismiss();
  }

}

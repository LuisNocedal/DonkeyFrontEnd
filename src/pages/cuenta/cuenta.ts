import { Component } from '@angular/core';
import { IonicPage, 
  NavController, 
  NavParams,
  AlertController, 
  LoadingController, 
  ModalController,
  ToastController,
  Events} from 'ionic-angular';
import { CuentaService } from './cuenta.service';
import { Alerts } from '../../app/alerts';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { AvataresPage } from '../avatares/avatares';
import { Md5 } from 'ts-md5/dist/md5';
 
//@IonicPage()
@Component({
  selector: 'page-cuenta',
  templateUrl: 'cuenta.html',
  providers: [ CuentaService ]
})
export class CuentaPage {

  formCuenta: FormGroup;

  avatar = {
    imagen: null,
    idAvatar: null
  };
  password;
  confirmarPassword;

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  private _cuentaService: CuentaService,
  public alertCtrl: AlertController,
  public alerts: Alerts,
  public loadingCtrl: LoadingController,
  private fb: FormBuilder,
  public modalCtrl: ModalController,
  public toastCtrl: ToastController,
  public events: Events) {

    this.formCuenta = fb.group({
      'usuario': new FormControl("", Validators.required)
    });

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad CuentaPage');
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

    this._cuentaService.cargarDatosIniciales(datos).subscribe(result =>{
      loader.dismiss();
      if(result.sesion){
        this.formCuenta.controls['usuario'].setValue(result.datosUsuario.usuario)
        this.avatar.imagen = result.datosUsuario.avatar
      }else{
        this.alerts.alertNoSesion();
      }
    },error => {
      console.log(error);
      loader.dismiss();
      this.alerts.lanzarAlert(error);
    });

  }

  guardarCambios(){

    var f = this.formCuenta.value;

    if(this.password||this.confirmarPassword){
      if(this.password!=this.confirmarPassword){
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'La contraseña no coincide.',
          buttons: ['Aceptar']
        });
        alert.present();
        return;
      }

    }

    var datos = {
      token: localStorage.getItem('token'),
      datosUsuario: f,
      password: (this.password)?Md5.hashStr(this.password):null,
      idAvatar: (this.avatar.idAvatar)?this.avatar.idAvatar:null
    }

    let loader = this.loadingCtrl.create({
      content: "Guardando :)...",
    });
    loader.present();

    this._cuentaService.guardarDatosCuenta(datos).subscribe(result =>{
      loader.dismiss();
      if(result.sesion){

        if(result.estatus){
          let toast = this.toastCtrl.create({
            message: result.mensaje,
            duration: 2000,
            position: 'bottom'
          });
          toast.present();
          this.events.publish('recargarDatosUsuario');
        }else{
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: result.error,
            buttons: ['Aceptar']
          });
          alert.present();
        }

      }else{
        this.alerts.alertNoSesion();
      }
    },error => {
      console.log(error);
      loader.dismiss();
      this.alerts.lanzarAlert(error);
    });

  }

  avatares(){
    let modal = this.modalCtrl.create(AvataresPage);
    modal.onDidDismiss(data => {
      
      if(data){
        console.log(data.avatar);
        this.avatar = data.avatar;
      }

    });
    modal.present();
  }

}

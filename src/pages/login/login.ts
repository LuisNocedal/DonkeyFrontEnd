import { Component, Inject } from '@angular/core';
import { IonicPage, 
  NavController, 
  NavParams,
  AlertController,
  LoadingController } from 'ionic-angular';
import { RegistroPage } from '../registro/registro';
import { LoginService } from './login.service';
import { MenuPage } from '../menu/menu';
import { Md5 } from 'ts-md5/dist/md5';
import { Alerts } from '../../app/alerts';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
//import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Configuraciones } from '../../app/config';

//@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [ LoginService, /*Push*/ ]
})
export class LoginPage {

  usuario;
  password;

  resolucion;

  form;

  push_token

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  public _loginService: LoginService,
  public alertCtrl: AlertController,
  public loadingCtrl: LoadingController,
  public alerts: Alerts,
  @Inject(FormBuilder) fb: FormBuilder,
  private config: Configuraciones
  /*private push: Push*/) {

    this.resolucion = screen.width;

    this.form = fb.group({
      'usuario': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
    });

    /*this.push.hasPermission()
    .then((res: any) => {
        if (res.isEnabled) {
        } else {
        }
    });

    const options: PushOptions = {
      android: {},
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      }
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((registration: any) => {
      this.push_token = registration.registrationId;
    });*/

  }

  ionViewDidLoad() {
  }

  ingresar(){

    var f = this.form.value;

    var datos = {
      usuario: f.usuario,
      push_token: this.push_token,
      password: Md5.hashStr(f.password),
      version: this.config.version
    }

    let loader = this.loadingCtrl.create({
      content: "Cargando :)...",
    });
    loader.present();

    this._loginService.registrar(datos).subscribe(result =>{

      loader.dismiss();

      if(result.estatus){
        localStorage.setItem('token',result.token);
        localStorage.setItem('idUsuario',result.idUsuario)
        this.navCtrl.setRoot(MenuPage);
      }else{
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: result.error,
          buttons: ['Aceptar']
        });
        alert.present();
      }

    },error => {
      console.log(error);
      loader.dismiss();
      this.alerts.lanzarAlert(error);
    });

  }

  registro(){
    this.navCtrl.push(RegistroPage);
  }

}

import { Component, Inject } from '@angular/core';
import { IonicPage, 
  NavController, 
  NavParams, 
  AlertController,
  ModalController,
  LoadingController } from 'ionic-angular';
import { RegistroService } from './registro.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { AvataresPage } from '../avatares/avatares';
import { MenuPage } from '../menu/menu';
import { Md5 } from 'ts-md5/dist/md5';
import { Alerts } from '../../app/alerts';
//import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Configuraciones } from '../../app/config';

//@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
  providers: [ RegistroService, /*Push*/ ]
})
export class RegistroPage {

  form: FormGroup;
  avatar;

  push_token

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  private _registroService: RegistroService,
  public alertCtrl: AlertController,
  @Inject(FormBuilder) fb: FormBuilder,
  public modalCtrl: ModalController,
  public loadingCtrl: LoadingController,
  public alerts: Alerts,
  private config: Configuraciones
  /*private push: Push*/) {

    this.form = fb.group({
      'usuario': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
      'confirmacion': new FormControl("", Validators.required),
      //'carrera': new FormControl("", Validators.required),
      'sexo': new FormControl("", Validators.required),
      'nombre': new FormControl("", Validators.required),
      //'codigo': new FormControl("", Validators.required)
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

  registrar(){

    var f = this.form.value;

    if(!this.avatar){
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Tienes que seleccionar un avatar.',
        buttons: ['Aceptar']
      });
      alert.present();

      return
    }

    if(f.password != f.confirmacion){
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'La contraseña no coincide',
        buttons: ['Aceptar']
      });
      alert.present();

      return
    }

    var datosRegistro = {
      usuario: f.usuario,
      nombre: f.nombre,
      password: Md5.hashStr(f.password),
      carrera: f.carrera,
      sexo: f.sexo,
      idAvatar: this.avatar.idAvatar,
      token_push: this.push_token
    }

    var datos = {
      datosRegistro: datosRegistro,
      version: this.config.version
      //codigo: f.codigo
    }

    let loader = this.loadingCtrl.create({
      content: "Cargando :)...",
    });
    loader.present();

    this._registroService.registrar(datos).subscribe(result =>{

      loader.dismiss();

      if(result.estatus){
        localStorage.setItem('token',result.token);
        localStorage.setItem('idUsuario',result.idUsuario);
        this.navCtrl.setRoot(MenuPage);
      }else{
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: result.error,
          buttons: ['Aceptar']
        });
        alert.present();
      }

    }, error => {
      console.log(error);
      loader.dismiss();
      this.alerts.lanzarAlert(error);

    })

  }

}

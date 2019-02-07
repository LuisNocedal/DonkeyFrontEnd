import { NgModule } from "@angular/core"
import { AlertController,
    LoadingController,
    Events} from 'ionic-angular';

@NgModule()
export class Alerts {

    constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private events: Events){

    }

    lanzarAlert(error){
        if(error.type == 3){
            let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: 'Comprueba tu internet.',
                buttons: ['Aceptar']
            });
            alert.present();
        }
    
        if(error.type == 2 || !error.type){
            let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Esta madre falló. Contacta con el pésimo programador que la programó.',
            buttons: ['Aceptar']
            });
            alert.present();
        }
    }

    alertNoSesion(){
        let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Estás en una versión antigua o la sesión está abierta en otro dispositivo.',
            buttons: ['Aceptar']
        });
        alert.present();
        this.events.publish('salir');
    }
}
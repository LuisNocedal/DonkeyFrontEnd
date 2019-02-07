import { Component } from '@angular/core';
import { IonicPage, 
  NavController, 
  NavParams, 
  AlertController, 
  LoadingController,
  App } from 'ionic-angular';
import { PartidaService } from './partida.service';
import { PantallaFinPage } from '../pantalla-fin/pantalla-fin';
import { Alerts } from '../../app/alerts';
 
//@IonicPage()
@Component({
  selector: 'page-partida',
  templateUrl: 'partida.html',
  providers: [ PartidaService ]
})
export class PartidaPage {

  segundos;

  preguntas;
  preguntaActual = {
    pregunta: null,
    respuesta: null,
    incorrecta1: null,
    incorrecta2: null,
    incorrecta3: null,
  };
  opciones;

  contestadas = 0;
  puntos = 0;

  timer;

  categoria;

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  private _partidaService: PartidaService,
  public alertCtrl: AlertController,
  public alerts: Alerts,
  public loadingCtrl: LoadingController,
  private app: App) {

    this.categoria = navParams.data.categoria;


    this.cargarPreguntas(navParams.data.categoria);

  }

  ionViewWillUnload(){
    clearInterval(this.timer);
  }

  cargarPreguntas(categoria){

    var datos = {
      token: localStorage.getItem('token'),
      categoria: categoria.idCategoria,
    }

    let loader = this.loadingCtrl.create({
      content: "Cargando :)...",
    });
    loader.present();

    this._partidaService.cargarPreguntas(datos).subscribe(result => {

      loader.dismiss();

      if(result.sesion){
        this.preguntas = result.preguntas;
        this.nuevaPregunta();
      }else{
        this.alerts.alertNoSesion();
      }

    },error => {
      console.log(error);
      loader.dismiss();
      this.alerts.lanzarAlert(error);
    })
  }

  iniciarContador(tiempoLectura = 0){
    
    if(this.preguntas.length > 0){
      this.segundos = 15 + tiempoLectura;
      this.timer = setInterval(()=>this.contador(),1000);
    }

  }

  contador(){

    if(this.segundos != 0){
      this.segundos --;
    }else{
      let alert = this.alertCtrl.create({
        title: 'Has perdido',
        subTitle: 'Se acabó el tiempo',
        buttons: ['Aceptar']
      });
      alert.present();
      clearInterval(this.timer);
      this.partidaTerminada();
    }

  }

  nuevaPregunta(){

    if(this.preguntas.length == 0){
      let alert = this.alertCtrl.create({
        title: 'Oh mierda...',
        subTitle: 'Terminaste todas las preguntas de esta categoría',
        buttons: ['Aceptar']
      });
      alert.present();
      return;
    }

    var num = Math.round(Math.random()*this.preguntas.length-1);

    if(num < 0){
      num = 0;
    }

    this.preguntaActual = this.preguntas[num];
    
    var tiempoLectura = this.calcularTiempoLectura(this.preguntas[num].pregunta.length);

    this.iniciarContador(tiempoLectura);

    this.opciones = [];

    this.opciones.push(this.preguntaActual.respuesta);
    this.opciones.push(this.preguntaActual.incorrecta1);
    this.opciones.push(this.preguntaActual.incorrecta2);
    this.opciones.push(this.preguntaActual.incorrecta3);

    this.opciones.sort(function() {return Math.random() - 0.5});

    this.preguntas.splice(num,1);

  }

  calcularTiempoLectura(largo){

    var tipo = Math.round(largo/25);

    var segundos;

    if(tipo <= 2){
      segundos = 1;
    }else if(tipo <= 4){
      segundos = 3;
    }else if(tipo >= 5){
      segundos = 5;
    }

    return segundos;
  }

  comprobarRespuesta(opcion){

    if(opcion == this.preguntaActual.respuesta){
      this.contestadas ++;

      this.puntos += this.calcularPuntosPorPregunta();

      clearInterval(this.timer);
      this.nuevaPregunta();

    }else{
      let alert = this.alertCtrl.create({
        title: 'Has perdio',
        subTitle: 'Respuesta incorrecta',
        buttons: ['Aceptar']
      });
      alert.present();
      clearInterval(this.timer);
      this.partidaTerminada();
    }

  }

  calcularPuntosPorPregunta(){

    var puntosPorPregunta;

    if(this.contestadas <=5){
      puntosPorPregunta = 1;
    }else if(this.contestadas <=10){
      puntosPorPregunta = 2;
    }else if(this.contestadas >10){
      puntosPorPregunta = 3;
    }
    
    console.log(puntosPorPregunta);

    return puntosPorPregunta;

  }

  partidaTerminada(){

    this.navCtrl.setRoot(PantallaFinPage,{
      contestadas: this.contestadas,
      puntos: this.puntos,
      idCategoria: this.categoria.idCategoria
    });

  }
  
  ionViewDidLoad() {
  }

  usarComodin(){

    
   
  }

}

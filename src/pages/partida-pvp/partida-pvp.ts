import { Component } from '@angular/core';
import { IonicPage, 
  NavController, 
  NavParams,
  AlertController,
  LoadingController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { PartidaPvpService } from './partida-pvp.service';
import { Alerts } from '../../app/alerts';
import { FinPvpPage } from '../fin-pvp/fin-pvp';
import { Observable } from 'rxjs/Observable';

//@IonicPage()
@Component({
  selector: 'page-partida-pvp',
  templateUrl: 'partida-pvp.html',
  providers: [ PartidaPvpService ]
})
export class PartidaPvpPage {

  datosPartida;
  datosUsuario;
  datosContrincante;

  preguntasPartida;

  ronda = 1;

  preguntaActual;

  timer;
  segundos;

  respuestasUsuarios = {
    usuario: [],
    contrincante: []
  }

  circulosUsuario = [];
  circulosContrincante = [];

  mostrarResultados = false;

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  private socket: Socket,
  private _partidaPvService: PartidaPvpService,
  public alerts: Alerts,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,) {

    this.socket.connect();

    this.datosPartida = navParams.data.datosPartida;
    this.cargarDatosIniciales();

    for (let i = 0; i < 5; i++) {
      this.respuestasUsuarios.usuario.push({
        contestacion: null,
        respuesta: null
      });
      this.respuestasUsuarios.contrincante.push({
        contestacion: null,
        respuesta: null,
        opcion: null
      })
    }

    for (let i = 0; i < 5; i++) {
      this.circulosUsuario.push(i)
    }
    for (let i = 0; i < 5; i++) {
      this.circulosContrincante.push(i)
    }

    this.eventosPatida().subscribe(event => {});

  }

  eventosPatida(){

    let observable = new Observable(observer => {
      this.socket.on('contestacion-rival',datos =>{
        if(datos.idPartida != this.datosPartida.idPartida || 
        datos.idUsuarioContestacion == localStorage.getItem('idUsuario')){
          return;    
        }
        this.respuestasUsuarios.contrincante[this.ronda-1].contestacion = true;
        observer.next(datos);
      });
  
      this.socket.on('respuesta-rival',datos =>{
        if(datos.idPartida != this.datosPartida.idPartida || 
        datos.idUsuarioRespuesta == localStorage.getItem('idUsuario')){
          return;    
        }
        this.respuestasUsuarios.contrincante[this.ronda-1].respuesta = datos.respuesta
        this.respuestasUsuarios.contrincante[this.ronda-1].opcion = datos.opcionElegida;
        observer.next(datos);
      });
    })

    return observable;

  }

  cargarDatosIniciales(){

    var datos = {
      token: localStorage.getItem('token'),
      idUsuarioContrincante: 
      (this.datosPartida.idUsuarioRetador == localStorage.getItem('idUsuario'))?
      this.datosPartida.idUsuarioRetado:this.datosPartida.idUsuarioRetador,
      idPartida: this.datosPartida.idPartidaPvp
    }

    let loader = this.loadingCtrl.create({
      content: "Cargando :)...",
    });
    loader.present();

    this._partidaPvService.datosInciales(datos).subscribe(result =>{
      loader.dismiss();
      if(result.sesion){
        this.datosUsuario = result.datosUsuario;
        this.datosContrincante = result.datosContrincante;
        this.preguntasPartida = result.preguntasPartida;
        this.iniciarRonda();
      }else{
        this.alerts.alertNoSesion();
      }
    },error => {
      console.log(error);
      loader.dismiss();
      this.alerts.lanzarAlert(error);
    })

  }

  iniciarRonda(){
    this.preguntaActual = this.preguntasPartida[this.ronda-1];
    var tiempoLectura = this.calcularTiempoLectura(this.preguntasPartida[this.ronda-1].pregunta.length);
    this.iniciarContador(tiempoLectura);
    var opciones = [];
    opciones.push(this.preguntaActual.respuesta);
    opciones.push(this.preguntaActual.incorrecta1);
    opciones.push(this.preguntaActual.incorrecta2);
    opciones.push(this.preguntaActual.incorrecta3);
    opciones.sort(function() {return Math.random() - 0.5});

    this.preguntaActual.opciones = opciones;
    //this.preguntas.splice(num,1);
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

  iniciarContador(tiempoLectura = 0){
    if(this.preguntasPartida.length > 0){
      this.segundos = 8 + tiempoLectura;
      this.timer = setInterval(()=>this.contador(),1000);
    }
  }

  contador(){
    if(this.segundos != 0){
      this.segundos --;
    }else{
      clearInterval(this.timer);
      this.revisarRespuesta();
    }
  }

  seleccionarOpcion(opcion){

    if(this.mostrarResultados){
      return;
    }

    this.preguntasPartida[this.ronda-1].eleccion = opcion;

    var datos = {
      idPartida: this.datosPartida.idPartida,
      idUsuarioContestacion: localStorage.getItem('idUsuario')
    } 

    this.respuestasUsuarios.usuario[this.ronda-1].contestacion = true;

    this.socket.emit('contestacion-pregunta',datos);

  }

  revisarRespuesta(){
    var respuesta = (this.preguntaActual.respuesta == this.preguntaActual.eleccion)?'c':'i';
    this.respuestasUsuarios.usuario[this.ronda-1].respuesta = respuesta;
    let loader = this.loadingCtrl.create({
      content: "Esperando respuesta del contrincante :0...",
    });
    var datos = {
      idPartida: this.datosPartida.idPartida,
      idUsuarioRespuesta: localStorage.getItem('idUsuario'),
      opcionElegida: this.preguntaActual.eleccion,
      respuesta: respuesta
    }
    this.socket.emit('respuesta-pregunta',datos);
    loader.present();
    this.esperarRespuestaContrincante(loader);
   
  }

  esperarRespuestaContrincante(loader){
    if(!this.respuestasUsuarios.contrincante[this.ronda-1].respuesta){
      console.log('No hay respuesta aún...');
      setTimeout(() => {
        this.esperarRespuestaContrincante(loader);
      }, 1000);
    }else{
      loader.dismiss();
      this.mostrarResultados = true;
      this.siguienteRonda();
    }
  }

  siguienteRonda(){
    setTimeout(() => {
      this.mostrarResultados = false;
      if(this.ronda <5){
        this.ronda ++;
        this.iniciarRonda();
      }else{
        this.socket.removeAllListeners();
        this.socket.disconnect();
        this.navCtrl.setRoot(FinPvpPage,{respuestasUsuarios: this.respuestasUsuarios, 
          idPartida: this.datosPartida.idPartidaPvp});
      }
    }, 3000);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad PartidaPvpPage');
  }

}

import { Injectable } from "@angular/core"
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import { Observable } from "rxjs/Observable";
import { Configuraciones } from '../../app/config';

@Injectable()
export class AmigosService{


  api = ''

  constructor(private http: HttpClient, private config: Configuraciones) {
      this.api = config.api;
  }

  buscarUsuario(datos: any): Observable<any> {
    return this.http.post(this.api+'Usuario/buscarUsuario', datos)
  }

  solicitudAmistad(datos: any): Observable<any> {
    return this.http.post(this.api+'Usuario/solicitudAdmistad', datos)
  }

  cargarDatosIniciales(datos: any): Observable<any> {
    return this.http.post(this.api+'DatosIniciales/datosAmigos', datos)
  }

  responderSolicitud(datos: any): Observable<any> {
    return this.http.post(this.api+'Usuario/responderSolicitud', datos)
  }
}
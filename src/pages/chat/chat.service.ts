import { Injectable } from "@angular/core"
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import { Observable } from "rxjs/Observable";
import { Configuraciones } from '../../app/config';

@Injectable()
export class ChatService{


  api = ''

  constructor(private http: HttpClient, private config: Configuraciones) {
      this.api = config.api;
  }

  cargarMensajes(datos: any): Observable<any> {
    return this.http.post(this.api+'Chat/cargarMensajes', datos)
  }

  enviarMensaje(datos: any): Observable<any> {
    return this.http.post(this.api+'Chat/enviarMensaje', datos)
  }
}
import { Injectable } from "@angular/core"
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import { Observable } from "rxjs/Observable";
import { Configuraciones } from '../../app/config';

@Injectable()
export class LoginService{


  api = 'http://jorgenocedal.com/luisdev/apiDonkey/index.php/'

  constructor(private http: HttpClient, private config: Configuraciones) {
    this.api = config.api;
  }

  registrar(datos: any): Observable<any> {
    return this.http.post(this.api+'Login/ingresar', datos)
  }
}
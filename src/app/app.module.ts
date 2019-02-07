import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { Alerts } from '../app/alerts';
import { Configuraciones } from '../app/config';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: 'http://donkeydl.com:2323', options: {} };

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { RegistroPage } from '../pages/registro/registro';
import { AvataresPage } from '../pages/avatares/avatares';
import { MenuPage } from '../pages/menu/menu';
import { InicioPage } from '../pages/inicio/inicio';
import { PantallaInicioPage } from '../pages/pantalla-inicio/pantalla-inicio';
import { PartidaPage } from '../pages/partida/partida';
import { PantallaFinPage } from '../pages/pantalla-fin/pantalla-fin';
import { MarcadoresPage } from '../pages/marcadores/marcadores';
import { CuentaPage } from '../pages/cuenta/cuenta';
import { AmigosPage } from '../pages/amigos/amigos';
import { PartidaPvpPage } from '../pages/partida-pvp/partida-pvp';
import { InicioPvpPage } from '../pages/inicio-pvp/inicio-pvp';
import { InvitacionPvpPage } from '../pages/invitacion-pvp/invitacion-pvp';
import { FinPvpPage } from '../pages/fin-pvp/fin-pvp';
import { ChatPage } from '../pages/chat/chat';
import { CategoriasPage } from '../pages/categorias/categorias';
 
@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegistroPage,
    AvataresPage,
    MenuPage,
    InicioPage,
    PantallaInicioPage,
    PartidaPage,
    PantallaFinPage,
    MarcadoresPage,
    CuentaPage,
    AmigosPage,
    PartidaPvpPage,
    InicioPvpPage,
    InvitacionPvpPage,
    FinPvpPage,
    ChatPage,
    CategoriasPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SocketIoModule.forRoot(config),
    HttpClientModule,
    Alerts
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RegistroPage,
    AvataresPage,
    MenuPage,
    InicioPage,
    PantallaInicioPage,
    PartidaPage,
    PantallaFinPage,
    MarcadoresPage,
    CuentaPage,
    AmigosPage,
    PartidaPvpPage,
    InicioPvpPage,
    InvitacionPvpPage,
    FinPvpPage,
    ChatPage,
    CategoriasPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Configuraciones
    //Alerts
  ]
})
export class AppModule {}

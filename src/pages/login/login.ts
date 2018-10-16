import { Component } from '@angular/core';
import { IonicPage, NavController, Keyboard } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { LoadingController } from 'ionic-angular';
import { UsuarioModel } from '../../models/usuarios';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  respuesta: any = [];
  resdata: any = {
    token: String,
    usuario: String,
    email: String,
    shortname: String,
    auth: Boolean
  };
  usuario: any = {
    id: String,
    nombre: String,
    email: String,
    imagen: String,
    ubicacion: String,
    area: String,
    telefono: String,
    isAdmin: Boolean,
    username: String,
    password: String
  };
  datos: any = {
    username: String,
    password: String
  };
  data: UsuarioModel[]=[];
  constructor(public navCtrl: NavController, private LogP: LoginProvider, public keyboard: Keyboard, public loadingCtrl: LoadingController) {
    this.datos.username = "";
    this.datos.password = "";
  }

  ionViewDidLoad() {
    this.getDataUser();
    console.log('ionViewDidLoad LoginPage');
  }

  getDataUser(){
    this.LogP.VerificarBD().subscribe((dato: UsuarioModel[]) => {this.data = dato;});
  }

  postDataUser(body){
    this.LogP.AddUser(body).subscribe(
      (res) => {this.navCtrl.push('PrincipalPage', this.resdata);},
      (error) => {alert(error.message);});
  };

  Iniciar(){
      this.LogP.IniciarSesion(this.datos).subscribe(
        (res) => {
          this.resdata = res;         
          if (this.resdata.auth == true){
              //alert(this.resdata.shortname);
              this.Cargando(this.resdata.auth);
              let filas: number = this.data.filter(x => x.username === this.datos.username).length;
              //alert(filas);
              if (filas == 0){
                this.usuario.nombre = this.resdata.usuario;
                this.usuario.email = this.resdata.email;
                this.usuario.imagen = 'null';
                this.usuario.ubicacion = 'null';
                this.usuario.area = 'null';
                this.usuario.telefono = 'null';
                this.usuario.isAdmin = false;
                this.usuario.username = this.datos.username;
                this.usuario.password = this.datos.password;
                //alert(this.usuario.nombre + " - " + this.usuario.email + " - " + this.usuario.username + " - " + this.usuario.password);
                this.postDataUser(this.usuario);
              }else{
                this.navCtrl.push('PrincipalPage', this.resdata);
              }
              //alert(this.resdata.usuario);
          }else{
            alert('Datos incorrectos'); 
          }
      },
      (error) => {
          alert('Error al autenticar: ' + error.message);
      }
      );

  }

    Cargando(auth){
      let tiempo = 5000;
      if (auth){
        tiempo = 2000;
      }else{
        tiempo = 1000;
      }
      const loader = this.loadingCtrl.create({
        content: "Conectando...",
        duration: tiempo
      });
      loader.present();
    }

  keyboardCheck(){
    console.log('The keyboard is open:', this.keyboard.willShow);
  }
}
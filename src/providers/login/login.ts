import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*  
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

let private_options = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8' }) };

@Injectable()
export class LoginProvider {

  constructor(public http: HttpClient) {
    console.log('Hello LoginProvider Provider');
  }

  IniciarSesion(datos){
    return this.http.post('https://crudbp.herokuapp.com/Login', datos, private_options);
  }

  //Pasar a heroku
  VerificarBD(){
    return this.http.get('https://crudbp.herokuapp.com/api/User/Read', private_options);
  }

    //Pasar a heroku
  AddUser(datos){
    return this.http.post('https://crudbp.herokuapp.com/api/User/Create', datos, private_options);
  }
}

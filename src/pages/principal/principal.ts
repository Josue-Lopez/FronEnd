import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PrincipalPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html'
})
export class PrincipalPage {

  comunidadRoot = 'ComunidadPage'
  noticiasRoot = 'NoticiasPage'
  estrategiasRoot = 'EstrategiasPage'
  productosRoot = 'ProductosPage'
  perfilRoot = 'PerfilPage'

  datos: any;
  constructor(public navCtrl: NavController, private navParams: NavParams) {
    this.datos = this.navParams.data;
    //alert(this.datos.shortname);
  }

}

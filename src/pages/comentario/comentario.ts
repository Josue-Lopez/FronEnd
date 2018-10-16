import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ComentarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comentario',
  templateUrl: 'comentario.html',
})
export class ComentarioPage {

  constructor(public navCtrl: NavController, public navParams: NavParams){
    alert(this.navParams.data.usuario);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComentarioPage');
  }

}

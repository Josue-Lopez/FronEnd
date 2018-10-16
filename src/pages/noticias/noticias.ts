import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PostModel } from '../../models/post';
import { PostProvider } from '../../providers/post/post';

/**
 * Generated class for the NoticiasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-noticias',
  templateUrl: 'noticias.html',
})
export class NoticiasPage {
  
  ListPost: PostModel[] = [];
  IdListPost: PostModel[] = [];
  isFoto: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, public PS: PostProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticiasPage');
  }

  ngOnInit(){
    this.getPost();
  }

  getPost(){
    this.PS.getPost(2).subscribe(
      (datos: PostModel[]) => {
        this.IdListPost = datos;
        for (let item of datos){
          if (item.imagen == "" || item.imagen == "url" || item.imagen == "N/A"){
            this.isFoto = false;
            item.imagen = "../../assets/imgs/transparente.png";
          }else{
            this.isFoto = true;
          }          
          //alert("Estado de foto: "+this.isFoto + " | Cantidad de registros: " + datos.length + " | Imagen: " +item.imagen);
          this.ListPost.unshift(new PostModel(item.id, item.mensaje, item.fecha, item.usuario, item.tipo, item.imagen));
        }
      }
    );
  }
}

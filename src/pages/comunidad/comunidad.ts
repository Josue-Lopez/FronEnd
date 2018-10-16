import { Component, NgZone } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { storage, initializeApp } from 'firebase';
import { FIREBASE_CONFIG } from '../../app/firebase.config';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { PostProvider } from '../../providers/post/post';
import { PostModel } from '../../models/post';
import { MessageModel } from '../../models/message';
//import { AlertController } from 'ionic-angular';

/**
 * Generated class for the ComunidadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comunidad',
  templateUrl: 'comunidad.html',
})
export class ComunidadPage {

  storage: any;
  nickname='';
  urlImagen: any;
  messages = [];
  urls=[];
  message = '';
  ListPost: PostModel[] = [];
  IdListPost: PostModel[] = [];
  PostNew: PostModel[]=[];
  NewPost: MessageModel[]=[];
  Post = [];
  foto;
  image = "";
  time: any;
  cont: number = 0;
  contReverse: number = 0;
  contID: string = "";
  IDPost="";
  parametros: any;
  isFoto: boolean;
  idUsuario: String;
  tamanio: number;
  //private postP: PostProvider
  constructor(private zone: NgZone, public camara: Camera, public navCtrl: NavController, private socket: Socket, private navParams: NavParams, public PS: PostProvider) {
    this.parametros = this.navParams.data;
    this.idUsuario = this.navParams.get('usuario');
    //alert(this.parametros.shortname);
    console.log('usuario: ' + this.navParams.get('usuario'));
    initializeApp(FIREBASE_CONFIG);
    this.urlImagen = "";
    this.message="";
    this.getMessage().subscribe(message => {
      this.messages.push(message);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  ngOnInit(){
    this.getPost();
  }

  async tomarFoto(){
    try{
      const Opciones: CameraOptions = {
        quality: 50,
        targetHeight: 600,
        targetWidth: 600,
        destinationType: this.camara.DestinationType.DATA_URL,
        encodingType: this.camara.EncodingType.JPEG,
        mediaType: this.camara.MediaType.ALLMEDIA,
        correctOrientation: true
      }
      const result = await this.camara.getPicture(Opciones);
      this.image = `data:image/jpeg;base64,${result}`;
      this.foto = this.image;
    }
    catch(e){
      console.error(e);
    }
  }

  GuardarImagen(){
    this.urlImagen="";
    var num = num +1;
    if (this.foto != null){
      const pictures = storage().ref('pictures'+this.parametros.shortname+num);
      pictures.putString(this.foto, 'data_url');
      //alert("foto detectada");
        storage().ref().child('pictures'+this.parametros.shortname+num).getDownloadURL().then((url) => {
          this.zone.run( () => {
              this.urlImagen =  url;
              this.AgregarPost(url);
          });
        });
      this.foto = null;
    }else{
      //alert("foto vacio");
      this.foto = null;
      this.AgregarPost(this.foto);
    }
  }

  async CargarFoto(){
    //Definir opciones de camara
    try{
      const Opciones: CameraOptions = {
        quality: 50,
        targetHeight: 600,
        targetWidth: 600,
        destinationType: this.camara.DestinationType.DATA_URL,
        encodingType: this.camara.EncodingType.JPEG, 
        sourceType: this.camara.PictureSourceType.PHOTOLIBRARY,
        correctOrientation: true,
        saveToPhotoAlbum: false
      }
      this.camara.getPicture(Opciones).then((ImageData) => {
      this.foto = `data:image/jpeg;base64,${ImageData}`;
      });
    }
    catch(e){
      console.error(e);
    }
  }

  getPost(){
    this.PS.getPost(1).subscribe(
      (datos: PostModel[]) => {
        this.IdListPost = datos;
        for (let item of datos){
          if (item.imagen == "" || item.imagen == "url" || item.imagen == "N/A"){
            this.isFoto = false;
            item.imagen = "../../assets/imgs/transparente.p ng";
          }else{
            this.isFoto = true;
          }          
          //alert("Estado de foto: "+this.isFoto + " | Cantidad de registros: " + datos.length + " | Imagen: " +item.imagen);
          this.ListPost.unshift(new PostModel(item.id, item.mensaje, item.fecha, item.usuario, item.tipo, item.imagen));
        }
      }
    );
  }

////////////////////////////////POST////////////////////////////////
////////////////////////////////

  AgregarPost(url){
    //alert(url);
    let tabla: any;
    let d = new Date();
    this.time = d.toLocaleDateString();
    //alert(this.parametros.usuario + " - " + this.parametros.token + " - " + this.message);
    if (url == ""){
      url = "url";
    }

    this.tamanio = this.IdListPost.length + this.NewPost.length + 1;
    this.contID = this.idUsuario+""+this.tamanio; 
    //alert(this.urlImagen);
    //alert(this.idUsuario + " + " + tamanio+ " = "+ this.idUsuario+tamanio);
    //alert(this.idUsuario+""+tamanio+"-"+this.message+"-"+(this.time).toString()+"-"+this.parametros.shortname+"-"+"Comunidad"+"-"+(this.urlImagen).toString());
    tabla = new PostModel(this.idUsuario+""+this.tamanio, this.message, (this.time).toString(), this.parametros.shortname, 1, url);
    this.PS.addPost(tabla).subscribe(
      (res) => {
        this.addID();
        this.addUrl(url);
        this.addUsuario();
        this.addMessage();
        //alert('Agregado exitosamente');
    },
    (error) => {
        alert('Error al publicar');
    }
   );
   this.tamanio = 0;
  }

  //AGREGAR DATOS DEL POST DESDE EL API QUE ACTUALIZA EN TIEMPO REAL.
  addMessage(){
    this.socket.emit('add-message', {text: this.message});
    this.message = '';
  }

  addUrl(url){
    this.socket.connect();
    this.socket.emit('add-url', url);
  }

  addID(){
    this.socket.connect();
    this.socket.emit('add-id', this.contID);
  }

  addUsuario(){
    this.socket.connect();
    this.socket.emit('add-usuario', this.parametros.shortname);
  }

  //OBTENER DATOS DEL POST DESDE EL API QUE ACTUALIZA EN TIEMPO REAL.
  /*
  getUrl(){
    let observable = new Observable(observer =>{
      this.socket.on('urls', data =>{
        observer.next(data);
      });
    });
    return observable;
  }
  */
  getMessage(){
    let observable = new Observable(observer =>{
      this.socket.on('message', data =>{
        observer.next(data);
        this.SaveListPost(data.IDM, data.text, data.foto, data.usuario, data.created);
      });
    });
    return observable;
  }

  SaveListPost(id, mensaje, foto, usuario, fecha){
    this.NewPost.unshift(new MessageModel(id, mensaje, fecha, usuario, foto));
    //alert(foto + " Cargando desde el socket");
  }

////////////////////////////////COMENTARIOS////////////////////////////////
////////////////////////////////
  Comentarios(post){
    //alert(post.usuario);
    this.navCtrl.push('ComentarioPage', post);
  }
}
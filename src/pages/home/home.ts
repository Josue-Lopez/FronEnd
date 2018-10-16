import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { storage, initializeApp } from 'firebase';
import { FIREBASE_CONFIG } from '../../app/firebase.config';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
//import { PostProvider } from '../../providers/post/post';
import { PostModel } from '../../models/post';
import { MessageModel } from '../../models/message';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {

  storage: any;
  nickname='';
  urlImagen: any;
  messages = [];
  urls=[];
  message = '';
  ListPost: PostModel[] = [];
  PostNew: PostModel[]=[];
  NewPost: MessageModel[]=[];
  Post = [];
  foto;
  image = "";
  time: any;
  cont: number = 0;
  contReverse: number = 0;
  contID: number = 0;
  User: string = "";
  IDPost="";
  //private postP: PostProvider
  constructor(private zone: NgZone, public camara: Camera, public navCtrl: NavController, private socket: Socket, private alertCtrl: AlertController) {
    initializeApp(FIREBASE_CONFIG);
    this.urlImagen = "";
    this.getMessage().subscribe(message => {
      this.messages.push(message);
    });
    //this.getPost();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  ngOnInit(){
  let alert = this.alertCtrl.create({
    title: 'Login',
    inputs: [
      {
        name: 'usuario',
        placeholder: 'Usuario'
      }
    ],
    buttons: [
      {
        text: 'Login',
        handler: data => {
            this.User = data.usuario;
        }
      }
    ]
  });
  alert.present();
  }

  async tomarFoto(){
    try{
      const Opciones: CameraOptions = {
        quality: 50,
        targetHeight: 600,
        targetWidth: 600,
        destinationType: this.camara.DestinationType.DATA_URL,
        encodingType: this.camara.EncodingType.JPEG,
        mediaType: this.camara.MediaType.PICTURE,
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
    this.cont+=1;
    let num = (this.cont).toString();
    if (this.urlImagen != ""){
      this.urlImagen  = "";
    }

    if (this.foto != null){
      const pictures = storage().ref('pictures'+num);
      pictures.putString(this.foto, 'data_url');
      //alert("foto detectada");
        storage().ref().child('pictures'+num).getDownloadURL().then((url) => {
          this.zone.run( () => {
              this.urlImagen =  url;
              this.addID();
              this.addUrl();
              this.addUsuario();
              this.addMessage();
          });
        });
      this.foto = null;
    }else{
      //alert("foto vacio");
      //this.AgregarPost();
      this.addID();
      this.addUrl();
      this.addUsuario();
      this.addMessage();
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

/*
  getPost(){
    this.PS.getPost().subscribe(
      (datos: PostModel[]) => {
        this.ListPost = datos;
      }
    );
  }
*/

////////////////////////////////POST////////////////////////////////
////////////////////////////////
/*
  AgregarPost(){
    let tabla: any;
    let d = new Date();
    this.time = d.toLocaleDateString();
    tabla = new PostModel((this.contID+this.User).toString(), this.message, (this.time).toString(), this.User, "Comunidad", (this.urlImagen).toString());
    this.PS.addPost(tabla).subscribe(
      (res) => {
        this.addID();
        this.addUrl();
        this.addUsuario();
        this.addMessage();
        alert('Agregado exitosamente');
    },
    (error) => {
        alert('Error al agregar');
    }
  );
  }
*/
  //AGREGAR DATOS DEL POST DESDE EL API QUE ACTUALIZA EN TIEMPO REAL.
  addMessage(){
    this.socket.emit('add-message', {text: this.message});
    this.message = '';
  }

  addUrl(){
    this.socket.connect();
    this.socket.emit('add-url', this.urlImagen);
  }

  addID(){
    this.contID += 1;
    this.socket.connect();
    this.socket.emit('add-id', this.contID+this.User);
  }

  addUsuario(){
    this.socket.connect();
    this.socket.emit('add-usuario', this.User);
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
  }

////////////////////////////////COMENTARIOS////////////////////////////////
////////////////////////////////

  Comentarios(post){
    this.navCtrl.push('ComentarioPage', {id: post.id, texto: post.texto, fecha: post.fecha, usuario:  post.usuario, foto: post.url, localuser: this.User});
  }
}

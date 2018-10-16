export class PostModel{
    id: string;
    mensaje: string;
    fecha: string;
    usuario: string;
    tipo: number;
    imagen: string;

    constructor(
        id: string,
        mensaje: string,
        fecha: string,
        usuario: string,
        tipo: number,
        imagen: string
    ){
        this.id = id;
        this.mensaje = mensaje;
        this.fecha = fecha;
        this.usuario = usuario;
        this.tipo = tipo;
        this.imagen = imagen;
    }
}
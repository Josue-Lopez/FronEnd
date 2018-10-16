export class ComentarioModel{
    id: string;
    texto: string;
    post: string;
    usuario: string;
    fecha: Date;

    constructor(
        id: string,
        texto: string,
        post: string,
        usuario: string,
        fecha: Date
    ){
        this.id = id;
        this.texto = texto;
        this.post = post;
        this.usuario = usuario;
        this.fecha = fecha;
    }
}
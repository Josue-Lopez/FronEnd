export class MessageModel{
    id: string;
    texto: string;
    fecha: Date;
    usuario: string;
    url: string;

    constructor(
        id: string,
        texto: string,
        fecha: Date,
        usuario: string,
        url: string
    ){
        this.id = id;
        this.texto = texto;
        this.fecha = fecha;
        this.usuario = usuario;
        this.url = url;
    }
}
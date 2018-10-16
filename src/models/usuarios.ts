export class UsuarioModel{
	nombre: string;
	email: string;
	imagen: string;
	ubicacion: string;;
	area: string;
	telefono: string;
	isAdmin: boolean;
	username: string;
	password: string;

    constructor(
        nombre: string,
        email: string,
        imagen: string,
        ubicacion: string,
        area: string,
        telefono: string,
        isAdmin: boolean,
        username: string,
        password: string
    ){
        this.nombre = nombre;
        this.email = email;
        this.imagen = imagen;
        this.ubicacion = ubicacion;
        this.area = area;
        this.telefono = telefono;
        this.email = email;
        this.isAdmin = isAdmin;
        this.username = username;
        this.password = password;
    }
}
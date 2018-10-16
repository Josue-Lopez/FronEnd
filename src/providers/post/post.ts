import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



/*
  Generated class for the PostProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
/*var httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};*/


@Injectable()
export class PostProvider {

  constructor(public http: HttpClient) {
    console.log('Hello PostProvider Provider');
  }

  getPost (tipo){
    //https://crudbp.herokuapp.com/api/Post/Read
    return this.http.get('https://crudbp.herokuapp.com/api/Post/Read/'+tipo);
  }

  addPost(post) {
    //alert(token);https://crudbp.herokuapp.com/api/Post/Create
    return this.http.post('https://crudbp.herokuapp.com/api/Post/Create', post);
}

}

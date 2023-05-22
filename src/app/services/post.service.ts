import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http'
import { Post } from '../model/post.model'
import { map, catchError, tap } from 'rxjs/operators'
import { Subject, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {

  // endPointURL:string = 'https://nama-project-saya-default-rtdb.asia-southeast1.firebasedatabase.app/';
  endPointURL: string = 'https://angular-training-project-38f23-default-rtdb.asia-southeast1.firebasedatabase.app/';
  postURL: string = this.endPointURL + 'post.json';
  patchURL: string = `${this.endPointURL}post`

  errorHandling = new Subject<any>();

  constructor(private http: HttpClient) { }

  createAndPost(postData: Post) {
    this.http.post<{ name: string }>(this.postURL, postData, {
      observe: 'response',
      responseType: 'json'
    })
      .subscribe(
        (data) => {
          console.log(data);
          this.errorHandling.next(null);
        },
        (error) => {
          this.errorHandling.next(error);
        }
      );
  }

  fetchPosts() {
    let customParam = new HttpParams();
    customParam = customParam.append('custom-param', 'satu');
    customParam = customParam.append('custom-param', 'dua');
    return this.http.get<{ [key: string]: Post }>(this.postURL, {
      headers: new HttpHeaders({
        'custom-header': 'this is custom header'
      }),
      params: customParam,
      responseType: 'json'
    })
      .pipe(
        map(responseData => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key })
            }
          }

          return postArray;

        }),
        catchError(
          errorRes => {
            return throwError(errorRes);
          }
        )
      );
  }

  // Task Update Data
  updateData(selectedData: Post) {
    const data = {
      title: selectedData.title,
      content: selectedData.content
    };
    return this.http.patch<Post>(`${this.patchURL}/${selectedData.id}.json`, data);
  }

  // deletePosts(){
  //   return this.http.delete(this.postURL);
  // }

  deletePosts() {
    return this.http.delete(this.postURL, {
      observe: 'events'
    }).pipe(
      tap(
        event => {
          console.log('HERE')
          console.log(event);
          if (event.type === HttpEventType.Sent) {

          }

          if (event.type === HttpEventType.Response) {
            console.log(event.body)
          }
        }
      )
    );
  }



}
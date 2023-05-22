import {HttpInterceptor, HttpRequest, HttpHandler, HttpEventType} from '@angular/common/http'
import {tap} from 'rxjs/operators'

export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, fwd: HttpHandler){
        console.log(req);
        const clonedReq = req.clone(
            {headers: req.headers.append('Basic','xxxxx-xxxxxx-yyyy')}
            );
        return fwd.handle(clonedReq).pipe(
            tap(
                event => {
                    if(event.type === HttpEventType.Response){
                        console.log(event.body);
                    }
                }
            )
        ); 
    }
}


import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { Auth } from '@angular/fire/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private auth = inject(Auth);

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    console.log('🔥 INTERCEPTOR ACTIVADO:', req.url);

    return from(this.auth.currentUser?.getIdToken() ?? Promise.resolve(null))
      .pipe(
        switchMap(token => {

          console.log('TOKEN:', token);

          const authReq = token
            ? req.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`
                }
              })
            : req;

          return next.handle(authReq);
        })
      );
  }
}

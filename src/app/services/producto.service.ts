import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';
import { Producto } from '../models/producto.model';
import { getAuth } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl = 'http://localhost:8080/api/productos';
    private auth = inject(Auth);

  constructor(private http: HttpClient) {}

  getProductos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllProductos`, {
      withCredentials: true,
    });
  }
    scrapeProductos(param: string): Observable<any> {

    return from(this.auth.currentUser!.getIdToken()).pipe(
      switchMap(token => {

        return this.http.post(
          `${this.apiUrl}/scrape`,
          { texto: param },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      })
    );
  }

  logout() {
    return this.http.post(
      `${this.apiUrl}/logout`,
      {},
      { withCredentials: true }, // IMPORTANTE
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllProductos`, {
      withCredentials: true,
    });
  }
  scrapeProductos(param: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/scrape`,
      { texto: param },
      { withCredentials: true },
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

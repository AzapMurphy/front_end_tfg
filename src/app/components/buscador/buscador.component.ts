import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- IMPRESCINDIBLE
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Producto } from '../../models/producto.model';
import { CarritoService } from '../../services/carrito.service';
import { ProductoService } from '../../services/producto.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // <--- Verifica que esté aquí
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.css',
})
export class BuscadorComponent implements OnInit {
  terminoBusqueda: string = '';
  loading:boolean = false;
  //Enviar scrape
  sended = false;
  // Esta es la lista que se mostrará en el HTML
  productosFiltrados: Producto[] = [];

  // Tus datos reales
  listaProductos: Producto[] = [
    {
      id: 1,
      nombre: 'Leche Entera 1L',
      precio: 0.95,
      supermercado: 'Mercadona',
      url: 'https://www.mercadona.es/',
      imagen:
        'https://a2.soysuper.com/97fe0f4a203c6ce8811af3fba386c620.1500.0.0.0.wmark.b86ffd57.jpg',
    },
    {
      id: 2,
      nombre: 'Leche Entera 1L',
      precio: 0.97,
      supermercado: 'Carrefour',
      url: 'https://www.carrefour.es/',
      imagen:
        'https://static.carrefour.es/hd_510x_/img_pim_food/231395_00_1.jpg',
    },
    {
      id: 3,
      nombre: 'Leche Entera 1L',
      precio: 0.97,
      supermercado: 'Dia',
      url: 'https://www.dia.es/',
      imagen: 'https://www.dia.es/product_images/608/608_ISO_0_ES.jpg',
    },
    {
      id: 4,
      nombre: 'Huevos de gallinas camperas',
      precio: 2.2,
      supermercado: 'Mercadona',
      url: 'https://www.mercadona.es/',
      imagen:
        'https://prod-mercadona.imgix.net/images/daf6a1cc96954346430dc055b82dff56.jpg?fit=crop&h=600&w=600',
    },
    {
      id: 5,
      nombre: 'Huevos M-L ecológicos Carrefour Bio 6 ud.',
      precio: 2.85,
      supermercado: 'Carrefour',
      url: 'https://www.carrefour.es/',
      imagen:
        'https://static.carrefour.es/hd_510x_/img_pim_food/864411_00_1.jpg',
    },
    {
      id: 6,
      nombre: 'Huevos ecológicos grandes/medianos M/L Dia 6 unidades',
      precio: 2.95,
      supermercado: 'Dia',
      url: 'https://www.dia.es/',
      imagen:
        'https://a0.soysuper.com/247a73a30ff014d5c141a4dcadb7cd4a.1500.0.0.0.wmark.eba64cc9.jpg',
    },
  ];

  productos: any[] = [];

  constructor(
    private carritoService: CarritoService,
    private productoService: ProductoService,
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    // Al empezar, mostramos todos los productos
    //this.productosFiltrados = this.listaProductos;
  }

  filtrar() {
    const termino = this.terminoBusqueda.toLowerCase().trim();

    if (!termino) {
      this.productosFiltrados = this.listaProductos;
    } else {
      this.productosFiltrados = this.listaProductos.filter((p) =>
        p.nombre.toLowerCase().includes(termino),
      );
    }
  }

  anadirAlCarrito(p: Producto) {
    this.carritoService.agregar(p);
    alert('Añadido: ' + p.nombre);
  }

  send(texto: string) {
    this.loading = true;
    this.productoService.scrapeProductos(texto).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.error(err),
      complete: () => {
        this.cargarProductos();
      },
    });
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (res) => {
        console.log(res);

        if (res.code === 1) {
          this.productos = res.data;
          this.loading = false;
        }
      },
      error: (err) => console.error(err),
    });
  }

  logOut() {
   this.authService.logout()
    .then(() => {
      this.router.navigate(['/login']);
    })
    .catch(error => {
      alert('Error al salir: ' + error.message);
    });
    this.productoService.logout().subscribe(() => {});
  }
}

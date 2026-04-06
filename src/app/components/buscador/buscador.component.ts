import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- IMPRESCINDIBLE
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { ComparadorComponent } from '../../modals/comparador/comparador.component';

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
    MatPaginatorModule,
    MatSelectModule,
    MatDialogModule,
    MatTableModule
  ],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.css',
})
export class BuscadorComponent implements OnInit {
terminoBusqueda: string = '';
  loading: boolean = false;
  sended = false;

  // Lista original de productos cargados del backend
  productos: any[] = [];

  // Lista filtrada (por supermercado)
  productosFiltrados: any[] = [];

  // Lista paginada (lo que se muestra)
  productosPaginados: any[] = [];

  // Filtro por supermercado
  supermercadoSeleccionado: string = '';
  supermercadosUnicos: string[] = [];

  // Paginación
  pageSize: number = 4;
  currentPage: number = 0;
  pageSizeOptions: number[] = [4];

  // Comparación de productos
  productosAComparar: any[] = [];

  // Datos de ejemplo
  listaProductos: Producto[] = []

  productosFiltradosLocal: Producto[] = [];

  constructor(
    private productoService: ProductoService,
    private authService: AuthServiceService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {}

  // Extrae los supermercados únicos de los productos cargados
  extraerSupermercadosUnicos() {
    const supermercados = this.productos
      .map((p) => p.supermercado?.nombre || p.supermercado)
      .filter((s) => s);
    this.supermercadosUnicos = [...new Set(supermercados)];
  }

  // Calcula las opciones del paginador dinámicamente
  calcularPageSizeOptions() {
    const total = this.productosFiltrados.length;
    const opciones = [4, 8, 16, 24, 50].filter((n) => n < total);
    opciones.push(total);
    this.pageSizeOptions = opciones;
  }

  // Filtra los productos por el supermercado seleccionado
  filtrarPorSupermercado() {
    this.currentPage = 0;

    if (!this.supermercadoSeleccionado) {
      this.productosFiltrados = [...this.productos];
    } else {
      this.productosFiltrados = this.productos.filter((p) => {
        const nombreSuper = p.supermercado?.nombre || p.supermercado;
        return nombreSuper === this.supermercadoSeleccionado;
      });
    }

    this.calcularPageSizeOptions();
    this.actualizarPaginacion();
  }

  // Actualiza los productos a mostrar según la página actual
  actualizarPaginacion() {
    const inicio = this.currentPage * this.pageSize;
    const fin = inicio + this.pageSize;
    this.productosPaginados = this.productosFiltrados.slice(inicio, fin);
  }

  // Maneja el cambio de página del paginador
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.actualizarPaginacion();
  }

  // ==================== COMPARACIÓN ====================

  // Verifica si un producto está seleccionado para comparar
  estaSeleccionado(producto: any): boolean {
    return this.productosAComparar.some((p) => p.id === producto.id);
  }

  // Añade o quita un producto de la comparación
  toggleComparar(producto: any) {
    if (this.estaSeleccionado(producto)) {
      this.productosAComparar = this.productosAComparar.filter(
        (p) => p.id !== producto.id
      );
    } else {
      if (this.productosAComparar.length < 2) {
        this.productosAComparar.push(producto);

        // Si ya hay 2 productos, abre el modal automáticamente
        if (this.productosAComparar.length === 2) {
          this.abrirComparadorModal();
        }
      }
    }
  }

  // Limpia la selección de comparación
  limpiarComparacion() {
    this.productosAComparar = [];
  }

  // Abre el modal de comparación
  abrirComparadorModal() {
    const dialogRef = this.dialog.open(ComparadorComponent, {
      width: '700px',
      data: { productos: this.productosAComparar },
    });

    dialogRef.afterClosed().subscribe(() => {
      // Opcional: limpiar selección al cerrar el modal
      // this.limpiarComparacion();
    });
  }

  // ==================== FIN COMPARACIÓN ====================

   // ==================== INCIO LOGOS REDIRECCIONABLES ====================

  supermercados : Record<string, { logo: string; url: string }>  = {
    ahorramas: {logo: 'assets/logos/ahorramas.png', url: 'https://ahorramas.com/'},
    alcampo: {logo: 'assets/logos/alcampo.png', url: 'https://compraonline.alcampo.es'},
    dia: {logo: 'assets/logos/dia.png', url: 'https://dia.es/'}
  };

  getLogo(supermercado?: any): string{
     const key = String(supermercado || '').toLowerCase();
     return this.supermercados[key]?.logo || 'assets/logos/default.png';
    
  }

  getSupermercadoUrl(supermercado?: any): string{
    const key = String(supermercado || '').toLocaleLowerCase();
    return this.supermercados[key]?.url || '';
  }

  // ==================== FIN LOGOS REDIRECCIONABLES ======================

  anadirAlCarrito(p: Producto) {
    alert('Añadido: ' + p.nombre);
  }

  send(texto: string) {
    this.loading = true;
    this.supermercadoSeleccionado = '';
    this.limpiarComparacion(); // Limpia la selección al buscar
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
          this.productosFiltrados = [...this.productos];
          this.extraerSupermercadosUnicos();
          this.calcularPageSizeOptions();
          this.currentPage = 0;
          this.actualizarPaginacion();
          console.log(this.productos);
          this.loading = false;
        }
      },
      error: (err) => console.error(err),
    });
  }

  logOut() {
    this.authService
      .logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        alert('Error al salir: ' + error.message);
      });
    this.productoService.logout().subscribe(() => {});
  }
}

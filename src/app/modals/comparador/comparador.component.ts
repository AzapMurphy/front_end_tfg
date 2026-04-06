import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-comparador',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule],
  templateUrl: './comparador.component.html',
  styleUrl: './comparador.component.css'
})
export class ComparadorComponent {
  constructor(
    public dialogRef: MatDialogRef<ComparadorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productos: any[] }
  ) {}

  cerrar() {
    this.dialogRef.close();
  }

  esMejorPrecio(producto: any): boolean {
    const precios = this.data.productos.map((p) => p.precio);
    const minPrecio = Math.min(...precios);
    return producto.precio === minPrecio;
  }

  getDiferenciaPrecio(): number {
    const precios = this.data.productos.map((p) => p.precio);
    return Math.abs(precios[0] - precios[1]);
  }

  getMejorOpcion(): any {
    return this.data.productos.reduce((prev, curr) =>
      prev.precio < curr.precio ? prev : curr
    );
  }

  // Métodos para verificar si existen campos opcionales
  tieneFormato(): boolean {
    return this.data.productos.some((p) => p.formato);
  }

  tienePrecioPorLitro(): boolean {
    return this.data.productos.some((p) => p.precioPorLitro);
  }

  tieneTipo(): boolean {
    return this.data.productos.some((p) => p.tipo);
  }

  tieneMarca(): boolean {
    return this.data.productos.some((p) => p.marca);
  }
}

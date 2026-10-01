import { Component, ChangeDetectorRef } from '@angular/core';

import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader, 
  IonCardTitle, IonButton,  IonItem, IonSelect, IonSelectOption, IonInput, IonIcon
} from '@ionic/angular';

import { FormsModule } from '@angular/forms';

import { Supabase } from '../supabase';

import { addIcons } from 'ionicons';

import {
  addCircleOutline, listOutline, createOutline,  trashOutline
} from 'ionicons/icons';

interface Movimiento {
  id? : number;
  tipo: string;
  categoria: string;
  valor: number;
  descripcion: string;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [ IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader,
    IonCardTitle, IonButton, IonItem, IonSelect, IonSelectOption, IonInput, IonIcon, FormsModule ]
})

export class Tab2Page {

  mostrarFormulario = false; // CONTROL DEL FORMULARIO

  guardando = false; // BLOQUEA EL BOTÓN MIENTRAS SE GUARDA

  mostrarMovimientos = false; // CONTROL DE LOS MOVIMIENTOS

  mostrarEdicion  = false; // CONTROL formulario de edición

  movimientoEditadoId : number | null = null; // ID del movimiento que se está editando

  actualizado = false; // Bloquear el botón mientras se actualiza

  // DATOS DEL FORMULARIO
  tipo: string = '';
  categoria: string = '';
  valor: number | null = null;
  descripcion: string = '';

  movimientos: Movimiento[] = [];  // LISTA DE MOVIMIENTOS

  //ABIR FORMULARIO DE EDICION
    editarMovimiento(movimiento: Movimiento) {

      this.movimientoEditadoId = movimiento.id ?? null; //Guardar el id por movimiento 

      //cargar datos del movimiento en el formulario
      this.tipo = movimiento.tipo;
      this.categoria = movimiento.categoria;
      this.valor = movimiento.valor;
      this.descripcion = movimiento.descripcion;

      this.mostrarEdicion = true; //mostrar el formulario de edición

      this.mostrarFormulario = false; //ocultar el formulario de registro
      this.mostrarMovimientos = false; //ocultar la lista de movimientos

      this.actualizado = false; //Permite actualizar el movimiento
    }

  constructor(private supabase: Supabase, private cdr: ChangeDetectorRef) {

    // Registrar iconos
    addIcons({
      'add-circle-outline': addCircleOutline,
      'list-outline': listOutline,
      'create': createOutline,
      'trash-outline': trashOutline
    });

  }

  // ABRIR FORMULARIO
  abrirFormulario() {

    this.mostrarFormulario = true;
    this.mostrarMovimientos = false;
    this.guardando = false;
  }

  // CONSULTAR MOVIMIENTOS
  async consultarMovimientos (){

    this.mostrarFormulario = false; //cerrar el formulario de registro 

    try {
      const movimientos = await this.supabase.consultarMovimientos(); //consultar movimientos desde supabase

      this.movimientos = movimientos ?? []; //guardar el resultado en nuestra variable

      this.mostrarMovimientos = true; //mostrar lista

      this.cdr.detectChanges(); //actualiza la pantalla 

    } catch (error) {

      alert ('No se pudieron consultar los movimientos')
      
    }
    
  }

  // GUARDAR MOVIMIENTO
  async guardarMovimiento() {

    // EVITAR UNA SEGUNDA EJECUCIÓN
    if (this.guardando) {

    }

    // VALIDAR CAMPOS
    if (
      !this.tipo ||
      !this.descripcion ||
      this.valor === null ||
      this.valor <= 0 ||
      !this.categoria
    ) {
      alert('Por favor, complete todos los campos correctamente.');

      return;
    }

    // ACTIVAR BLOQUEO
    this.guardando = true;

    // CREAR MOVIMIENTO
    const movimiento = {

      tipo: this.tipo,
      categoria: this.categoria,
      valor: this.valor,
      descripcion: this.descripcion

    };

    try {

      // GUARDAR EN SUPABASE
      await this.supabase.guardarMovimiento(
        movimiento
      );

      // LIMPIAR FORMULARIO
      this.tipo = '';
      this.categoria = '';
      this.valor = null;
      this.descripcion = '';

      // CERRAR FORMULARIO
      this.mostrarFormulario = false;

      this.cdr.detectChanges();//actualiza la pagina inmediatamente 

    } catch (error) {

      alert('No se pudo guardar el movimiento en la base de datos');

    } finally {

      // LIBERAR BLOQUEO
      this.guardando = false;

    }

  }

  // ACTUALIZAR MOVIMIENTO
  async actualizarMovimiento() {

    if(this.actualizado) { return; } // Evitar doble click

    //conprovar id
    if (this.movimientoEditadoId === null) {
      alert('No se ha seleccionado ningun movimiento');
      return;
    }
     
    // VALIDAR CAMPOS
    if (
      !this.tipo ||
      !this.descripcion ||
      this.valor === null ||
      this.valor <= 0 ||
      !this.categoria
    ) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    this.actualizado = true; // Bloquear el botón mientras se actualiza

    const movimiento = {
      tipo: this.tipo, categoria: this.categoria, valor: this.valor, descripcion: this.descripcion
    };

    try {
      // Actualizar en Supabase
      await this.supabase.actualizarMovimiento(this.movimientoEditadoId, movimiento);
      
      // Limpiar formulario
      this.tipo = '';
      this.categoria = '';
      this.valor = null;
      this.descripcion = '';

      this.movimientoEditadoId = null; //limpiar id

      this.mostrarEdicion = false; // Cerrar formulario de edición
      
      await this.consultarMovimientos(); // Refrescar la lista de movimientos

      this.cdr.detectChanges(); // Actualizar la pantalla
    
    } catch (error) {

      console.error('Error actualizando movimiento:', error);
       
      alert('No se pudo actualizar el movimiento en la base de datos');

    } finally {
      this.actualizado = false; // Liberar bloqueo
    }
  }

  // ELIMINAR MOVIMIENTO
  async eliminarMovimiento(movimiento: Movimiento) {

    if (!movimiento.id){
      alert('No se encontro id para eliminar el movimiento');
      return;
    }

    const confirmar = confirm('¿Esta seguro de eliminar este movimiento?');
     
    if (!confirmar) {return;}

    try {await this.supabase.eliminarMovimiento(movimiento.id); //eliminar movimiento en supabase

      await this.consultarMovimientos(); //refrescar la lista de movimientos

      this.cdr.detectChanges(); //actualizar la pantalla

    } catch (error) {

      console.error('Error eliminando movimiento:', error);

      alert('No se pudo eliminar el movimiento en la base de datos');
    }
  }
}
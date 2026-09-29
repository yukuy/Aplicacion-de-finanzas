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

  // DATOS DEL FORMULARIO
  tipo: string = '';
  categoria: string = '';
  valor: number | null = null;
  descripcion: string = '';

  movimientos: Movimiento[] = [];  // LISTA DE MOVIMIENTOS

  constructor(private supabase: Supabase, private cdr: ChangeDetectorRef) {

    // Registrar iconos
    addIcons({
      'add-circle-outline': addCircleOutline,
      'list-outline': listOutline,
      'create-outline': createOutline,
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
}
import { Component } from '@angular/core';

import { IonHeader, IonToolbar, IonTitle, IonContent, 
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton,
   IonItem, IonSelect, IonSelectOption, IonInput, IonIcon } from '@ionic/angular';

import { FormsModule } from '@angular/forms';

import { Supabase } from '../supabase';

import { addIcons } from 'ionicons';

import { 
   addCircleOutline,
  listOutline,
  createOutline,
  trashOutline
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
  imports: [IonHeader, IonToolbar, IonTitle, IonContent,
     IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton,
      IonItem, IonSelect, IonSelectOption, IonInput, IonIcon, FormsModule],})

    export class Tab2Page {
      
      //CONTROL DE FORMULARIOS
      
      //controla si el formulario es visibl  o no
      mostrarFormulario = false;

      //controla silos moviientos son visibles o no 
      mostrarMovimientos = false;

      //datos del forulario 
      tipo: string = '';
      categoria: string = '';
      valor: number | null = null;
      descripcion: string = '';

      //lista se movimientos guardados 
      movimientos: Movimiento[] = [];


      constructor(private supabase: Supabase) {
        
        // Agregar los iconos a la librería de Ionicons
        addIcons({
          'add-circle-outline': addCircleOutline,
          'list-outline': listOutline,
          'create-outline': createOutline,
          'trash-outline': trashOutline
        });
       
      }
      
      //método para abrir el formulario
      abrirFormulario() {
        this.mostrarFormulario = true;
      }

      //consiltar los movimientos guardados
      consultarMovimientos() {

        const movimientosGuardados = localStorage.getItem('movimientos');

        if (movimientosGuardados) {
          this.movimientos = JSON.parse(movimientosGuardados);
          
        } else {
          this.movimientos = [];
        }

        this.mostrarMovimientos = true;

        console.log('Movimientos guardados:', this.movimientos);
      }


      //guardar movimientos 
      async guardarMovimiento() {
        //validar los campos 
        if(
          !this.tipo ||
          !this.descripcion ||
          this.valor === null ||
          this.valor <= 0 ||
          !this.categoria 
        ){
          alert('Por favor, complete todos los campos correctamente.');
          return;
        }

        //crear movimiento 
        const movimiento = {
          tipo: this.tipo,
          categoria: this.categoria,
          valor: this.valor,
          descripcion: this.descripcion
        };

        try {
          //guardar en la base de datos de supabase
          await this.supabase.guardarMovimiento(movimiento);

          console.log('Movimiento guardado en supabase.', movimiento);

          //limpiar formulario 
          this.tipo = '';
          this.categoria = '';
          this.valor = null;
          this.descripcion = '';

          //cerrar formulario
          this.mostrarFormulario = false;

          //mesaje de confirmacion
          ///alert( 'Movimiento guardado correctamente en la base de datos.');

        } catch (error) {
          console.error('Error al guardar:', error);

          alert('No se pudo guardar el movimiento en la base de datos')
        }
        
      }
    }

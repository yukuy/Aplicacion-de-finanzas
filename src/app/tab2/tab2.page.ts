import { Component, ChangeDetectorRef } from '@angular/core';

import { DatePipe } from '@angular/common';

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
  fecha: string;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [ IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader,
    IonCardTitle, IonButton, IonItem, IonSelect, IonSelectOption, IonInput, IonIcon, FormsModule,DatePipe] 
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

  //filtrar movimientos 
  movimientosFiltrados: Movimiento[] = []; // Lista de movimientos filtrados
  //filtros
  filtroTipo: string = 'todos';
  filtroCategoria: string = 'todas';
  filtroDescripcion: string = '';

  //MES SELECCIONADO PARA CONSULTAR MOVIMIENTOS
  mesSeleccionado = '';

  //resumen del mes 
  cantidadRegistrosMes = 0;
  ultimoMovimientoMes: Movimiento | null = null;

  //MES DISPONIBLE
  meses = [
    {valor : '01', nombre: 'Enero'},
    {valor : '02', nombre: 'Febrero'},
    {valor : '03', nombre: 'Marzo'},
    {valor : '04', nombre: 'Abril'},
    {valor : '05', nombre: 'Mayo'},
    {valor : '06', nombre: 'Junio'},
    {valor : '07', nombre: 'Julio'},
    {valor : '08', nombre: 'Agosto'},
    {valor : '09', nombre: 'Septiembre'},
    {valor : '10', nombre: 'Octubre'},
    {valor : '11', nombre: 'Noviembre'},
    {valor : '12', nombre: 'Diciembre'}
  ];

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

    this.seleccionarMesActual(); //selecciona el mes actual al iniciar la app
    this.cargarMovimientosPorMes(); //carga los movimientos del mes actual al iniciar la app

  }

  // ABRIR FORMULARIO
  abrirFormulario() {

    this.mostrarFormulario = true;
    this.mostrarMovimientos = false;
    this.guardando = false;
  }
  
  //SELECCIONAR MES ACTUAL
  seleccionarMesActual() {

    const fecha = new Date();

    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Obtener el mes en formato de dos dígitos

    this.mesSeleccionado = `${año}-${mes}`; // Formato: "YYYY-MM"
  }

  //Cargar movimientos por mes seleccionado 
  async cargarMovimientosPorMes() {

    //comprobar si hay mes seleccionado 
    if (!this.mesSeleccionado){ return; }

    //separar año  y mes 
    const [año, mes] = this.mesSeleccionado.split('-').map(Number);

    //consultar primer dia del mes seleccionado y el primero del siguiente mes 
    const fechaInicio = new Date(año, mes -1, 1);
    const fechaFin = new Date(año, mes, 1);

    try {
      const movimientos = await this.supabase.consultarMovimientosPorMes(fechaInicio.toISOString(),
        fechaFin.toISOString()); //consultar movimientos desde supabase

      //Guardar los movimietos por mes 
      this.movimientos = movimientos ?? [];

      this.cantidadRegistrosMes = movimientos.length; //cantidad de registros del mes

      if (this.movimientos.length > 0) {
        
        //ordenar por fecha el movimieto mas reciente y antiguo
        this.movimientos.sort ((a, b) => 
          new Date(b.fecha).getTime()- new Date(a.fecha).getTime());

        this.ultimoMovimientoMes = this.movimientos[0]; //ultimo movimiento del mes

      } else {

        this.ultimoMovimientoMes = null; //no hay movimientos en el mes seleccionado

      }
      this.cdr.detectChanges(); //actualiza la pantalla

    } catch (error) {

      console.error('Error consultando movimientos por mes:', error);
      
      this.cantidadRegistrosMes = 0; //reiniciar cantidad de registros del mes
      this.ultimoMovimientoMes = null; //reiniciar ultimo movimiento del mes

      alert('No se pudieron consultar los movimientos del mes seleccionado');
    }
  }

  // CONSULTAR MOVIMIENTOS
  async consultarMovimientos (){

   //cerrar formulario de registro 
   this.mostrarFormulario = false;

   //comprobar que exista mes seleccionado
   if (!this.mesSeleccionado){
    alert('No se ha seleccionado ningun mes para consultar los movimientos');
    return;
   }
   //separar año y mes 
   const [año, mes] = this.mesSeleccionado.split('-').map(Number);

   const fechaInicio = new Date(año, mes -1, 1);
   const fechaFin = new Date(año, mes, 1);

   try {

    //consutar los movimientos solo por mes seleccionado 
    const movimientos =
    await this.supabase.consultarMovimientosPorMes(fechaInicio.toISOString(), fechaFin.toISOString());

    //guaradar movintos por mes 
    this.movimientos = movimientos ?? [];

    this.movimientosFiltrados = [...this.movimientos]; //inicializar la lista de movimientos filtrados

    this.mostrarMovimientos = true;

    this.cdr.detectChanges(); //actualiza la pantalla

   } catch (error) {
    
    console.error('Error consultando movimientos:', error);

    alert('No se pudieron consultar los movimientos del mes seleccionado');
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

      //Actualizar la card del mes 
      await this.cargarMovimientosPorMes();

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

      //Actualizar la card del mes 
      await this.cargarMovimientosPorMes();

      this.cdr.detectChanges(); //actualizar la pantalla

    } catch (error) {

      console.error('Error eliminando movimiento:', error);

      alert('No se pudo eliminar el movimiento en la base de datos');
    }
  }

  //aplicar filtros 
  aplicarFiltros() {

    this.movimientosFiltrados = this.movimientos.filter((movimiento) => {
      console.log('movimientos cargados:', JSON.stringify(this.movimientos, null, 2));

      const coincideTipo = this.filtroTipo === 'todos' || movimiento.tipo === this.filtroTipo;
      console.log('filtro tipo', this.filtroTipo);

      const coincideCategoria = this.filtroCategoria === 'todas' || movimiento.categoria === this.filtroCategoria;
      console.log('filtro Categoria:', this.filtroCategoria);

      const descripcionBusqueda = this.filtroDescripcion.trim().toLowerCase();
      console.log('filtro descripcion', this.filtroDescripcion);

      const coincideDescripcion = movimiento.descripcion.toLowerCase().includes(descripcionBusqueda); 
    });

    this.cdr.detectChanges();
  }

  //limpiar filtros
  limpiarFiltros() {

    this.filtroTipo = 'todos';
    this.filtroCategoria = 'todas';
    this.filtroDescripcion = '';
    
    this.movimientosFiltrados = [...this.movimientos]; // Restaurar la lista completa de movimientos

    this.cdr.detectChanges();
  } 

}
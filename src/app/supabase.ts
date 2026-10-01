import { Injectable } from '@angular/core';

import {
  createClient,
  SupabaseClient
} from '@supabase/supabase-js';

import { environment } from '../environments/environment';

export interface MovimientoBD {
  id?: number;
  tipo: string;
  descripcion: string;
  valor: number;
  categoria: string;
  fecha?: string;
}

@Injectable({
  providedIn: 'root'
})
export class Supabase {

  private supabase: SupabaseClient;

  constructor() {

    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

  }

  // GUARDAR MOVIMIENTO
  async guardarMovimiento(movimiento: MovimientoBD) {

    const { data, error } = await this.supabase
      .from('movimientos')
      .insert(movimiento)
      .select()
      .single();

    if (error) {

      console.error(
        'Error guardando movimiento:',
        error
      );

      throw error;
    }

    return data;
  }

  // CONSULTAR MOVIMIENTOS
  async consultarMovimientos() {

    const { data, error } = await this.supabase
      .from('movimientos')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) {

      console.error(
        'Error consultando movimientos:',
        error
      );

      throw error;
    }

    return data;
  }

  //ACTUALIZAR MOVIMIENTO   
  async actualizarMovimiento(id: number, movimiento: MovimientoBD) {

    const { data, error } = await this.supabase
    .from('movimientos')
    .update({
      tipo : movimiento.tipo,
      categoria : movimiento.categoria,
      valor : movimiento.valor,
      descripcion : movimiento.descripcion
    })
    .eq('id', id)
    .select()
    .single();
   
    if (error) {
        
      console.error(' Erro actualizando movimiento:', error);

      throw error;
    }

    return data;

  }
  
  //ELIMINAR MOVIMIENTO
  async eliminarMovimiento(id: number) {

    const { error } = await this.supabase
      .from('movimientos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error eliminando movimiento:', error);
      throw error;
    }
  }
}
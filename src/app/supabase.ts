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

}
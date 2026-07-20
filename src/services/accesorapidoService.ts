// src/services/accesorapidoService.ts
import { supabase } from "../lib/supabase"
import type { AccesoRapido, AccesoRapidoCompleto } from '../types'

export const accesorapidoService = {

    // Trae todos los productos configurados (con nombre y precio ya unidos)
    async getAll(): Promise<AccesoRapidoCompleto[]> {
        const { data, error } = await supabase
            .rpc('buscar_acceso_rapido', { busqueda: '' })

        if (error) throw error
        return data
    },

    // Buscar dentro de los ya configurados (opcional, si algún día quieres filtrar)
    async search(busqueda: string): Promise<AccesoRapidoCompleto[]> {
        const { data, error } = await supabase
            .rpc('buscar_acceso_rapido', { busqueda })

        if (error) throw error
        return data
    },

    // Agregar un producto nuevo al acceso rápido
    async add(idproducto: number): Promise<AccesoRapido> {
        // calcular siguiente posición
        const { data: ultimo } = await supabase
            .from('accesorapido')
            .select('posicion')
            .eq('activo', true)
            .order('posicion', { ascending: false })
            .limit(1)
            .maybeSingle()

        const nextPos = ultimo ? ultimo.posicion + 1 : 0

        const { data, error } = await supabase
            .from('accesorapido')
            .insert({ idproducto, posicion: nextPos, activo: true })
            .select()
            .single()

        if (error) throw error
        return data
    },

    // Quitar (desactivar) un producto del acceso rápido
    async remove(idacceso: number): Promise<void> {
        const { error } = await supabase
            .from('accesorapido')
            .update({ activo: false })
            .eq('idacceso', idacceso)

        if (error) throw error
    },
}
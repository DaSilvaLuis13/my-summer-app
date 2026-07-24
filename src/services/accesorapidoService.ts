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

    async updateOrder(idsOrdenados: number[]): Promise<void> {
        // Creamos una promesa de actualización por cada ID según su nuevo índice (posición)
        const promesas = idsOrdenados.map((idacceso, index) => 
            supabase
                .from('accesorapido')
                .update({ posicion: index })
                .eq('idacceso', idacceso)
        )

        // Ejecutamos todas las peticiones al mismo tiempo
        const resultados = await Promise.all(promesas)

        // Validamos si alguna petición falló
        const error = resultados.find(res => res.error)
        if (error) throw error.error
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
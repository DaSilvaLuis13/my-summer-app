//src/services/productosService.ts
import { supabase } from "../lib/supabase";
import type { Producto, NuevoProducto } from '../types'

export const productosService = {

    async create(producto: NuevoProducto): Promise<Producto> {
        const { data, error } = await supabase
            .from('productos')
            .insert(producto)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async update(id: number, producto: NuevoProducto): Promise<Producto> {
        const { data, error } = await supabase
            .from('productos')
            .update(producto)
            .eq('idproducto', id)
            .select()
            .single()

            if (error) throw error
            return data
    },

    async search(busqueda: string): Promise<Producto[]> {
        const { data, error } = await supabase
            .rpc('buscar_productos', { busqueda })

        if (error) throw error
        return data
    },

    async getAll(): Promise<Producto[]> {
        const { data, error } = await supabase
            .rpc('buscar_productos', { busqueda: '' })

        if (error) throw error
        return data
    },

    async getById(id: number): Promise<Producto> {
        const { data, error } = await supabase
            .from('productos')
            .select('*')
            .eq('idproducto', id)
            .single()

        if (error) throw error
        return data
    },

    async deactivate(id: number): Promise<void> {
        const { error } = await supabase
            .from('productos')
            .update({ Activo: false })
            .eq('idproducto', id)
            

        if (error) throw error
    }
}
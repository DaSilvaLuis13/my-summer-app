//src/services/proveedoresService.ts

import { supabase } from "../lib/supabase";
import type { Proveedor, NuevoProveedor } from '../types'

export const proveedoresService = {

    async create(proveedor: NuevoProveedor): Promise<Proveedor> {
        const { data, error } = await supabase
            .from('proveedores')
            .insert(proveedor)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async update(id: number, proveedor: NuevoProveedor): Promise<NuevoProveedor> {
        const { data, error } = await supabase
            .from('proveedores')
            .update(proveedor)
            .eq('idproveedor', id)
            .select()
            .single()

            if (error) throw error
            return data
    },

    async search(busqueda: string): Promise<Proveedor[]> {
        const { data, error } = await supabase
            .rpc('buscar_proveedores', { busqueda })

        if (error) throw error
        return data
    },

    async getAll(): Promise<Proveedor[]> {
        const { data, error } = await supabase
            .rpc('buscar_proveedores', { busqueda: '' })

        if (error) throw error
        return data
    },

    async getById(id: number): Promise<Proveedor> {
        const { data, error } = await supabase
            .from('proveedores')
            .select('*')
            .eq('idproveedor', id)
            .single()

        if (error) throw error
        return data
    },

    async deactivate(id: number): Promise<void> {
        const { error } = await supabase
            .from('proveedores')
            .update({ Activo: false })
            .eq('idproveedor', id)
            

        if (error) throw error
    }
}
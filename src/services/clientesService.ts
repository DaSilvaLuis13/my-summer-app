//src/services/clientesService.ts
import { supabase } from "../lib/supabase";
import type { Cliente, NuevoCliente } from '../types'

export const clientesService = {

    async create(cliente: NuevoCliente): Promise<Cliente> {
        const { data, error } = await supabase
            .from('clientes')
            .insert(cliente)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async update(id: number, cliente: NuevoCliente): Promise<Cliente> {
        const { data, error } = await supabase
            .from('clientes')
            .update(cliente)
            .eq('idcliente', id)
            .select()
            .single()

            if (error) throw error
            return data
    },

    async search(busqueda: string): Promise<Cliente[]> {
        const { data, error } = await supabase
            .rpc('buscar_clientes', { busqueda })

        if (error) throw error
        return data
    },

    async getAll(): Promise<Cliente[]> {
        const { data, error } = await supabase
            .rpc('buscar_clientes', { busqueda: '' })

        if (error) throw error
        return data
    },

    async getById(id: number): Promise<Cliente> {
        const { data, error } = await supabase
            .from('clientes')
            .select('*')
            .eq('idcliente', id)
            .single()

        if (error) throw error
        return data
    },

    async deactivate(id: number): Promise<void> {
        const { error } = await supabase
            .from('clientes')
            .update({ Activo: false })
            .eq('idcliente', id)
            

        if (error) throw error
    }
}
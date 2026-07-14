// ============================================================
//  SisInVe — Interfaces TypeScript
//  Espejo exacto de las tablas en Supabase (Todo en minúsculas)
// ============================================================

// ------------------------------------------------------------
//  Roles y Usuarios
// ------------------------------------------------------------

export interface Rol {
  idrol:       number
  nombre:      'admin' | 'cajero' | 'almacen'
  descripcion: string | null
}

export interface Usuario {
  idusuario:  number
  nombre:     string
  usuario:    string
  contrasena: string        // nunca exponer en el frontend, solo el backend
  idrol:      number
  activo:     boolean
  creadoen:   string
}

// versión segura para usar en el frontend (sin contraseña)
export interface UsuarioPublico {
  idusuario: number
  nombre:    string
  usuario:   string
  idrol:     number
  rol:       Rol
  activo:    boolean
  creadoen:  string
}

// ------------------------------------------------------------
//  Clientes
// ------------------------------------------------------------

export interface Cliente {
  idcliente:         number
  nombre:            string
  apellidopaterno:   string
  apellidomaterno:   string | null
  domicilio:         string | null
  telefono:          string | null
  limitecredito:     number | string
  creditodisponible: number | string
  activo:            boolean
  creadoen:          string
}

// ------------------------------------------------------------
//  Proveedores
// ------------------------------------------------------------

export interface Proveedor {
  idproveedor: number
  nombre:      string
  telefono:    string | null
  direccion:   string | null
  activo:      boolean
}

// ------------------------------------------------------------
//  Catálogo
// ------------------------------------------------------------

export interface Departamento {
  iddepartamento: number
  nombre:         string
  descripcion:    string | null
}

export interface Producto {
  idproducto:     number
  iddepartamento: number
  idproveedor:    number | null
  nombre:         string
  codigobarras:   string | null
  costo:          number
  ganancia:       number
  precio:         number
  unidadmedida:   string | null
  stockminimo:    number
  stockmaximo:    number
  stockactual:    number
  activo:         boolean
}

// versión enriquecida con joins (útil para mostrar en tablas)
export interface ProductoCompleto extends Producto {
  departamento: Departamento
  proveedor:    Proveedor | null
}

// ------------------------------------------------------------
//  Caja
// ------------------------------------------------------------

export type EstadoCaja = 'abierta' | 'cerrada'

export interface Caja {
  idcaja:       number
  idusuario:    number
  fecha:        string
  horaabertura: string
  horacierre:   string | null
  montoinicial: number
  montofinal:   number | null
  estado:       EstadoCaja
}

// ------------------------------------------------------------
//  Ventas
// ------------------------------------------------------------

export type MetodoCobro = 'efectivo' | 'tarjeta' | 'fiado'
export type EstadoVenta = 'completada' | 'cancelada' | 'devuelta_parcial'

export interface Venta {
  idventa:     number
  idusuario:   number
  idcaja:      number
  idcliente:   number | null
  fecha:       string
  hora:        string
  subtotal:    number
  descuento:   number
  iva:         number
  total:       number
  metodocobro: MetodoCobro
  pagado:      number
  cambio:      number
  estado:      EstadoVenta
}

export interface DetalleVenta {
  idventa:        number
  idproducto:     number
  cantidad:       number
  preciounitario: number
  descuento:      number
  importe:        number
}

// versión enriquecida para la pantalla de ventas
export interface DetalleVentaCompleto extends DetalleVenta {
  producto: Producto
}

// lo que vive en el carrito antes de confirmar la venta
export interface ItemCarrito {
  producto:       Producto
  cantidad:       number
  preciounitario: number
  descuento:      number
  importe:        number
}

// ------------------------------------------------------------
//  Devoluciones
// ------------------------------------------------------------

export type MotivoDevolucion = 'dañado' | 'cambio' | 'no_deseado' | 'otro'
export type EstadoDevolucion = 'pendiente' | 'aprobada' | 'rechazada'

export interface Devolucion {
  iddevolucion:   number
  idventa:        number
  idusuario:      number
  idcaja:         number
  fecha:          string
  hora:           string
  motivo:         MotivoDevolucion
  notas:          string | null
  totalreembolso: number
  estado:         EstadoDevolucion
}

export interface DetalleDevolucion {
  iddevolucion:   number
  idproducto:     number
  cantidad:       number
  preciounitario: number
  importe:        number
}

// ------------------------------------------------------------
//  Inventario — Entradas
// ------------------------------------------------------------

export type CondicionEntrada = 'contado' | 'credito'

export interface Entrada {
  identrada:    number
  idproveedor:  number
  idcaja:       number
  fecha:        string
  fechacredito: string | null
  saldo:        number
  condicion:    CondicionEntrada
  total:        number
}

export interface DetalleEntrada {
  identrada:  number
  idproducto: number
  cantidad:   number
  costo:      number
}

export interface PagoProveedor {
  idpago:    number
  identrada: number
  fecha:     string
  importe:   number
}

// ------------------------------------------------------------
//  Mermas
// ------------------------------------------------------------

export interface Merma {
  idmerma:   number
  idusuario: number
  fecha:     string
}

export interface DetalleMerma {
  idmerma:     number
  idproducto:  number
  cantidad:    number
  descripcion: string | null
}

// ------------------------------------------------------------
//  Gastos Varios
// ------------------------------------------------------------

export interface CategoriaGasto {
  idcategoriagasto: number
  descripcion:      string
}

export interface GastoVario {
  idgasto:           number
  idcategoriagasto:  number
  idusuario:         number
  idcaja:            number
  fecha:             string
  importe:           number
  descripcion:       string | null
}

// ------------------------------------------------------------
//  Tipos utilitarios generales
// ------------------------------------------------------------

// para formularios de alta/edición (sin los IDs autogenerados ni fechas por defecto)
export type NuevoProducto  = Omit<Producto,   'idproducto'>
export type NuevoCliente   = Omit<Cliente,    'idcliente'   | 'creadoen'>
export type NuevoProveedor = Omit<Proveedor,  'idproveedor'>
export type NuevaVenta     = Omit<Venta,      'idventa'>
export type NuevaDevolucion = Omit<Devolucion, 'iddevolucion'>
export type NuevaEntrada   = Omit<Entrada,    'identrada'>
export type NuevaMerma     = Omit<Merma,      'idmerma'>
export type NuevoGasto     = Omit<GastoVario, 'idgasto'>

// respuesta paginada genérica para listas
export interface PaginatedResponse<T> {
  data:  T[]
  total: number
  page:  number
  limit: number
}
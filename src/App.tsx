import { Routes, Route} from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { ClientesPage } from './pages/catalogos/ClientesPage'
import { UsuariosPage } from './pages/catalogos/UsuariosPage'
import { VentasPage } from './pages/ventas/VentasPage'
import { ProveedorPage } from './pages/catalogos/ProveedorPage'
import { ProductosPage } from './pages/catalogos/ProductosPage'
import { RolesPage } from './pages/catalogos/RolesPage'
import { DepartamentosPage } from './pages/catalogos/DepartamentosPage'
import { ClientesListPage } from './pages/consultas/ClientesListPage'
import { ProductosListPage } from './pages/consultas/ProductosListPage'
import { ProveedorListPage } from './pages/consultas/ProveedoresListPage'
import { AccesoRapido } from './pages/secciones/AccesoRapido'


function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path='/' element={<VentasPage />} />
        <Route path='/catalogos/clientes' element={<ClientesPage />} />
        <Route path='/catalogos/usuarios' element={<UsuariosPage />} />
        <Route path='/catalogos/proveedores' element={<ProveedorPage />} />
        <Route path='/catalogos/productos' element={<ProductosPage />} />
        <Route path='/catalogos/roles' element={<RolesPage />} />
        <Route path='/catalogos/departamentos' element={<DepartamentosPage />} />




        <Route path='/consultas/clientes' element={<ClientesListPage />} />
        <Route path='/consultas/productos' element={<ProductosListPage />} />
        <Route path='/consultas/proveedores' element={<ProveedorListPage />} />


        <Route path='/secciones/accesorapido' element={<AccesoRapido />} />
      </Route>
    </Routes>
  )
}

export default App
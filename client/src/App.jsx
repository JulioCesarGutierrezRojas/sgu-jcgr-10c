import { useState, useEffect } from 'react'
import './App.css'
import { userService } from './services/userService'

function App() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    numeroTelefono: ''
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await userService.getAllUsers()
      setUsers(data)
    } catch (err) {
      setError('Error al cargar los usuarios. Asegúrate de que el servidor esté corriendo.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, formData)
      } else {
        await userService.createUser(formData)
      }
      await loadUsers()
      resetForm()
    } catch (err) {
      setError(editingUser ? 'Error al actualizar usuario' : 'Error al crear usuario')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      nombreCompleto: user.nombreCompleto,
      email: user.email,
      numeroTelefono: user.numeroTelefono
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return

    setLoading(true)
    setError(null)
    try {
      await userService.deleteUser(id)
      await loadUsers()
    } catch (err) {
      setError('Error al eliminar usuario')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      nombreCompleto: '',
      email: '',
      numeroTelefono: ''
    })
    setEditingUser(null)
    setShowForm(false)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Gestión de Usuarios</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          {showForm ? 'Cancelar' : 'Nuevo Usuario'}
        </button>
      </header>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {showForm && (
        <div className="form-container">
          <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombreCompleto">Nombre Completo *</label>
              <input
                type="text"
                id="nombreCompleto"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleInputChange}
                required
                placeholder="Ingrese el nombre completo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="numeroTelefono">Número de Teléfono</label>
              <input
                type="tel"
                id="numeroTelefono"
                name="numeroTelefono"
                value={formData.numeroTelefono}
                onChange={handleInputChange}
                placeholder="123456789"
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? 'Guardando...' : editingUser ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="users-container">
        <h2>Lista de Usuarios</h2>
        {loading && <p className="loading">Cargando...</p>}

        {!loading && users.length === 0 ? (
          <p className="no-data">No hay usuarios registrados</p>
        ) : (
          <div className="table-responsive">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre Completo</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td data-label="ID">{user.id}</td>
                    <td data-label="Nombre">{user.nombreCompleto}</td>
                    <td data-label="Email">{user.email}</td>
                    <td data-label="Teléfono">{user.numeroTelefono || 'N/A'}</td>
                    <td data-label="Acciones">
                      <div className="action-buttons">
                        <button
                          className="btn btn-edit"
                          onClick={() => handleEdit(user)}
                          disabled={loading}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(user.id)}
                          disabled={loading}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

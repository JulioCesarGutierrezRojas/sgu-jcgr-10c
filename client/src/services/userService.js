const ENV = import.meta.env

const API_URL = `http://${ENV.VITE_API_HOST}:${ENV.VITE_API_PORT}${ENV.VITE_API_BASE_URL}/users`

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        throw new Error('Usuario no encontrado');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  createUser: async (user) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error('Error al crear usuario');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  updateUser: async (id, user) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar usuario');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar usuario');
      }
      return true;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
};

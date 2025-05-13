import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [recetas, setRecetas] = useState([]);
  const [form, setForm] = useState({
    titulo: '',
    ingredientes: '',
    instrucciones: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

  // Obtener recetas
  const fetchRecetas = () => {
    axios.get('http://localhost:5000/api/recetas')
      .then(res => setRecetas(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchRecetas();
  }, []);

  // Manejar cambios en inputs del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Enviar nueva receta
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/recetas', form)
      .then(res => {
        setRecetas([...recetas, res.data]);
        setForm({ titulo: '', ingredientes: '', instrucciones: '' });
      })
      .catch(err => console.error(err));
  };

  // Manejar búsqueda
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === '') {
      fetchRecetas();
    } else {
      axios.get(`http://localhost:5000/api/recetas/buscar?query=${value}`)
        .then(res => setRecetas(res.data))
        .catch(err => console.error(err));
    }
  };

  // Manejar favoritos
  const toggleFavorito = (receta) => {
    if (favoritos.find(f => f._id === receta._id)) {
      setFavoritos(favoritos.filter(f => f._id !== receta._id));
    } else {
      setFavoritos([...favoritos, receta]);
    }
  };

  const recetasAMostrar = mostrarFavoritos ? favoritos : recetas;

  return (
    <div style={{ display: 'flex', fontFamily: 'sans-serif' }}>
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1>Recetas</h1>

        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <input name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} required /><br />
          <textarea name="ingredientes" placeholder="Ingredientes" value={form.ingredientes} onChange={handleChange} required /><br />
          <textarea name="instrucciones" placeholder="Instrucciones" value={form.instrucciones} onChange={handleChange} required /><br />
          <button type="submit">Agregar receta</button>
        </form>

        <button onClick={() => setMostrarFavoritos(!mostrarFavoritos)}>
          {mostrarFavoritos ? 'Mostrar todas' : 'Mostrar favoritos'}
        </button>

        <ul>
          {recetasAMostrar.map((receta) => (
            <li key={receta._id}>
              <h3>{receta.titulo}</h3>
              <p><strong>Ingredientes:</strong> {receta.ingredientes}</p>
              <p><strong>Instrucciones:</strong> {receta.instrucciones}</p>
              <button onClick={() => toggleFavorito(receta)}>
                {favoritos.find(f => f._id === receta._id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              </button>
              <hr />
            </li>
          ))}
        </ul>
      </div>

      <div style={{ width: '250px', padding: '2rem', background: '#f9f9f9' }}>
        <h2>Buscar recetas</h2>
        <input
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={handleSearch}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>
    </div>
  );
}

export default App;

// UpdateCours.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateCours() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    matiere: '',
    datedebut: '',
    datefin: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Use useCallback to define fetchCours with a stable reference
  const fetchCours = useCallback(async () => {
    try {
      const res = await fetch(`/api/cours/${id}`);
      if (!res.ok) throw new Error('Erreur lors de la récupération du cours');
      const data = await res.json();
      const datedebut = new Date(data.datedebut).toISOString().split('T')[0];
      const datefin = new Date(data.datefin).toISOString().split('T')[0];
      setFormData({
        id: data.id || '',
        name: data.name || '',
        matiere: data.matiere || '',
        datedebut,
        datefin,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCours();
  }, [fetchCours]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/cours/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Erreur lors de la mise à jour du cours');
      navigate('/cours');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Modifier le Cours</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID:</label>
          <input type="number" name="id" value={formData.id} onChange={handleChange} required />
        </div>
        <div>
          <label>Nom:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Matière (ID):</label>
          <input type="text" name="matiere" value={formData.matiere} onChange={handleChange} required />
        </div>
        <div>
          <label>Date début:</label>
          <input type="date" name="datedebut" value={formData.datedebut} onChange={handleChange} required />
        </div>
        <div>
          <label>Date fin:</label>
          <input type="date" name="datefin" value={formData.datefin} onChange={handleChange} required />
        </div>
        <button type="submit">Mettre à jour le cours</button>
      </form>
    </div>
  );
}

export default UpdateCours;

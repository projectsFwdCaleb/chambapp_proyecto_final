import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { FaUsers, FaBriefcase, FaClipboardList, FaStar } from 'react-icons/fa';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://127.0.0.1:8000/api/admin/dashboard-stats/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error('Error fetching stats');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="dashboard-loading">Cargando estadísticas...</div>;
  if (!stats) return <div className="dashboard-error">No se pudieron cargar los datos.</div>;

  // Colores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="admin-dashboard-container">
      <header className="dashboard-header">
        <h1>Panel de Administración</h1>
        <p>Vista general del rendimiento de ChambApp</p>
      </header>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon icon-users"><FaUsers /></div>
          <div className="kpi-info">
            <h3>Usuarios Totales</h3>
            <p>{stats.kpis.total_usuarios}</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon icon-requests"><FaClipboardList /></div>
          <div className="kpi-info">
            <h3>Solicitudes Activas</h3>
            <p>{stats.kpis.solicitudes_activas}</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon icon-services"><FaBriefcase /></div>
          <div className="kpi-info">
            <h3>Servicios Ofertados</h3>
            <p>{stats.kpis.total_servicios}</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon icon-reviews"><FaStar /></div>
          <div className="kpi-info">
            <h3>Reseñas Totales</h3>
            <p>{stats.kpis.total_resenhas}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">

        {/* Demanda por Categoría */}
        <div className="chart-card">
          <h3>Demanda por Categoría (Solicitudes)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.graficos.demanda_categoria}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria__nombre" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#8884d8" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Oferta por Categoría */}
        <div className="chart-card">
          <h3>Oferta por Categoría (Servicios)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.graficos.oferta_categoria}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="total"
              >
                {stats.graficos.oferta_categoria.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Crecimiento de Usuarios */}
        <div className="chart-card full-width">
          <h3>Crecimiento de Usuarios</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.graficos.crecimiento_usuarios}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="mes"
                tickFormatter={(str) => new Date(str).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
              />
              <YAxis />
              <Tooltip labelFormatter={(str) => new Date(str).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} />
              <Area type="monotone" dataKey="total" stroke="#82ca9d" fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Cantones */}
        <div className="chart-card">
          <h3>Top Cantones con más Actividad</h3>
          <ul className="top-cantones-list">
            {stats.geo.top_cantones.map((canton, index) => (
              <li key={index} className="canton-item">
                <span className="canton-rank">#{index + 1}</span>
                <span className="canton-name">{canton.canton_provincia__nombre}</span>
                <span className="canton-total">{canton.total} solicitudes</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
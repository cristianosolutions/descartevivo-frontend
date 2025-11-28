import { useEffect, useState } from 'react';
import api from '../api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function DashboardPage() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/api/dashboard/summary')
      .then(res => setSummary(res.data))
      .catch(err => {
        console.error('Erro ao carregar dashboard', err);
        alert('Erro ao carregar dashboard.');
      });
  }, []);

  if (!summary) {
    return <p>Carregando...</p>;
  }

  const chartData = {
    labels: summary.byType.map(t => t.name),
    datasets: [
      {
        label: '(Kg) por tipo de resíduo',
        data: summary.byType.map(t => t.total_kg),
        backgroundColor: ["#FFA500", "#FFFF00", "#800000", "#3498db", "#FF0000", "#0f9748ff", "#e74c3c", "#2af10bff", "#e2154fff", "#171c1166"]
      }
    ]
  };

  return (
    <div>
      <h2 className="mb-3">Dashboard</h2>

      <div className="row mb-4">
        <div className="col-12 col-md-3 mb-3">
          <div className="card text-center h-100 bg-primary bg-gradient text-white">
            <div className="card-body">
              <h5 className="card-title">Usuários</h5>
              <p className="display-6 fw-bold">{summary.totals.users}</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3 mb-3">
          <div className="card text-center h-100 bg-success bg-gradient text-white">
            <div className="card-body">
              <h5 className="card-title">Pontos de Coleta</h5>
              <p className="display-6 fw-bold">{summary.totals.points}</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3 mb-3">
          <div className="card text-center h-100 bg-info bg-gradient text-white">
            <div className="card-body">
              <h5 className="card-title">Entregas</h5>
              <p className="display-6 fw-bold">{summary.totals.deliveries}</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3 mb-3">
          <div className="card text-center h-100 bg-secondary bg- text-white">
            <div className="card-body">
              <h5 className="card-title">Total Reciclado (kg)</h5>
              <p className="display-6 fw-bold">{summary.totals.totalKg.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">Distribuição por tipo de resíduo (kg)</h5>
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

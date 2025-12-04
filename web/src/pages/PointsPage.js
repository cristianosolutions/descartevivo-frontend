import { useEffect, useState } from 'react';
import api from '../api';

function PointsPage() {
  const [points, setPoints] = useState([]);
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    neighborhood: ''
  });

  // Estados para edição
  const [editPoint, setEditPoint] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadPoints = () => {
    api.get('/api/points')
      .then(res => setPoints(res.data))
      .catch(err => {
        console.error('Erro ao carregar pontos de coletas', err);
        alert('Erro ao carregar pontos de coletas. Veja o console.');
      });
  };

  useEffect(() => {
    loadPoints();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/api/points', form)
      .then(() => {
        alert('Ponto de coleta cadastrado com sucesso!');
        setForm({ name: '', address: '', city: '', state: '', neighborhood: '' });
        loadPoints();
      })
      .catch(err => {
        console.error('Erro ao cadastrar ponto de coletas', err);
        alert('Erro ao cadastrar ponto de coletas. Veja o console.');
      });
  };

  // Abrir modal de edição
  const openEditModal = (point) => {
    setEditPoint(point);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditPoint(null);
  };

  // PUT atualizar ponto
  const handleUpdate = (e) => {
    e.preventDefault();

    api.put(`/api/points/${editPoint.id}`, editPoint)
      .then(() => {
        alert("Ponto de coleta atualizado com sucesso!");
        closeModal();
        loadPoints();
      })
      .catch(err => {
        alert("Erro ao atualizar ponto de coleta");
        console.error(err);
      });
  };

  return (
    <div>
      <h2 className="mb-3">Pontos de Coleta</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Cadastrar novo ponto</h5>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Nome</label>
              <input
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-5">
              <label className="form-label">Cidade</label>
              <input
                className="form-control"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-1">
              <label className="form-label">UF</label>
              <input
                className="form-control"
                name="state"
                value={form.state}
                onChange={(e) => setForm(prev => ({
                  ...prev,
                  state: e.target.value.toUpperCase().slice(0, 2)
                }))}
                maxLength={2}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Endereço</label>
              <input
                className="form-control"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Bairro</label>
              <input
                className="form-control"
                name="neighborhood"
                value={form.neighborhood}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-success">
                Salvar ponto
              </button>
            </div>
          </form>
        </div>
      </div>

      <button
        className="btn btn-primary mb-3"
        onClick={() => window.open("http://localhost:3001/api/reports/points")}
      >
        Exportar PDF
      </button>

      <h5 className="mb-3">Pontos cadastrados</h5>
      <div className="row">
        {points.map((p) => (
          <div key={p.id} className="col-12 col-md-6 col-lg-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.address}</p>
                <p className="card-text">
                  <small className="text-muted">
                    {p.city} {p.neighborhood ? ` - ${p.neighborhood}` : ''} ({p.state})
                  </small>
                </p>

                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => openEditModal(p)}
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}

        {points.length === 0 && <p>Nenhum ponto cadastrado ainda.</p>}
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Editar Ponto de Coleta</h5>
                <button className="btn-close" onClick={closeModal} />
              </div>

              <form onSubmit={handleUpdate}>
                <div className="modal-body">

                  <label className="form-label">Nome</label>
                  <input className="form-control mb-2"
                    value={editPoint?.name}
                    onChange={e => setEditPoint({ ...editPoint, name: e.target.value })}
                    required
                  />

                  <label className="form-label">Endereço</label>
                  <input className="form-control mb-2"
                    value={editPoint?.address}
                    onChange={e => setEditPoint({ ...editPoint, address: e.target.value })}
                    required
                  />

                  <label className="form-label">Cidade</label>
                  <input className="form-control mb-2"
                    value={editPoint?.city}
                    onChange={e => setEditPoint({ ...editPoint, city: e.target.value })}
                    required
                  />

                  <label className="form-label">Bairro</label>
                  <input className="form-control mb-2"
                    value={editPoint?.neighborhood}
                    onChange={e => setEditPoint({ ...editPoint, neighborhood: e.target.value })}
                  />

                  <label className="form-label">UF</label>
                  <input className="form-control mb-2"
                    value={editPoint?.state}
                    onChange={e =>
                      setEditPoint({ ...editPoint, state: e.target.value.toUpperCase().slice(0, 2) })
                    }
                    required
                  />

                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    Salvar alterações
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PointsPage;

/*import { useEffect, useState } from 'react';
import api from '../api';

function PointsPage() {
  const [points, setPoints] = useState([]);
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    neighborhood: ''
  });

  const loadPoints = () => {
    api.get('/api/points')
      .then(res => setPoints(res.data))
      .catch(err => {
        console.error('Erro ao carregar pontos', err);
        alert('Erro ao carregar pontos. Veja o console.');
      });
  };

  useEffect(() => {
    loadPoints();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/api/points', form)
      .then(() => {
        alert('Ponto cadastrado com sucesso!');
        setForm({ name: '', address: '', city: '', state: '', neighborhood: '' });
        loadPoints();
      })
      .catch(err => {
        console.error('Erro ao cadastrar ponto', err);
        alert('Erro ao cadastrar ponto. Veja o console.');
      });
  };

  return (
    <div>
      <h2 className="mb-3">Pontos de Coleta</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Cadastrar novo ponto</h5>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Nome</label>
              <input
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12 col-md-5">
              <label className="form-label">Cidade</label>
              <input
                className="form-control"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>
            < div className="col-12 col-md-1">
              <label className="form-label">UF</label>
              <input
                className="form-control"
                name="state"
                value={form.state}
                onChange={(e) => setForm(prev => ({ ...prev, state: e.target.value.toUpperCase().slice(0, 2) }))}
                maxLength={2}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">Endereço</label>
              <input
                className="form-control"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Bairro</label>
              <input
                className="form-control"
                name="neighborhood"
                value={form.neighborhood}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-success">
                Salvar ponto
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <button className="btn btn-primary mb-3"
        onClick={() => window.open("http://localhost:3001/api/reports/points")}
      >
        Exportar PDF
      </button>

      <h5 className="mb-3">Pontos cadastrados</h5>
      <div className="row">
        {points.map((p) => (
          <div key={p.id} className="col-12 col-md-6 col-lg-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.address}</p>
                <p className="card-text">
                  <small className="text-muted">
                    {p.city}{p.neighborhood ? ` - ${p.neighborhood}` : ''}
                  </small>
                </p>
              </div>
            </div>
          </div>
        ))}
        {points.length === 0 && (
          <p>Nenhum ponto cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}

export default PointsPage;*/

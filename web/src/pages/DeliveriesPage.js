// frontend/src/pages/DeliveriesPage.js
import { useEffect, useState } from 'react';
import api from '../api';

function DeliveriesPage() {
  const [users, setUsers] = useState([]);
  const [points, setPoints] = useState([]);
  const [wasteTypes, setWasteTypes] = useState([]);
  const [deliveries, setDeliveries] = useState([]);

  const [form, setForm] = useState({
    user_id: '',
    collection_point_id: '',
    waste_type_id: '',
    quantity_kg: ''
  });

  const [items, setItems] = useState([]);

  const loadData = () => {
    api.get('/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Erro ao carregar usuários', err));

    api.get('/api/points')
      .then(res => setPoints(res.data))
      .catch(err => console.error('Erro ao carregar pontos de coletas', err));

    api.get('/api/waste-types')
      .then(res => setWasteTypes(res.data))
      .catch(err => console.error('Erro ao carregar tipos de resíduos', err));

    api.get('/api/deliveries')
      .then(res => setDeliveries(res.data))
      .catch(err => console.error('Erro ao carregar entregas', err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addItem = () => {
    if (!form.waste_type_id || !form.quantity_kg) {
      return alert('Escolha tipo e quantidade.');
    }

    const selected = wasteTypes.find(w => w.id === form.waste_type_id);
    if (!selected) {
      return alert('Tipo de resíduo inválido.');
    }

    setItems(prev => [
      ...prev,
      {
        waste_type_id: form.waste_type_id,
        name: selected.name,
        quantity_kg: form.quantity_kg
      }
    ]);

    setForm(prev => ({ ...prev, waste_type_id: '', quantity_kg: '' }));
  };

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.user_id || !form.collection_point_id || items.length === 0) {
      return alert('Preencha usuário, ponto de coleta e adicione pelo menos um resíduo.');
    }

    api.post('/api/deliveries', {
      user_id: form.user_id,
      collection_point_id: form.collection_point_id,
      items
    })
      .then(() => {
        alert('Entrega registrada com sucesso!');
        setItems([]);
        setForm({
          user_id: '',
          collection_point_id: '',
          waste_type_id: '',
          quantity_kg: ''
        });
        loadData();
      })
      .catch(err => {
        console.error('Erro ao registrar entrega', err);
        alert('Erro ao registrar entrega. Veja o console.');
      });
  };

  return (
    <div>
      <h2 className="mb-3">Entregas de Resíduos</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Registrar nova entrega</h5>

          <form onSubmit={handleSubmit} className="row g-3">
            {/* Usuário */}
            <div className="col-12 col-md-4">
              <label className="form-label">Usuário</label>
              <select
                className="form-select"
                name="user_id"
                value={form.user_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            {/* Ponto de Coleta */}
            <div className="col-12 col-md-4">
              <label className="form-label">Ponto de Coleta</label>
              <select
                className="form-select"
                name="collection_point_id"
                value={form.collection_point_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                {points.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Tipo de Resíduo */}
            <div className="col-12 col-md-3">
              <label className="form-label">Tipo de Resíduo</label>
              <select
                className="form-select"
                name="waste_type_id"
                value={form.waste_type_id}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                {wasteTypes.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            {/* Quantidade */}
            <div className="col-12 col-md-2">
              <label className="form-label">Quantidade (kg)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                name="quantity_kg"
                value={form.quantity_kg}
                onChange={handleChange}
              />
            </div>

            {/* Botão adicionar item */}
            <div className="col-12 col-md-3 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={addItem}
              >
                Adicionar item
              </button>
            </div>

            {/* Tabela de itens adicionados */}
            {items.length > 0 && (
              <div className="col-12">
                <h6>Itens da entrega</h6>
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Quantidade (kg)</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.quantity_kg}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => removeItem(index)}
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Botão registrar entrega */}
            <div className="col-12">
              <button type="submit" className="btn btn-success">
                Registrar entrega
              </button>
            </div>
          </form>
        </div>
      </div>
            
      <button className="btn btn-primary mb-3"
        onClick={() => window.open("http://localhost:3001/api/reports/deliveries")}
      >
        Exportar PDF
      </button>

      {/* Lista de entregas registradas */}
      <h5 className="mb-3">Entregas registradas</h5>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Usuario</th>
            <th>Ponto de Coleta</th>
            <th>Data</th>
            <th>Total (kg)</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((d, index) => (
            <tr key={d.id}>
              <td>{index + 1}</td>
              <td>{d.user_name}</td>
              <td>{d.point_name}</td>
              <td>{new Date(d.created_at).toLocaleString()}</td>
              <td>{parseFloat(d.total_kg).toFixed(2)}</td>
            </tr>
          ))}
          {deliveries.length === 0 && (
            <tr>
              <td colSpan="5">Nenhuma entrega registrada ainda.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DeliveriesPage;

// frontend/src/pages/DeliveriesPage.js
/*import { useEffect, useState } from 'react';
import api from '../api';

function DeliveriesPage() {
  const [users, setUsers] = useState([]);
  const [points, setPoints] = useState([]);
  const [wasteTypes, setWasteTypes] = useState([]);
  const [deliveries, setDeliveries] = useState([]);

  const [form, setForm] = useState({
    user_id: '',
    collection_point_id: '',
    waste_type_id: '',
    quantity_kg: ''
  });

  const [items, setItems] = useState([]);

  const loadData = () => {
    api.get('/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Erro ao carregar usuários', err));

    api.get('/api/points')
      .then(res => setPoints(res.data))
      .catch(err => console.error('Erro ao carregar pontos', err));

    api.get('/api/waste-types')
      .then(res => setWasteTypes(res.data))
      .catch(err => console.error('Erro ao carregar tipos de resíduos', err));

    api.get('/api/deliveries')
      .then(res => setDeliveries(res.data))
      .catch(err => console.error('Erro ao carregar entregas', err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addItem = () => {
    if (!form.waste_type_id || !form.quantity_kg) {
      return alert('Escolha tipo e quantidade.');
    }

    const selected = wasteTypes.find(w => w.id == form.waste_type_id);
    if (!selected) {
      return alert('Tipo de resíduo inválido.');
    }

    setItems(prev => [
      ...prev,
      {
        waste_type_id: form.waste_type_id,
        name: selected.name,
        quantity_kg: form.quantity_kg
      }
    ]);

    setForm(prev => ({ ...prev, waste_type_id: '', quantity_kg: '' }));
  };

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.user_id || !form.collection_point_id || items.length === 0) {
      return alert('Preencha usuário, ponto de coleta e adicione pelo menos um resíduo.');
    }

    api.post('/api/deliveries', {
      user_id: form.user_id,
      collection_point_id: form.collection_point_id,
      items
    })
      .then(() => {
        alert('Entrega registrada com sucesso!');
        setItems([]);
        setForm({
          user_id: '',
          collection_point_id: '',
          waste_type_id: '',
          quantity_kg: ''
        });
        loadData();
      })
      .catch(err => {
        console.error('Erro ao registrar entrega', err);
        alert('Erro ao registrar entrega. Veja o console.');
      });
  };

  return (
    <div>
      <h2 className="mb-3">Entregas de Resíduos</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Registrar nova entrega</h5>

          <form onSubmit={handleSubmit} className="row g-3">
             //Usuário
            <div className="col-12 col-md-4">
              <label className="form-label">Usuário</label>
              <select
                className="form-select"
                name="user_id"
                value={form.user_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

             //Ponto de Coleta
            <div className="col-12 col-md-4">
              <label className="form-label">Ponto de Coleta</label>
              <select
                className="form-select"
                name="collection_point_id"
                value={form.collection_point_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                {points.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

             //Tipo de Resíduo
            <div className="col-12 col-md-3">
              <label className="form-label">Tipo de Resíduo</label>
              <select
                className="form-select"
                name="waste_type_id"
                value={form.waste_type_id}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                {wasteTypes.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

              //Quantidade
            <div className="col-12 col-md-2">
              <label className="form-label">Quantidade (kg)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                name="quantity_kg"
                value={form.quantity_kg}
                onChange={handleChange}
              />
            </div>

            // Botão adicionar item
            <div className="col-12 col-md-3 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={addItem}
              >
                Adicionar item
              </button>
            </div>

              //Tabela de itens adicionados
            {items.length > 0 && (
              <div className="col-12">
                <h6>Itens da entrega</h6>
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Quantidade (kg)</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.quantity_kg}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => removeItem(index)}
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

              //Botão registrar entrega/
            <div className="col-12">
              <button type="submit" className="btn btn-success">
                Registrar entrega
              </button>
            </div>
          </form>
        </div>
      </div>

      <button className="btn btn-primary mb-3"
        onClick={() => window.open("http://localhost:3001/api/reports/deliveries")}
      >
        Exportar PDF
      </button>

        //Lista de entregas registradas
      <h5 className="mb-3">Entregas registradas</h5>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Usuario</th>
            <th>Ponto de Coleta</th>
            <th>Data</th>
            <th>Total (kg)</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((d, index) => (
            <tr key={d.id}>
              <td>{index + 1}</td>
              <td>{d.user_name}</td>
              <td>{d.point_name}</td>
              <td>{new Date(d.created_at).toLocaleString()}</td>
              <td>{parseFloat(d.total_kg).toFixed(2)}</td>
            </tr>
          ))}
          {deliveries.length === 0 && (
            <tr>
              <td colSpan="5">Nenhuma entrega registrada ainda.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DeliveriesPage;*/

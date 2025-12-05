import React, { useState, useEffect } from 'react';
import './App.css';

export function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = 'http://localhost:8000'; // frontend runs in browser, backend is exposed on host

  async function fetchTodos() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/todos/`);
      if (!res.ok) throw new Error(`Failed to fetch todos (${res.status})`);
      const data = await res.json();
      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/todos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todo: text.trim() }),
      });
      if (res.status === 201) {
        const created = await res.json();
        // Prepend the new todo so UI updates immediately
        setTodos(prev => [created, ...prev]);
        setText('');
      } else {
        const payload = await res.json().catch(() => null);
        const msg = payload && payload.detail ? payload.detail : `Failed to create todo (${res.status})`;
        throw new Error(msg);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="App" style={{ padding: '1rem', maxWidth: 720, margin: '0 auto' }}>
      <div>
        <h1>List of TODOs</h1>
        {loading && <div>Loading todos…</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {!loading && todos.length === 0 && <div>No todos yet.</div>}
        <ul>
          {todos.map(item => (
            <li key={item._id || item.id || item.text}>
              {item.text || item.todo || JSON.stringify(item)}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h1>Create a ToDo</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="todo">ToDo: </label>
            <input
              id="todo"
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              disabled={submitting}
              style={{ minWidth: 300 }}
            />
          </div>
          <div style={{ marginTop: '5px' }}>
            <button type="submit" disabled={submitting || !text.trim()}>
              {submitting ? 'Adding…' : 'Add ToDo!'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;

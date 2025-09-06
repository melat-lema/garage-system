import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayOut from '../../components/LayOut';
import AdminPanel from './AdminPanel';
import { useAuth } from '../../../Context/authContext';
import commonService from '../../../services/service.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Services() {
  const navigate = useNavigate();
  const { employee } = useAuth();
  const token = employee?.employee_token || '';
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await commonService.getServices(token);
        setServices(data.services || []);
      } catch (e) {
        toast.error(e.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };
    if (employee) load();
  }, [employee]);

  const filtered = services.filter(s =>
    [s.service_name, s.service_description]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await commonService.deleteService(id, token);
      setServices(prev => prev.filter(s => s.service_id !== id));
      toast.success('Service deleted');
    } catch (e) {
      toast.error(e.message || 'Failed to delete');
    }
  };

  if (!employee) return <div className="p-8">Please log in.</div>;
  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <LayOut>
      <div className="flex min-h-screen bg-gray-100">
        <AdminPanel />
        <main className="flex-1 p-10 pl-40">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-900 mb-8 relative inline-block">
              Services
              <span className="block w-8 h-0.5 bg-red-500 mt-1" />
            </h1>
            <button
              onClick={() => navigate('/admin/services/new')}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              + Add service
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search service…"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* List */}
          <div className="space-y-3">
            {filtered.map(s => (
              <div
                key={s.service_id}
                className="bg-white rounded-lg shadow p-5 flex items-start justify-between"
              >
                <div>
                  <div className="font-semibold text-gray-900">{s.service_name}</div>
                  {s.service_description && (
                    <div className="text-gray-600 text-sm mt-1">
                      {s.service_description}
                    </div>
                  )}
                  
                </div>
                <div className="flex items-center gap-3">
                  {/* Edit */}
                  <button
                    onClick={() => navigate(`/admin/services/edit/${s.service_id}`)}
                    className="p-2 rounded text-blue-600 hover:bg-blue-50"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(s.service_id)}
                    className="p-2 rounded text-red-600 hover:bg-red-50"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-gray-500">No services found.</div>
            )}
          </div>
          <ToastContainer position="top-right" autoClose={2500} />
        </main>
      </div>
    </LayOut>
  );
}

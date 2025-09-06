import React, { useState } from 'react';
import LayOut from '../../components/LayOut';
import AdminPanel from './AdminPanel';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/authContext';
import commonService from '../../../services/service.service';
import { toast, ToastContainer } from 'react-toastify';

export default function ServiceAdd() {
  const { employee } = useAuth();
  const token = employee?.employee_token || '';
  const navigate = useNavigate();
  const [form, setForm] = useState({ service_name: '', service_description: '' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await commonService.createService(form, token);
      toast.success('Service added');
      navigate('/admin/services');
    } catch (e) {
      toast.error(e.message || 'Failed to add service');
    }
  };

  return (
    <LayOut>
      <div className="flex min-h-screen bg-gray-100">
        <AdminPanel />
        <main className="flex-1 p-10 pl-40">
          <h1 className="text-2xl font-bold text-blue-900 mb-8 relative inline-block">
            Add service
            <span className="block w-8 h-0.5 bg-red-500 mt-1" />
          </h1>
          <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium mb-1">Service name *</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={form.service_name}
                onChange={(e) => setForm({ ...form, service_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={4}
                value={form.service_description}
                onChange={(e) => setForm({ ...form, service_description: e.target.value })}
              />
            </div>
           
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
              <button type="button" onClick={() => navigate('/admin/services')} className="px-4 py-2 border rounded">Cancel</button>
            </div>
          </form>
          <ToastContainer position="top-right" autoClose={2500} />
        </main>
      </div>
    </LayOut>
  );
}

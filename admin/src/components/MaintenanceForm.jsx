import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { maintenanceAPI } from '../services/api';
import toast from 'react-hot-toast';
import MaintenanceCard from '../components/MaintenanceCard';
import MaintenanceForm from '../components/MaintenanceForm';

const Maintenance = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await maintenanceAPI.getAll();
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load maintenance plans');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      await maintenanceAPI.create(formData);
      toast.success('Plan created successfully!');
      setShowForm(false);
      fetchPlans();
    } catch (error) {
      console.error('Error creating plan:', error);
      toast.error(error.response?.data?.message || 'Failed to create plan');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await maintenanceAPI.update(editingPlan._id, formData);
      toast.success('Plan updated successfully!');
      setShowForm(false);
      setEditingPlan(null);
      fetchPlans();
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error(error.response?.data?.message || 'Failed to update plan');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;

    try {
      await maintenanceAPI.delete(id);
      toast.success('Plan deleted successfully!');
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error(error.response?.data?.message || 'Failed to delete plan');
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPlan(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="animate-slide-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Maintenance Plans</h1>
          <p className="text-zinc-400 mt-1">Manage your maintenance & support plans</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-900 font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-400 mb-4">No maintenance plans found</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-zinc-900 font-semibold rounded-lg transition-colors"
          >
            Create Your First Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <MaintenanceCard
              key={plan._id}
              plan={plan}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <MaintenanceForm
          plan={editingPlan}
          onSubmit={editingPlan ? handleUpdate : handleCreate}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Maintenance;
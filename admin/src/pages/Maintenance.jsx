import { useState, useEffect } from 'react';
import { Plus, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';
import { maintenanceAPI } from '../services/api';
import MaintenanceCard from '../components/MaintenanceCard';
import MaintenanceForm from '../components/MaintenanceForm';
import { useLanguage } from '../context/LanguageContext';

const Maintenance = () => {
  const { t } = useLanguage();
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
      toast.error(t.maintenance.loadError);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      await maintenanceAPI.create(formData);
      toast.success(t.maintenance.createOk);
      setShowForm(false);
      fetchPlans();
    } catch (error) {
      console.error('Error creating plan:', error);
      toast.error(error.response?.data?.message || t.maintenance.createFail);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await maintenanceAPI.update(editingPlan._id || editingPlan.id, formData);
      toast.success(t.maintenance.updateOk);
      setShowForm(false);
      setEditingPlan(null);
      fetchPlans();
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error(error.response?.data?.message || t.maintenance.updateFail);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.maintenance.deleteConfirm)) return;

    try {
      await maintenanceAPI.delete(id);
      toast.success(t.maintenance.deleteOk);
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error(error.response?.data?.message || t.maintenance.deleteFail);
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="animate-slide-in">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">{t.maintenance.title}</h1>
          <p className="mt-1 text-muted">{t.maintenance.subtitle}</p>
        </div>
        <button type="button" onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="h-5 w-5" />
          {t.maintenance.add}
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="glass rounded-xl p-16 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-surface">
            <Wrench className="h-8 w-8 text-muted" />
          </div>
          <p className="mb-6 text-lg text-muted">{t.maintenance.empty}</p>
          <button type="button" onClick={() => setShowForm(true)} className="btn-primary">
            <Plus className="h-5 w-5" />
            {t.maintenance.add}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <MaintenanceCard
              key={plan._id || plan.id}
              plan={plan}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm ? (
        <MaintenanceForm
          plan={editingPlan}
          onSubmit={editingPlan ? handleUpdate : handleCreate}
          onClose={handleCloseForm}
        />
      ) : null}
    </div>
  );
};

export default Maintenance;

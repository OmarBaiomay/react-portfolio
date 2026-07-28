import { useState, useEffect } from 'react';
import { Plus, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { packageAPI } from '../services/api';
import PackageCard from '../components/PackageCard';
import PackageForm from '../components/PackageForm';
import { useLanguage } from '../context/LanguageContext';

const Packages = () => {
  const { t } = useLanguage();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await packageAPI.getAll();
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error(t.packages.loadError);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      await packageAPI.create(formData);
      toast.success(t.packages.createOk);
      setShowForm(false);
      fetchPackages();
    } catch (error) {
      console.error('Error creating package:', error);
      toast.error(error.response?.data?.message || t.packages.createFail);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await packageAPI.update(editingPackage._id || editingPackage.id, formData);
      toast.success(t.packages.updateOk);
      setShowForm(false);
      setEditingPackage(null);
      fetchPackages();
    } catch (error) {
      console.error('Error updating package:', error);
      toast.error(error.response?.data?.message || t.packages.updateFail);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.packages.deleteConfirm)) return;

    try {
      await packageAPI.delete(id);
      toast.success(t.packages.deleteOk);
      fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error(error.response?.data?.message || t.packages.deleteFail);
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPackage(null);
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
          <h1 className="font-display text-3xl font-bold text-ink">{t.packages.title}</h1>
          <p className="mt-1 text-muted">{t.packages.subtitle}</p>
        </div>
        <button type="button" onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="h-5 w-5" />
          {t.packages.add}
        </button>
      </div>

      {packages.length === 0 ? (
        <div className="glass rounded-xl p-16 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-surface">
            <Package className="h-8 w-8 text-muted" />
          </div>
          <p className="mb-6 text-lg text-muted">{t.packages.empty}</p>
          <button type="button" onClick={() => setShowForm(true)} className="btn-primary">
            <Plus className="h-5 w-5" />
            {t.packages.add}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg._id || pkg.id}
              package={pkg}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm ? (
        <PackageForm
          package={editingPackage}
          onSubmit={editingPackage ? handleUpdate : handleCreate}
          onClose={handleCloseForm}
        />
      ) : null}
    </div>
  );
};

export default Packages;

import { useState, useEffect } from 'react';
import { Plus, Package } from 'lucide-react';
import { packageAPI } from '../services/api';
import toast from 'react-hot-toast';
import PackageCard from '../components/PackageCard';
import PackageForm from '../components/PackageForm';

const Packages = () => {
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
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      await packageAPI.create(formData);
      toast.success('Package created successfully!');
      setShowForm(false);
      fetchPackages();
    } catch (error) {
      console.error('Error creating package:', error);
      toast.error(error.response?.data?.message || 'Failed to create package');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await packageAPI.update(editingPackage._id, formData);
      toast.success('Package updated successfully!');
      setShowForm(false);
      setEditingPackage(null);
      fetchPackages();
    } catch (error) {
      console.error('Error updating package:', error);
      toast.error(error.response?.data?.message || 'Failed to update package');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;

    try {
      await packageAPI.delete(id);
      toast.success('Package deleted successfully!');
      fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error(error.response?.data?.message || 'Failed to delete package');
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="animate-slide-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100">Packages</h1>
          <p className="text-gray-600 dark:text-zinc-400 mt-1">Manage your pricing packages</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add Package
        </button>
      </div>

      {packages.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400 dark:text-zinc-500" />
          </div>
          <p className="text-gray-600 dark:text-zinc-400 mb-4 text-lg">No packages found</p>
          <p className="text-gray-500 dark:text-zinc-500 text-sm mb-6">Get started by creating your first pricing package</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors shadow-md inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Your First Package
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg._id}
              package={pkg}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <PackageForm
          package={editingPackage}
          onSubmit={editingPackage ? handleUpdate : handleCreate}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Packages;
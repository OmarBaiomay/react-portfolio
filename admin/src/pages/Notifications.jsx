import { useState } from 'react';
import { Send, Bell } from 'lucide-react';
import { notificationAPI } from '../services/api';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    type: 'admins'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.type === 'admins') {
        await notificationAPI.sendToAdmins({
          title: formData.title,
          body: formData.body,
          data: {}
        });
      }
      
      toast.success('Notification sent successfully!');
      setFormData({ title: '', body: '', type: 'admins' });
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error(error.response?.data?.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slide-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100">Notifications</h1>
        <p className="text-gray-600 dark:text-zinc-400 mt-1">Send push notifications to users and admins</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Form */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100">Send Notification</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                Notification Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="admins">All Admins</option>
                <option value="topic">Topic Based</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Notification title"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                Message
              </label>
              <textarea
                name="body"
                value={formData.body}
                onChange={handleChange}
                placeholder="Notification message"
                rows="4"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Notification
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Panel */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100">Notification Guide</h2>
          </div>

          <div className="space-y-4 text-gray-600 dark:text-zinc-400 text-sm">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-zinc-100 mb-2">All Admins</h3>
              <p>Sends notification to all admin users in the system.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-zinc-100 mb-2">Topic Based</h3>
              <p>Sends notification to users subscribed to a specific topic.</p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
              <h3 className="font-semibold text-gray-900 dark:text-zinc-100 mb-2">Best Practices</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Keep titles short and clear</li>
                <li>Make messages actionable</li>
                <li>Test before sending to all users</li>
                <li>Don't spam notifications</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
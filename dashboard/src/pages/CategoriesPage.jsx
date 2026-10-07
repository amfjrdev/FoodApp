import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Layers,
  AlertCircle,
  Check,
  ArrowUpDown,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Modal } from '../components/common/Modal';
import { api } from '../services/api';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    sortOrder: 0,
    isActive: true,
  });

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getCategories();
      if (res.success) setCategories(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      image: '',
      sortOrder: categories.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      image: cat.image,
      sortOrder: cat.sortOrder ?? 0,
      isActive: cat.isActive,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        sortOrder: Number(formData.sortOrder),
      };

      if (editingCategory) {
        await api.updateCategory(editingCategory._id || editingCategory.id, payload);
        showNotification('Category updated successfully');
      } else {
        await api.createCategory(payload);
        showNotification('Category created successfully');
      }

      setIsModalOpen(false);
      loadCategories();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (cat) => {
    try {
      const catId = cat._id || cat.id;
      const newStatus = !cat.isActive;
      await api.updateCategory(catId, { isActive: newStatus });
      setCategories((prev) =>
        prev.map((c) =>
          (c._id || c.id) === catId ? { ...c, isActive: newStatus } : c
        )
      );
      showNotification(`Category '${cat.name}' ${newStatus ? 'activated' : 'deactivated'}`);
    } catch (err) {
      setError(err.message || 'Failed to toggle category state');
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setSubmitting(true);
      setError('');
      await api.deleteCategory(categoryToDelete._id || categoryToDelete.id);
      setIsDeleteModalOpen(false);
      showNotification('Category deleted successfully');
      loadCategories();
    } catch (err) {
      setError(err.message || 'Failed to delete category');
      setIsDeleteModalOpen(false);
    } finally {
      setSubmitting(false);
      setCategoryToDelete(null);
    }
  };

  const showNotification = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <>
      <Header
        title="Category Management"
        subtitle="Organize meal taxonomy, display priority, and visibility"
      />

      <div className="page-body">
        {/* Alerts */}
        {successMessage && (
          <div
            style={{
              backgroundColor: 'var(--status-delivering-bg)',
              color: '#065f46',
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              fontWeight: 600,
            }}
          >
            <Check size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: 'var(--status-cancelled-bg)',
              color: '#b91c1c',
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Action Header */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <button onClick={openAddModal} className="btn btn-primary">
            <Plus size={18} />
            <span>Add New Category</span>
          </button>
        </div>

        {/* Categories Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: 80 }}>Image</th>
                <th>Category Name</th>
                <th>Display Order</th>
                <th>Active Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="spinner" />
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No categories found. Click 'Add New Category' to create one.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id || cat.id}>
                    <td>
                      <img
                        src={cat.image}
                        alt={cat.name}
                        style={{
                          width: 52,
                          height: 52,
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: '#f1f5f9',
                        }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=120&q=80';
                        }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        {cat.name}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          backgroundColor: '#f1f5f9',
                          padding: '0.25rem 0.625rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        <ArrowUpDown size={12} />
                        Priority {cat.sortOrder ?? 0}
                      </span>
                    </td>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={cat.isActive}
                          onChange={() => handleToggleActive(cat)}
                        />
                        <span className="slider" />
                      </label>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => openEditModal(cat)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Category"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setCategoryToDelete(cat);
                            setIsDeleteModalOpen(true);
                          }}
                          className="btn btn-danger btn-sm"
                          title="Delete Category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Category Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Gourmet Pizza"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image URL *</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Display Order Priority (0 = lowest)</label>
              <input
                type="number"
                min="0"
                className="form-input"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <span className="slider" />
              </label>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                Active and visible on mobile app
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Category Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Category"
        maxWidth="450px"
      >
        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Are you sure you want to delete category <strong>{categoryToDelete?.name}</strong>?
            Categories containing active food items cannot be deleted without first removing or
            reassigning those items.
          </p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={submitting}
          >
            {submitting ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </Modal>
    </>
  );
};

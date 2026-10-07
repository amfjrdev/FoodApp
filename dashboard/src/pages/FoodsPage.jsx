import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  UtensilsCrossed,
  AlertCircle,
  Check,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Modal } from '../components/common/Modal';
import { api } from '../services/api';

export const FoodsPage = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    price: '',
    image: '',
    isAvailable: true,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [foodsRes, catRes] = await Promise.all([
        api.getFoods({
          search: search || undefined,
          categoryId: selectedCategory || undefined,
          limit: 100,
        }),
        api.getCategories(),
      ]);

      if (foodsRes.success) setFoods(foodsRes.data);
      if (catRes.success) setCategories(catRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load foods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, selectedCategory]);

  const openAddModal = () => {
    setEditingFood(null);
    setFormData({
      name: '',
      categoryId: categories[0]?._id || categories[0]?.id || '',
      description: '',
      price: '',
      image: '',
      isAvailable: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      categoryId: food.categoryId?._id || food.categoryId?.id || food.categoryId,
      description: food.description,
      price: food.price,
      image: food.image,
      isAvailable: food.isAvailable,
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
        price: Number(formData.price),
      };

      if (editingFood) {
        await api.updateFood(editingFood._id || editingFood.id, payload);
        showNotification('Food item updated successfully');
      } else {
        await api.createFood(payload);
        showNotification('Food item created successfully');
      }

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAvailability = async (food) => {
    try {
      const foodId = food._id || food.id;
      const newStatus = !food.isAvailable;
      await api.updateFood(foodId, { isAvailable: newStatus });
      setFoods((prev) =>
        prev.map((f) =>
          (f._id || f.id) === foodId ? { ...f, isAvailable: newStatus } : f
        )
      );
      showNotification(`${food.name} is now ${newStatus ? 'available' : 'hidden'}`);
    } catch (err) {
      setError(err.message || 'Failed to toggle availability');
    }
  };

  const handleDelete = async () => {
    if (!foodToDelete) return;
    try {
      setSubmitting(true);
      await api.deleteFood(foodToDelete._id || foodToDelete.id);
      setIsDeleteModalOpen(false);
      showNotification('Food item deleted');
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete food');
    } finally {
      setSubmitting(false);
      setFoodToDelete(null);
    }
  };

  const showNotification = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  return (
    <>
      <Header
        title="Food Menu Management"
        subtitle="Create, update, price, and toggle availability of restaurant items"
      />

      <div className="page-body">
        {/* Success Banner */}
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

        {/* Error Banner */}
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
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Controls: Search, Filter & Add Button */}
        <div className="filter-bar">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search foods by name or ingredients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            style={{ width: 'auto', minWidth: 180 }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button onClick={openAddModal} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
            <Plus size={18} />
            <span>Add New Food</span>
          </button>
        </div>

        {/* Foods Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: 80 }}>Item</th>
                <th>Food Details</th>
                <th>Category</th>
                <th>Price</th>
                <th>Available</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="spinner" />
                  </td>
                </tr>
              ) : foods.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No food items match the current criteria.
                  </td>
                </tr>
              ) : (
                foods.map((food) => (
                  <tr key={food._id || food.id}>
                    <td>
                      <img
                        src={food.image}
                        alt={food.name}
                        style={{
                          width: 56,
                          height: 56,
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
                        {food.name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-secondary)',
                          maxWidth: 360,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginTop: 2,
                        }}
                      >
                        {food.description}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          backgroundColor: '#f1f5f9',
                          padding: '0.25rem 0.625rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {food.categoryId?.name || 'Unassigned'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                      {formatCurrency(food.price)}
                    </td>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={food.isAvailable}
                          onChange={() => handleToggleAvailability(food)}
                        />
                        <span className="slider" />
                      </label>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => openEditModal(food)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Food"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setFoodToDelete(food);
                            setIsDeleteModalOpen(true);
                          }}
                          className="btn btn-danger btn-sm"
                          title="Delete Food"
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

      {/* Add / Edit Food Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFood ? 'Edit Food Item' : 'Add New Food Item'}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Food Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Truffle Black Angus Burger"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                >
                  {categories.map((c) => (
                    <option key={c._id || c.id} value={c._id || c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Price ($ USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="form-input"
                  placeholder="14.99"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
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
              <label className="form-label">Description *</label>
              <textarea
                className="form-textarea"
                placeholder="Detailed ingredients and culinary description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                />
                <span className="slider" />
              </label>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                Available for customer ordering
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
              {submitting ? (
                <span className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
              ) : editingFood ? (
                'Save Changes'
              ) : (
                'Create Food'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Food Item"
        maxWidth="450px"
      >
        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Are you sure you want to delete <strong>{foodToDelete?.name}</strong>? This action
            cannot be undone.
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

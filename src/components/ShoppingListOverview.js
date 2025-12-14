import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShoppingLists } from '../hooks/useShoppingLists';
import { CURRENT_USER_ID } from '../config';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import './styles.css';

function ShoppingListOverview() {
  const navigate = useNavigate();
  const { lists, state, error, reload, createList, deleteList } = useShoppingLists();

  const [showArchived, setShowArchived] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter lists based on archived toggle
  const filteredLists = showArchived
    ? lists
    : lists.filter(list => !list.archived);

  // Create new list
  const handleCreateList = async () => {
    if (!newListName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createList(newListName.trim());
      setNewListName('');
      setShowCreateModal(false);
    } catch (err) {
      console.error('Failed to create list:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete list
  const handleDeleteList = async (listId) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await deleteList(listId);
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete list:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigate to detail
  const handleOpenDetail = (listId) => {
    navigate(`/detail/${listId}`);
  };

  // Render loading state
  if (state === 'pending') {
    return (
      <div className="overview-container">
        <header className="overview-header">
          <h1>Shopping Lists</h1>
        </header>
        <LoadingSpinner message="Loading shopping lists..." />
      </div>
    );
  }

  // Render error state
  if (state === 'error') {
    return (
      <div className="overview-container">
        <header className="overview-header">
          <h1>Shopping Lists</h1>
        </header>
        <ErrorMessage message={error} onRetry={reload} />
      </div>
    );
  }

  // Render ready state
  return (
    <div className="overview-container">
      <header className="overview-header">
        <h1>Shopping Lists</h1>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          + New List
        </button>
      </header>

      <div className="overview-toolbar">
        <label className="filter-label">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
          />
          Show archived lists
        </label>
      </div>

      <div className="tiles-grid">
        {filteredLists.map(list => (
          <div
            key={list.id}
            className={`tile ${list.archived ? 'archived' : ''}`}
            onClick={() => handleOpenDetail(list.id)}
          >
            <div className="tile-header">
              <h3 className="tile-title">{list.name}</h3>
              {list.archived && <span className="archived-badge">Archived</span>}
            </div>
            <div className="tile-meta">
              <span>{list.items?.length || 0} items</span>
              <span>{list.members?.length || 1} members</span>
            </div>
            <div className="tile-footer">
              <span className="tile-owner">
                {list.ownerId === CURRENT_USER_ID ? 'You' : list.ownerName}
              </span>
              {list.ownerId === CURRENT_USER_ID && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(list);
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredLists.length === 0 && (
        <div className="empty-message">
          No shopping lists found. Create your first list!
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Shopping List</h2>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="input"
                placeholder="List name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
                autoFocus
                disabled={isSubmitting}
              />
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowCreateModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreateList}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Shopping List</h2>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete "{showDeleteConfirm.name}"?</p>
              <p className="text-muted">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(null)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteList(showDeleteConfirm.id)}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingListOverview;

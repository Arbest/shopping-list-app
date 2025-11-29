import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

// Mock current user
const currentUser = { id: 'u1', name: 'Pavel Arbes' };

// Initial data - shopping lists
const initialLists = [
  { id: 1, name: 'Weekly Groceries', ownerId: 'u1', ownerName: 'Pavel Arbes', archived: false, itemCount: 5, memberCount: 2 },
  { id: 2, name: 'Party Supplies', ownerId: 'u2', ownerName: 'Jan Novak', archived: false, itemCount: 3, memberCount: 3 },
  { id: 3, name: 'Office Supplies', ownerId: 'u1', ownerName: 'Pavel Arbes', archived: false, itemCount: 8, memberCount: 1 },
  { id: 4, name: 'Old Shopping List', ownerId: 'u1', ownerName: 'Pavel Arbes', archived: true, itemCount: 0, memberCount: 1 },
  { id: 5, name: 'Holiday Gifts', ownerId: 'u3', ownerName: 'Marie Svobodova', archived: false, itemCount: 12, memberCount: 4 },
];

function ShoppingListOverview() {
  const navigate = useNavigate();
  const [lists, setLists] = useState(initialLists);
  const [showArchived, setShowArchived] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [newListName, setNewListName] = useState('');

  // Filter lists based on archived toggle
  const filteredLists = showArchived
    ? lists
    : lists.filter(list => !list.archived);

  // Create new list
  const handleCreateList = () => {
    if (!newListName.trim()) return;

    const newList = {
      id: Date.now(),
      name: newListName.trim(),
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      archived: false,
      itemCount: 0,
      memberCount: 1
    };

    setLists([...lists, newList]);
    setNewListName('');
    setShowCreateModal(false);
  };

  // Delete list
  const handleDeleteList = (listId) => {
    setLists(lists.filter(list => list.id !== listId));
    setShowDeleteConfirm(null);
  };

  // Navigate to detail
  const handleOpenDetail = (listId) => {
    navigate(`/detail/${listId}`);
  };

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
              <span>{list.itemCount} items</span>
              <span>{list.memberCount} members</span>
            </div>
            <div className="tile-footer">
              <span className="tile-owner">
                {list.ownerId === currentUser.id ? 'You' : list.ownerName}
              </span>
              {list.ownerId === currentUser.id && (
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
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateList}>
                Create
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
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDeleteList(showDeleteConfirm.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingListOverview;

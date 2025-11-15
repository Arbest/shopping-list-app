import React, { useState } from 'react';

const ItemsSection = ({ 
  items, 
  showResolved, 
  onToggleShowResolved, 
  onAddItem, 
  onRemoveItem, 
  onToggleItem 
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = () => {
    onAddItem(newItemName);
    setNewItemName('');
    setShowAddForm(false);
  };

  const resolvedCount = items.filter(i => i.resolved).length;
  const unresolvedCount = items.filter(i => !i.resolved).length;

  return (
    <div className="items-section">
      <div className="items-header">
        <h2>Items ({unresolvedCount} unresolved / {resolvedCount} resolved)</h2>

        <div className="items-toolbar">
          <label className="filter-label">
            <input
              type="checkbox"
              checked={showResolved}
              onChange={onToggleShowResolved}
            />
            Show resolved items
          </label>
        </div>
      </div>

      <div className="items-list">
        {items.length === 0 ? (
          <p className="empty-message">No items to display</p>
        ) : (
          items.map(item => (
            <div key={item.id} className={`item-row ${item.resolved ? 'resolved' : ''}`}>
              <label className="item-checkbox">
                <input
                  type="checkbox"
                  checked={item.resolved}
                  onChange={() => onToggleItem(item.id)}
                />
                <span className="item-name">{item.name}</span>
              </label>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="btn btn-danger btn-sm"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div className="add-item">
        {showAddForm ? (
          <div className="add-form">
            <input
              type="text"
              placeholder="Item name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="input"
            />
            <button onClick={handleAdd} className="btn btn-primary">Add</button>
            <button onClick={() => setShowAddForm(false)} className="btn btn-secondary">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setShowAddForm(true)} className="btn btn-success">
            Add Item
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemsSection;

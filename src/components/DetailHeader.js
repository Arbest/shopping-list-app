import React, { useState } from 'react';

const DetailHeader = ({ listName, isOwner, onUpdateName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(listName);

  const handleSave = () => {
    if (editedName.trim()) {
      onUpdateName(editedName);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedName(listName);
    setIsEditing(false);
  };

  return (
    <div className="detail-header">
      {isEditing && isOwner ? (
        <div className="header-edit">
          <input 
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="name-input"
            autoFocus
          />
          <button onClick={handleSave} className="btn btn-primary">Save</button>
          <button onClick={handleCancel} className="btn btn-secondary">Cancel</button>
        </div>
      ) : (
        <div className="header-display">
          <h1>{listName}</h1>
          {isOwner && (
            <button onClick={() => setIsEditing(true)} className="btn btn-icon">
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailHeader;

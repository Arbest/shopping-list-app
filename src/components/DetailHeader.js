import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DetailHeader = ({ listName, isOwner, onUpdateName }) => {
  const navigate = useNavigate();
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
          <div className="header-left">
            <button onClick={() => navigate('/')} className="btn btn-icon btn-back">
              Back
            </button>
            <h1>{listName}</h1>
          </div>
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

import React, { useState } from 'react';

const MembersSection = ({ 
  members, 
  isOwner, 
  currentUserId, 
  onAddMember, 
  onRemoveMember, 
  onLeave 
}) => {
  const [newMemberName, setNewMemberName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = () => {
    onAddMember(newMemberName);
    setNewMemberName('');
    setShowAddForm(false);
  };

  return (
    <div className="members-section">
      <h2>Members ({members.length})</h2>

      <div className="members-list">
        {members.map(member => (
          <div key={member.id} className="member-item">
            <span className="member-name">
              {member.name}
              {member.isOwner && <span className="owner-badge"> (Owner)</span>}
            </span>
            {isOwner && !member.isOwner && (
              <button
                onClick={() => onRemoveMember(member.id)}
                className="btn btn-danger btn-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {isOwner && (
        <div className="add-member">
          {showAddForm ? (
            <div className="add-form">
              <input
                type="text"
                placeholder="Member name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="input"
              />
              <button onClick={handleAdd} className="btn btn-primary">Add</button>
              <button onClick={() => setShowAddForm(false)} className="btn btn-secondary">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setShowAddForm(true)} className="btn btn-success">
              Add Member
            </button>
          )}
        </div>
      )}

      {!isOwner && (
        <button onClick={onLeave} className="btn btn-warning">
          Leave List
        </button>
      )}
    </div>
  );
};

export default MembersSection;

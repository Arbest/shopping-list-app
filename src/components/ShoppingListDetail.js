import React, { useState } from 'react';
import DetailHeader from './DetailHeader';
import MembersSection from './MembersSection';
import ItemsSection from './ItemsSection';

// Initial data constant
const INITIAL_DATA = {
  id: '1',
  name: 'Weekend Shopping',
  ownerId: 'user1',
  members: [
    { id: 'user1', name: 'John Doe (Me)', isOwner: true },
    { id: 'user2', name: 'Jane Smith', isOwner: false },
    { id: 'user3', name: 'Peter Brown', isOwner: false }
  ],
  items: [
    { id: 'item1', name: 'Milk', resolved: false },
    { id: 'item2', name: 'Bread', resolved: false },
    { id: 'item3', name: 'Butter', resolved: true },
    { id: 'item4', name: 'Eggs', resolved: false },
    { id: 'item5', name: 'Cheese', resolved: true }
  ]
};

const ShoppingListDetail = () => {
  const [listName, setListName] = useState(INITIAL_DATA.name);
  const [members, setMembers] = useState(INITIAL_DATA.members);
  const [items, setItems] = useState(INITIAL_DATA.items);
  const [showResolved, setShowResolved] = useState(true);
  
  const currentUserId = 'user1'; // Simulating logged-in user
  const isOwner = INITIAL_DATA.ownerId === currentUserId;

  // Update list name (owner only)
  const handleUpdateName = (newName) => {
    if (isOwner) {
      setListName(newName);
    }
  };

  // Add member (owner only)
  const handleAddMember = (memberName) => {
    if (isOwner && memberName.trim()) {
      const newMember = {
        id: `user${Date.now()}`,
        name: memberName,
        isOwner: false
      };
      setMembers([...members, newMember]);
    }
  };

  // Remove member (owner only)
  const handleRemoveMember = (memberId) => {
    if (isOwner) {
      setMembers(members.filter(m => m.id !== memberId));
    }
  };

  // Leave list (members only)
  const handleLeaveList = () => {
    if (!isOwner) {
      alert('You have left the shopping list');
      // In real app, navigate away
    }
  };

  // Add item
  const handleAddItem = (itemName) => {
    if (itemName.trim()) {
      const newItem = {
        id: `item${Date.now()}`,
        name: itemName,
        resolved: false
      };
      setItems([...items, newItem]);
    }
  };

  // Remove item
  const handleRemoveItem = (itemId) => {
    setItems(items.filter(i => i.id !== itemId));
  };

  // Toggle item resolved status
  const handleToggleItem = (itemId) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, resolved: !item.resolved } : item
    ));
  };

  // Filter items based on showResolved
  const filteredItems = showResolved 
    ? items 
    : items.filter(item => !item.resolved);

  return (
    <div className="shopping-list-detail">
      <DetailHeader 
        listName={listName}
        isOwner={isOwner}
        onUpdateName={handleUpdateName}
      />
      
      <MembersSection 
        members={members}
        isOwner={isOwner}
        currentUserId={currentUserId}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
        onLeave={handleLeaveList}
      />
      
      <ItemsSection 
        items={filteredItems}
        showResolved={showResolved}
        onToggleShowResolved={() => setShowResolved(!showResolved)}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
        onToggleItem={handleToggleItem}
      />
    </div>
  );
};

export default ShoppingListDetail;

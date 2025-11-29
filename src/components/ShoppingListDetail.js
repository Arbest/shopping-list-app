import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DetailHeader from './DetailHeader';
import MembersSection from './MembersSection';
import ItemsSection from './ItemsSection';

// Mock current user
const currentUserId = 'u1';

// Initial data constant - all shopping lists with their details
const ALL_LISTS_DATA = {
  '1': {
    id: '1',
    name: 'Weekly Groceries',
    ownerId: 'u1',
    members: [
      { id: 'u1', name: 'Pavel Arbes (Me)', isOwner: true },
      { id: 'u2', name: 'Jan Novak', isOwner: false },
    ],
    items: [
      { id: 'item1', name: 'Milk', resolved: false },
      { id: 'item2', name: 'Bread', resolved: false },
      { id: 'item3', name: 'Butter', resolved: true },
      { id: 'item4', name: 'Eggs', resolved: false },
      { id: 'item5', name: 'Cheese', resolved: true }
    ]
  },
  '2': {
    id: '2',
    name: 'Party Supplies',
    ownerId: 'u2',
    members: [
      { id: 'u2', name: 'Jan Novak', isOwner: true },
      { id: 'u1', name: 'Pavel Arbes (Me)', isOwner: false },
      { id: 'u3', name: 'Marie Svobodova', isOwner: false },
    ],
    items: [
      { id: 'item6', name: 'Balloons', resolved: false },
      { id: 'item7', name: 'Cake', resolved: false },
      { id: 'item8', name: 'Candles', resolved: true }
    ]
  },
  '3': {
    id: '3',
    name: 'Office Supplies',
    ownerId: 'u1',
    members: [
      { id: 'u1', name: 'Pavel Arbes (Me)', isOwner: true },
    ],
    items: [
      { id: 'item9', name: 'Pens', resolved: false },
      { id: 'item10', name: 'Paper', resolved: false },
      { id: 'item11', name: 'Stapler', resolved: false },
      { id: 'item12', name: 'Folders', resolved: true },
      { id: 'item13', name: 'Highlighters', resolved: false },
      { id: 'item14', name: 'Notebooks', resolved: true },
      { id: 'item15', name: 'Tape', resolved: false },
      { id: 'item16', name: 'Scissors', resolved: false }
    ]
  },
  '4': {
    id: '4',
    name: 'Old Shopping List',
    ownerId: 'u1',
    members: [
      { id: 'u1', name: 'Pavel Arbes (Me)', isOwner: true },
    ],
    items: []
  },
  '5': {
    id: '5',
    name: 'Holiday Gifts',
    ownerId: 'u3',
    members: [
      { id: 'u3', name: 'Marie Svobodova', isOwner: true },
      { id: 'u1', name: 'Pavel Arbes (Me)', isOwner: false },
      { id: 'u2', name: 'Jan Novak', isOwner: false },
      { id: 'u4', name: 'Petr Dvorak', isOwner: false },
    ],
    items: [
      { id: 'item17', name: 'Gift for Mom', resolved: false },
      { id: 'item18', name: 'Gift for Dad', resolved: true },
      { id: 'item19', name: 'Gift for Sister', resolved: false },
      { id: 'item20', name: 'Gift for Brother', resolved: false },
      { id: 'item21', name: 'Gift cards', resolved: true },
      { id: 'item22', name: 'Wrapping paper', resolved: false },
      { id: 'item23', name: 'Ribbons', resolved: false },
      { id: 'item24', name: 'Christmas tree', resolved: true },
      { id: 'item25', name: 'Decorations', resolved: false },
      { id: 'item26', name: 'Lights', resolved: true },
      { id: 'item27', name: 'Chocolate box', resolved: false },
      { id: 'item28', name: 'Wine', resolved: false }
    ]
  }
};

const ShoppingListDetail = () => {
  const { id } = useParams();

  // Get initial data for this list
  const initialData = ALL_LISTS_DATA[id] || {
    id: id,
    name: 'Unknown List',
    ownerId: 'u1',
    members: [{ id: 'u1', name: 'Pavel Arbes (Me)', isOwner: true }],
    items: []
  };

  const [listName, setListName] = useState(initialData.name);
  const [members, setMembers] = useState(initialData.members);
  const [items, setItems] = useState(initialData.items);
  const [showResolved, setShowResolved] = useState(true);

  const isOwner = initialData.ownerId === currentUserId;

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

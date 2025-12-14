import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useShoppingListDetail } from '../hooks/useShoppingListDetail';
import { CURRENT_USER_ID } from '../config';
import DetailHeader from './DetailHeader';
import MembersSection from './MembersSection';
import ItemsSection from './ItemsSection';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const ShoppingListDetail = () => {
  const { id } = useParams();
  const {
    list,
    state,
    error,
    isOwner,
    reload,
    updateName,
    addMember,
    removeMember,
    leaveList,
    addItem,
    deleteItem,
    toggleItemResolved,
  } = useShoppingListDetail(id);

  const [showResolved, setShowResolved] = useState(true);

  // Update list name (owner only)
  const handleUpdateName = async (newName) => {
    if (isOwner) {
      try {
        await updateName(newName);
      } catch (err) {
        console.error('Failed to update name:', err);
      }
    }
  };

  // Add member (owner only)
  const handleAddMember = async (memberName) => {
    if (isOwner && memberName.trim()) {
      try {
        const memberId = `user${Date.now()}`;
        await addMember(memberId, memberName);
      } catch (err) {
        console.error('Failed to add member:', err);
      }
    }
  };

  // Remove member (owner only)
  const handleRemoveMember = async (memberId) => {
    if (isOwner) {
      try {
        await removeMember(memberId);
      } catch (err) {
        console.error('Failed to remove member:', err);
      }
    }
  };

  // Leave list (members only)
  const handleLeaveList = async () => {
    if (!isOwner) {
      try {
        await leaveList();
        alert('You have left the shopping list');
      } catch (err) {
        console.error('Failed to leave list:', err);
      }
    }
  };

  // Add item
  const handleAddItem = async (itemName) => {
    if (itemName.trim()) {
      try {
        await addItem(itemName);
      } catch (err) {
        console.error('Failed to add item:', err);
      }
    }
  };

  // Remove item
  const handleRemoveItem = async (itemId) => {
    try {
      await deleteItem(itemId);
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  // Toggle item resolved status
  const handleToggleItem = async (itemId) => {
    try {
      await toggleItemResolved(itemId);
    } catch (err) {
      console.error('Failed to toggle item:', err);
    }
  };

  // Render loading state
  if (state === 'pending') {
    return (
      <div className="shopping-list-detail">
        <LoadingSpinner message="Loading shopping list..." />
      </div>
    );
  }

  // Render error state
  if (state === 'error') {
    return (
      <div className="shopping-list-detail">
        <ErrorMessage message={error} onRetry={reload} />
      </div>
    );
  }

  // Render ready state
  if (!list) {
    return (
      <div className="shopping-list-detail">
        <ErrorMessage message="Shopping list not found" />
      </div>
    );
  }

  // Filter items based on showResolved
  const filteredItems = showResolved
    ? list.items
    : list.items.filter(item => !item.resolved);

  // Map members for MembersSection
  const mappedMembers = list.members.map(member => ({
    ...member,
    isOwner: member.id === list.ownerId,
  }));

  return (
    <div className="shopping-list-detail">
      <DetailHeader
        listName={list.name}
        isOwner={isOwner}
        onUpdateName={handleUpdateName}
      />

      <MembersSection
        members={mappedMembers}
        isOwner={isOwner}
        currentUserId={CURRENT_USER_ID}
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

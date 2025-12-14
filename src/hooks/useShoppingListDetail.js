import { useState, useEffect, useCallback } from 'react';
import { shoppingListApi, shoppingListItemApi } from '../api/shoppingListApi';
import { CURRENT_USER_ID } from '../config';

// Loading states: 'pending' | 'ready' | 'error'
export const useShoppingListDetail = (listId) => {
  const [list, setList] = useState(null);
  const [state, setState] = useState('pending');
  const [error, setError] = useState(null);

  // Load list detail
  const loadList = useCallback(async () => {
    if (!listId) return;
    setState('pending');
    setError(null);
    try {
      const data = await shoppingListApi.get(listId);
      setList(data);
      setState('ready');
    } catch (err) {
      setError(err.message);
      setState('error');
    }
  }, [listId]);

  // Initial load
  useEffect(() => {
    loadList();
  }, [loadList]);

  // Update list name
  const updateName = async (name) => {
    try {
      const updated = await shoppingListApi.update(listId, name);
      setList(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Add member
  const addMember = async (memberId, memberName) => {
    try {
      const updated = await shoppingListApi.addMember(listId, memberId, memberName);
      setList(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Remove member
  const removeMember = async (memberId) => {
    try {
      const updated = await shoppingListApi.removeMember(listId, memberId);
      setList(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Leave list
  const leaveList = async () => {
    try {
      await shoppingListApi.leave(listId);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Add item
  const addItem = async (name) => {
    try {
      const newItem = await shoppingListItemApi.create(listId, name);
      setList((prev) => ({
        ...prev,
        items: [...prev.items, newItem],
      }));
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete item
  const deleteItem = async (itemId) => {
    try {
      await shoppingListItemApi.delete(listId, itemId);
      setList((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.id !== itemId),
      }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Toggle item resolved
  const toggleItemResolved = async (itemId) => {
    const item = list?.items.find((i) => i.id === itemId);
    if (!item) return;
    try {
      const updated = await shoppingListItemApi.setResolved(listId, itemId, !item.resolved);
      setList((prev) => ({
        ...prev,
        items: prev.items.map((i) => (i.id === itemId ? { ...i, resolved: updated.resolved } : i)),
      }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const isOwner = list?.ownerId === CURRENT_USER_ID;

  return {
    list,
    state,
    error,
    isOwner,
    reload: loadList,
    updateName,
    addMember,
    removeMember,
    leaveList,
    addItem,
    deleteItem,
    toggleItemResolved,
  };
};

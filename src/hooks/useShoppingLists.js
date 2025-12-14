import { useState, useEffect, useCallback } from 'react';
import { shoppingListApi } from '../api/shoppingListApi';

// Loading states: 'pending' | 'ready' | 'error'
export const useShoppingLists = () => {
  const [lists, setLists] = useState([]);
  const [state, setState] = useState('pending'); // pending, ready, error
  const [error, setError] = useState(null);

  // Load lists
  const loadLists = useCallback(async () => {
    setState('pending');
    setError(null);
    try {
      const data = await shoppingListApi.list();
      setLists(data);
      setState('ready');
    } catch (err) {
      setError(err.message);
      setState('error');
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadLists();
  }, [loadLists]);

  // Create list
  const createList = async (name) => {
    try {
      const newList = await shoppingListApi.create(name);
      setLists((prev) => [...prev, newList]);
      return newList;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete list
  const deleteList = async (id) => {
    try {
      await shoppingListApi.delete(id);
      setLists((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    lists,
    state,
    error,
    reload: loadLists,
    createList,
    deleteList,
  };
};

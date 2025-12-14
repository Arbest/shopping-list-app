import { USE_MOCK, API_BASE_URL, CURRENT_USER_ID, CURRENT_USER_NAME } from '../config';
import { mockApi } from './mockData';

// Helper for real API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': CURRENT_USER_ID,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.uuAppErrorMap
      ? Object.values(data.uuAppErrorMap)[0]?.message || 'Unknown error'
      : data.error || 'Unknown error';
    throw new Error(errorMessage);
  }

  return data;
};

// Shopping List API
export const shoppingListApi = {
  // List all shopping lists for current user
  async list() {
    if (USE_MOCK) {
      return mockApi.listShoppingLists(CURRENT_USER_ID);
    }
    const data = await apiCall('/shoppingList/list');
    return data.lists;
  },

  // Get single shopping list by ID
  async get(id) {
    if (USE_MOCK) {
      return mockApi.getShoppingList(id, CURRENT_USER_ID);
    }
    const data = await apiCall(`/shoppingList/get?id=${id}`);
    return data.list;
  },

  // Create new shopping list
  async create(name) {
    if (USE_MOCK) {
      return mockApi.createShoppingList(name, CURRENT_USER_ID, CURRENT_USER_NAME);
    }
    const data = await apiCall('/shoppingList/create', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    return data.list;
  },

  // Update shopping list name
  async update(id, name) {
    if (USE_MOCK) {
      return mockApi.updateShoppingList(id, name);
    }
    const data = await apiCall('/shoppingList/update', {
      method: 'PUT',
      body: JSON.stringify({ id, name }),
    });
    return data.list;
  },

  // Delete shopping list
  async delete(id) {
    if (USE_MOCK) {
      return mockApi.deleteShoppingList(id);
    }
    return apiCall('/shoppingList/delete', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  },

  // Set archived status
  async setArchived(id, archived) {
    if (USE_MOCK) {
      return mockApi.setArchived(id, archived);
    }
    const data = await apiCall('/shoppingList/setArchived', {
      method: 'PATCH',
      body: JSON.stringify({ id, archived }),
    });
    return data.list;
  },

  // Add member to list
  async addMember(listId, memberId, memberName) {
    if (USE_MOCK) {
      return mockApi.addMember(listId, memberId, memberName);
    }
    const data = await apiCall('/shoppingList/addMember', {
      method: 'POST',
      body: JSON.stringify({ id: listId, memberId }),
    });
    return data.list;
  },

  // Remove member from list
  async removeMember(listId, memberId) {
    if (USE_MOCK) {
      return mockApi.removeMember(listId, memberId);
    }
    const data = await apiCall('/shoppingList/removeMember', {
      method: 'DELETE',
      body: JSON.stringify({ id: listId, memberId }),
    });
    return data.list;
  },

  // Leave list (as member)
  async leave(listId) {
    if (USE_MOCK) {
      return mockApi.leaveList(listId, CURRENT_USER_ID);
    }
    return apiCall('/shoppingList/leave', {
      method: 'DELETE',
      body: JSON.stringify({ id: listId }),
    });
  },
};

// Shopping List Item API
export const shoppingListItemApi = {
  // Create new item
  async create(listId, name) {
    if (USE_MOCK) {
      return mockApi.createItem(listId, name);
    }
    const data = await apiCall('/shoppingListItem/create', {
      method: 'POST',
      body: JSON.stringify({ listId, name }),
    });
    return data.item;
  },

  // Delete item
  async delete(listId, itemId) {
    if (USE_MOCK) {
      return mockApi.deleteItem(listId, itemId);
    }
    return apiCall('/shoppingListItem/delete', {
      method: 'DELETE',
      body: JSON.stringify({ listId, itemId }),
    });
  },

  // Set item resolved status
  async setResolved(listId, itemId, resolved) {
    if (USE_MOCK) {
      return mockApi.setItemResolved(listId, itemId, resolved);
    }
    const data = await apiCall('/shoppingListItem/setResolved', {
      method: 'PATCH',
      body: JSON.stringify({ listId, itemId, resolved }),
    });
    return data.item;
  },
};

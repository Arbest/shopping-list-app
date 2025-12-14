// Mock data for development
export const mockUsers = {
  u1: { id: 'u1', name: 'Pavel Arbes', email: 'pavel@example.com' },
  u2: { id: 'u2', name: 'Jan Novak', email: 'jan@example.com' },
  u3: { id: 'u3', name: 'Marie Svobodova', email: 'marie@example.com' },
  u4: { id: 'u4', name: 'Petr Dvorak', email: 'petr@example.com' },
};

export const mockShoppingLists = [
  {
    id: '1',
    name: 'Weekly Groceries',
    ownerId: 'u1',
    ownerName: 'Pavel Arbes',
    archived: false,
    members: [
      { id: 'u1', name: 'Pavel Arbes' },
      { id: 'u2', name: 'Jan Novak' },
    ],
    items: [
      { id: 'item1', name: 'Milk', resolved: false },
      { id: 'item2', name: 'Bread', resolved: false },
      { id: 'item3', name: 'Butter', resolved: true },
      { id: 'item4', name: 'Eggs', resolved: false },
      { id: 'item5', name: 'Cheese', resolved: true },
    ],
  },
  {
    id: '2',
    name: 'Party Supplies',
    ownerId: 'u2',
    ownerName: 'Jan Novak',
    archived: false,
    members: [
      { id: 'u2', name: 'Jan Novak' },
      { id: 'u1', name: 'Pavel Arbes' },
      { id: 'u3', name: 'Marie Svobodova' },
    ],
    items: [
      { id: 'item6', name: 'Balloons', resolved: false },
      { id: 'item7', name: 'Cake', resolved: false },
      { id: 'item8', name: 'Candles', resolved: true },
    ],
  },
  {
    id: '3',
    name: 'Office Supplies',
    ownerId: 'u1',
    ownerName: 'Pavel Arbes',
    archived: false,
    members: [{ id: 'u1', name: 'Pavel Arbes' }],
    items: [
      { id: 'item9', name: 'Pens', resolved: false },
      { id: 'item10', name: 'Paper', resolved: false },
      { id: 'item11', name: 'Stapler', resolved: false },
      { id: 'item12', name: 'Folders', resolved: true },
      { id: 'item13', name: 'Highlighters', resolved: false },
      { id: 'item14', name: 'Notebooks', resolved: true },
      { id: 'item15', name: 'Tape', resolved: false },
      { id: 'item16', name: 'Scissors', resolved: false },
    ],
  },
  {
    id: '4',
    name: 'Old Shopping List',
    ownerId: 'u1',
    ownerName: 'Pavel Arbes',
    archived: true,
    members: [{ id: 'u1', name: 'Pavel Arbes' }],
    items: [],
  },
  {
    id: '5',
    name: 'Holiday Gifts',
    ownerId: 'u3',
    ownerName: 'Marie Svobodova',
    archived: false,
    members: [
      { id: 'u3', name: 'Marie Svobodova' },
      { id: 'u1', name: 'Pavel Arbes' },
      { id: 'u2', name: 'Jan Novak' },
      { id: 'u4', name: 'Petr Dvorak' },
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
      { id: 'item28', name: 'Wine', resolved: false },
    ],
  },
];

// Mutable copy for mock operations
let lists = JSON.parse(JSON.stringify(mockShoppingLists));

// Helper to simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API implementation
export const mockApi = {
  // Shopping List endpoints
  async listShoppingLists(userId) {
    await delay(300);
    return lists.filter(
      (list) =>
        list.ownerId === userId || list.members.some((m) => m.id === userId)
    );
  },

  async getShoppingList(id, userId) {
    await delay(200);
    const list = lists.find((l) => l.id === id);
    if (!list) {
      throw new Error('Shopping list not found');
    }
    if (
      list.ownerId !== userId &&
      !list.members.some((m) => m.id === userId)
    ) {
      throw new Error('Access denied');
    }
    return list;
  },

  async createShoppingList(name, userId, userName) {
    await delay(300);
    const newList = {
      id: String(Date.now()),
      name,
      ownerId: userId,
      ownerName: userName,
      archived: false,
      members: [{ id: userId, name: userName }],
      items: [],
    };
    lists.push(newList);
    return newList;
  },

  async updateShoppingList(id, name) {
    await delay(200);
    const list = lists.find((l) => l.id === id);
    if (!list) {
      throw new Error('Shopping list not found');
    }
    list.name = name;
    return list;
  },

  async deleteShoppingList(id) {
    await delay(300);
    const index = lists.findIndex((l) => l.id === id);
    if (index === -1) {
      throw new Error('Shopping list not found');
    }
    lists.splice(index, 1);
    return { success: true };
  },

  async setArchived(id, archived) {
    await delay(200);
    const list = lists.find((l) => l.id === id);
    if (!list) {
      throw new Error('Shopping list not found');
    }
    list.archived = archived;
    return list;
  },

  async addMember(listId, memberId, memberName) {
    await delay(200);
    const list = lists.find((l) => l.id === listId);
    if (!list) {
      throw new Error('Shopping list not found');
    }
    if (list.members.some((m) => m.id === memberId)) {
      throw new Error('Member already exists');
    }
    list.members.push({ id: memberId, name: memberName });
    return list;
  },

  async removeMember(listId, memberId) {
    await delay(200);
    const list = lists.find((l) => l.id === listId);
    if (!list) {
      throw new Error('Shopping list not found');
    }
    list.members = list.members.filter((m) => m.id !== memberId);
    return list;
  },

  async leaveList(listId, userId) {
    await delay(200);
    const list = lists.find((l) => l.id === listId);
    if (!list) {
      throw new Error('Shopping list not found');
    }
    list.members = list.members.filter((m) => m.id !== userId);
    return { success: true };
  },

  // Item endpoints
  async createItem(listId, itemName) {
    await delay(200);
    const list = lists.find((l) => l.id === listId);
    if (!list) {
      throw new Error('Shopping list not found');
    }
    const newItem = {
      id: `item${Date.now()}`,
      name: itemName,
      resolved: false,
    };
    list.items.push(newItem);
    return newItem;
  },

  async deleteItem(listId, itemId) {
    await delay(200);
    const list = lists.find((l) => l.id === listId);
    if (!list) {
      throw new Error('Shopping list not found');
    }
    list.items = list.items.filter((i) => i.id !== itemId);
    return { success: true };
  },

  async setItemResolved(listId, itemId, resolved) {
    await delay(200);
    const list = lists.find((l) => l.id === listId);
    if (!list) {
      throw new Error('Shopping list not found');
    }
    const item = list.items.find((i) => i.id === itemId);
    if (!item) {
      throw new Error('Item not found');
    }
    item.resolved = resolved;
    return item;
  },

  // Reset mock data (useful for testing)
  resetData() {
    lists = JSON.parse(JSON.stringify(mockShoppingLists));
  },
};

const API_BASE_URL = __DEV__ 
  ? 'https://workspace-e4caa02b-1bd5-4ebf-bb9b-9476f29b34bf-00-3oqu3bicem4lo.picard.replit.dev:5000/api' 
  : 'https://your-deployed-backend.replit.app/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'An error occurred' };
      }

      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: 'Network error' };
    }
  }

  // Auth methods
  async register(name: string, email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Lists methods
  async getLists() {
    return this.request<any[]>('/lists');
  }

  async createList(name: string, description?: string, budget?: number) {
    return this.request<any>('/lists', {
      method: 'POST',
      body: JSON.stringify({ name, description, budget }),
    });
  }

  async getList(id: string) {
    return this.request<any>(`/lists/${id}`);
  }

  async deleteList(id: string) {
    return this.request<any>(`/lists/${id}`, {
      method: 'DELETE',
    });
  }

  // Items methods
  async addItem(listId: string, item: {
    name: string;
    quantity?: number;
    price?: number;
    category?: string;
  }) {
    return this.request<any>(`/lists/${listId}/items`, {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateItem(itemId: string, updates: {
    completed?: boolean;
    quantity?: number;
    price?: number;
  }) {
    return this.request<any>(`/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteItem(itemId: string) {
    return this.request<any>(`/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  // User methods
  async getUserProfile() {
    return this.request<any>('/user/profile');
  }
}

export const apiService = new ApiService();
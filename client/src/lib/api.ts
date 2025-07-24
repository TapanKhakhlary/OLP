// API client for the backend
const API_BASE = '/api';

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const config: RequestInit = {
    credentials: 'include', // Include cookies for session management
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Authentication API
export const authAPI = {
  async login(credentials: { email: string; password: string }) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async signup(userData: { 
    name: string; 
    email: string; 
    password: string; 
    role: string;
  }) {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async logout() {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  async getMe() {
    return apiRequest('/auth/me');
  },
};

// Classes API
export const classesAPI = {
  async getClasses() {
    return apiRequest('/classes');
  },

  async createClass(classData: { name: string }) {
    return apiRequest('/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  },

  async joinClass(classCode: string) {
    return apiRequest('/classes/join', {
      method: 'POST',
      body: JSON.stringify({ classCode }),
    });
  },

  async getClass(id: string) {
    return apiRequest(`/classes/${id}`);
  },
};

// Books API
export const booksAPI = {
  async getBooks() {
    return apiRequest('/books');
  },

  async createBook(bookData: any) {
    return apiRequest('/books', {
      method: 'POST', 
      body: JSON.stringify(bookData),
    });
  },
};

// Assignments API
export const assignmentsAPI = {
  async getAssignments() {
    return apiRequest('/assignments');
  },

  async createAssignment(assignmentData: any) {
    return apiRequest('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  },

  async getAssignmentsByClass(classId: string) {
    return apiRequest(`/assignments/class/${classId}`);
  },
};

// Messages/Announcements API
export const messagesAPI = {
  async createAnnouncement(announcementData: {
    content: string;
    classId: string;
  }) {
    return apiRequest('/announcements', {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });
  },

  async getAnnouncements(classId?: string) {
    const endpoint = classId ? `/announcements?classId=${classId}` : '/announcements';
    return apiRequest(endpoint);
  },
};

// Export for React Query
export { apiRequest };
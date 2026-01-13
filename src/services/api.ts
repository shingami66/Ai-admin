// API utility functions for Admin Dashboard
const API_BASE = 'http://localhost:5000/api/admin';

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  joinDate: string;
}

export interface Content {
  id: number;
  title: string;
  type: string;
  creator: string;
  date: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface Subscription {
  id: number;
  user: string;
  plan: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface Payment {
  id: number;
  user: string;
  amount: string;
  method: string;
  status: string;
  date: string;
}

export interface Stats {
  totalUsers: number;
  imagesGenerated: number;
  videosCreated: number;
  totalRevenue: number;
}

export interface Complaint {
  id: number;
  user: string;
  description: string;
  status: string;
}

// API Functions
export const fetchStats = async (): Promise<Stats> => {
  const response = await fetch(`${API_BASE}/stats`);
  const data = await response.json();
  return data.stats;
};

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE}/users`);
  const data = await response.json();
  return data.users || [];
};

export const addUser = async (username: string, email: string, password: string) => {
  const response = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  return response.json();
};

export const updateUser = async (id: number, username: string, email: string, password?: string) => {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  return response.json();
};

export const deleteUser = async (id: number) => {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

export const fetchContent = async (): Promise<Content[]> => {
  const response = await fetch(`${API_BASE}/content`);
  const data = await response.json();
  return data.content || [];
};

export const deleteContent = async (id: number) => {
  const response = await fetch(`${API_BASE}/content/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

export const fetchSubscriptions = async (): Promise<Subscription[]> => {
  const response = await fetch(`${API_BASE}/subscriptions`);
  const data = await response.json();
  return data.subscriptions || [];
};

export const updateSubscription = async (id: number, status: string) => {
  const response = await fetch(`${API_BASE}/subscriptions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return response.json();
};

export const deleteSubscription = async (id: number) => {
  const response = await fetch(`${API_BASE}/subscriptions/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

export const fetchPayments = async (): Promise<Payment[]> => {
  const response = await fetch(`${API_BASE}/payments`);
  const data = await response.json();
  return data.payments || [];
};

export const fetchComplaints = async (): Promise<Complaint[]> => {
  const response = await fetch(`${API_BASE}/complaints`);
  const data = await response.json();
  return data.complaints || [];
};

export const deleteComplaint = async (id: number) => {
  const response = await fetch(`${API_BASE}/complaints/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

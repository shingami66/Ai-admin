import { useState, useEffect } from 'react';
import type { User, Content, Subscription, Payment, Stats, Complaint } from '../services/api';
import * as api from '../services/api';

export const useAdminData = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    imagesGenerated: 0,
    videosCreated: 0,
    totalRevenue: 0
  });
  
  const [users, setUsers] = useState<User[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, contentData, subsData, paymentsData, complaintsData] = await Promise.all([
        api.fetchStats(),
        api.fetchUsers(),
        api.fetchContent(),
        api.fetchSubscriptions(),
        api.fetchPayments(),
        api.fetchComplaints()
      ]);

      console.log('📊 Stats:', statsData);
      console.log('👥 Users:', usersData);
      console.log('📝 Content:', contentData);
      console.log('💳 Subscriptions:', subsData);
      console.log('💰 Payments:', paymentsData);
      console.log('📋 Complaints:', complaintsData);

      setStats(statsData);
      setUsers(usersData);
      setContent(contentData);
      setSubscriptions(subsData);
      setPayments(paymentsData);
      setComplaints(complaintsData);
    } catch (error) {
      console.error('❌ Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddUser = async (username: string, email: string, password: string) => {
    try {
      await api.addUser(username, email, password);
      await loadData(); // Reload data
      return { success: true };
    } catch (error) {
      console.error('Error adding user:', error);
      return { success: false, error };
    }
  };

  const handleUpdateUser = async (id: number, username: string, email: string, password?: string) => {
    try {
      await api.updateUser(id, username, email, password);
      await loadData();
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error };
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await api.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      await loadData();
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error };
    }
  };

  const handleDeleteContent = async (id: number) => {
    try {
      await api.deleteContent(id);
      setContent(content.filter(c => c.id !== id));
      await loadData();
      return { success: true };
    } catch (error) {
      console.error('Error deleting content:', error);
      return { success: false, error };
    }
  };

  const handleUpdateSubscription = async (id: number, status: string) => {
    try {
      await api.updateSubscription(id, status);
      setSubscriptions(subscriptions.map(sub => 
        sub.id === id ? { ...sub, status } : sub
      ));
      return { success: true };
    } catch (error) {
      console.error('Error updating subscription:', error);
      return { success: false, error };
    }
  };

  const handleDeleteSubscription = async (id: number) => {
    try {
      await api.deleteSubscription(id);
      setSubscriptions(subscriptions.filter(sub => sub.id !== id));
      await loadData();
      return { success: true };
    } catch (error) {
      console.error('Error deleting subscription:', error);
      return { success: false, error };
    }
  };

  const handleDeleteComplaint = async (id: number) => {
    try {
      await api.deleteComplaint(id);
      setComplaints(complaints.filter(c => c.id !== id));
      await loadData();
      return { success: true };
    } catch (error) {
      console.error('Error deleting complaint:', error);
      return { success: false, error };
    }
  };

  return {
    stats,
    users,
    content,
    subscriptions,
    payments,
    complaints,
    loading,
    loadData,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
    handleDeleteContent,
    handleUpdateSubscription,
    handleDeleteSubscription,
    handleDeleteComplaint
  };
};

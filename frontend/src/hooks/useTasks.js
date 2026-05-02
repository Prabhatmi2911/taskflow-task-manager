import { useState, useCallback } from 'react';
import { tasksApi } from '../api';
import toast from 'react-hot-toast';

/**
 * useTasks — custom hook encapsulating all task-related state and API operations.
 *
 * Provides:
 * - tasks list with loading/error states
 * - CRUD operations (create, toggle, update, delete)
 * - Filter state for pending/completed/all
 */
export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // tracks which task action is in-flight
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  // -------------------------------------------------------
  // Fetch all tasks
  // -------------------------------------------------------

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tasksApi.getAll();
      setTasks(response.data.data || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load tasks.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // -------------------------------------------------------
  // Create task
  // -------------------------------------------------------

  const createTask = useCallback(async (taskData) => {
    setActionLoading('create');
    try {
      const response = await tasksApi.create(taskData);
      const newTask = response.data.data;
      setTasks((prev) => [newTask, ...prev]);
      toast.success('Task created!');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create task.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setActionLoading(null);
    }
  }, []);

  // -------------------------------------------------------
  // Toggle task status
  // -------------------------------------------------------

  const toggleTask = useCallback(async (id) => {
    setActionLoading(`toggle-${id}`);
    try {
      const response = await tasksApi.toggle(id);
      const updatedTask = response.data.data;
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updatedTask : t))
      );
      const statusLabel = updatedTask.status === 'COMPLETED' ? 'completed' : 'reopened';
      toast.success(`Task marked as ${statusLabel}`);
    } catch (err) {
      toast.error('Failed to update task status.');
    } finally {
      setActionLoading(null);
    }
  }, []);

  // -------------------------------------------------------
  // Update task
  // -------------------------------------------------------

  const updateTask = useCallback(async (id, data) => {
    setActionLoading(`update-${id}`);
    try {
      const response = await tasksApi.update(id, data);
      const updatedTask = response.data.data;
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updatedTask : t))
      );
      toast.success('Task updated!');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update task.';
      toast.error(message);
      return { success: false };
    } finally {
      setActionLoading(null);
    }
  }, []);

  // -------------------------------------------------------
  // Delete task
  // -------------------------------------------------------

  const deleteTask = useCallback(async (id) => {
    setActionLoading(`delete-${id}`);
    try {
      await tasksApi.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success('Task deleted.');
    } catch (err) {
      toast.error('Failed to delete task.');
    } finally {
      setActionLoading(null);
    }
  }, []);

  // -------------------------------------------------------
  // Derived state — filtered + searched tasks
  // -------------------------------------------------------

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'pending' && task.status === 'PENDING') ||
      (filter === 'completed' && task.status === 'COMPLETED');

    const matchesSearch =
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'PENDING').length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
  };

  return {
    tasks: filteredTasks,
    loading,
    actionLoading,
    error,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    stats,
    fetchTasks,
    createTask,
    toggleTask,
    updateTask,
    deleteTask,
  };
}
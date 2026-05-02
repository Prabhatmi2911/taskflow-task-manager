import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import TaskForm from '../tasks/TaskForm';
import TaskCard from '../tasks/TaskCard';
import Spinner from '../common/Spinner';
import styles from './DashboardPage.module.css';

/**
 * DashboardPage — main authenticated page.
 * Displays task stats, task creation form, filters, and the task list.
 */
export default function DashboardPage() {
  const { user, logout } = useAuth();
  const {
    tasks,
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
  } = useTasks();

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const isCreating = actionLoading === 'create';

  return (
    <div className={styles.layout}>
      {/* ---- Sidebar ---- */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className={styles.brandName}>TaskFlow</span>
        </div>

        {/* Stats */}
        <div className={styles.statsSection}>
          <p className={styles.sectionLabel}>Overview</p>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.total}</span>
            <span className={styles.statLabel}>Total Tasks</span>
          </div>
          <div className={styles.statRow}>
            <div className={styles.miniStat}>
              <span className={`${styles.dot} ${styles.dotPending}`} />
              <span className={styles.miniStatLabel}>Pending</span>
              <span className={styles.miniStatVal}>{stats.pending}</span>
            </div>
            <div className={styles.miniStat}>
              <span className={`${styles.dot} ${styles.dotDone}`} />
              <span className={styles.miniStatLabel}>Done</span>
              <span className={styles.miniStatVal}>{stats.completed}</span>
            </div>
          </div>

          {/* Progress bar */}
          {stats.total > 0 && (
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${(stats.completed / stats.total) * 100}%` }}
              />
            </div>
          )}
          {stats.total > 0 && (
            <p className={styles.progressLabel}>
              {Math.round((stats.completed / stats.total) * 100)}% complete
            </p>
          )}
        </div>

        {/* Filters */}
        <div className={styles.filtersSection}>
          <p className={styles.sectionLabel}>Filter</p>
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''}`}
              onClick={() => setFilter(f)}
            >
              <span className={styles.filterIcon}>
                {f === 'all' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
                {f === 'pending' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
                {f === 'completed' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className={styles.filterCount}>
                {f === 'all' ? stats.total : f === 'pending' ? stats.pending : stats.completed}
              </span>
            </button>
          ))}
        </div>

        {/* Spacer + User / Logout */}
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userDetails}>
              <p className={styles.username}>{user?.username}</p>
              <p className={styles.email}>{user?.email}</p>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={logout} title="Logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* ---- Main Content ---- */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>My Tasks</h1>
            <p className={styles.pageSubtitle}>
              {stats.pending > 0
                ? `${stats.pending} task${stats.pending !== 1 ? 's' : ''} pending`
                : 'All caught up! 🎉'}
            </p>
          </div>

          {/* Search */}
          <div className={styles.searchBox}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search tasks…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={styles.searchClear}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </header>

        {/* Task Creation Form */}
        <div className={styles.formSection}>
          <TaskForm onSubmit={createTask} loading={isCreating} />
        </div>

        {/* Task List */}
        <div className={styles.taskList}>
          {loading ? (
            <div className={styles.centerState}>
              <Spinner size="lg" />
              <p className={styles.stateText}>Loading your tasks…</p>
            </div>
          ) : error ? (
            <div className={styles.centerState}>
              <div className={styles.errorIcon}>!</div>
              <p className={styles.stateText}>{error}</p>
              <button onClick={fetchTasks} className={styles.retryBtn}>
                Try again
              </button>
            </div>
          ) : tasks.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIllustration}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p className={styles.emptyTitle}>
                {searchQuery
                  ? 'No tasks match your search'
                  : filter !== 'all'
                  ? `No ${filter} tasks`
                  : 'No tasks yet'}
              </p>
              <p className={styles.emptySubtitle}>
                {!searchQuery && filter === 'all' && 'Create your first task above to get started'}
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onUpdate={updateTask}
                onDelete={deleteTask}
                actionLoading={actionLoading}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
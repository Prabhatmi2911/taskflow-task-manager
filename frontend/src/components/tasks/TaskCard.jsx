import React, { useState } from 'react';
import Spinner from '../common/Spinner';
import styles from './TaskCard.module.css';

/**
 * TaskCard — displays a single task with toggle, edit, and delete functionality.
 * Shows a confirmation dialog before deleting.
 */
export default function TaskCard({ task, onToggle, onUpdate, onDelete, actionLoading }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || '');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isCompleted = task.status === 'COMPLETED';
  const isToggling = actionLoading === `toggle-${task.id}`;
  const isDeleting = actionLoading === `delete-${task.id}`;
  const isUpdating = actionLoading === `update-${task.id}`;

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;
    const result = await onUpdate(task.id, {
      title: editTitle.trim(),
      description: editDesc.trim() || null,
    });
    if (result?.success !== false) {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDesc(task.description || '');
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete(task.id);
    } else {
      setConfirmDelete(true);
      // Auto-reset confirmation state after 3 seconds
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`${styles.card} ${isCompleted ? styles.completed : ''}`}
      style={{ animation: 'slideIn 0.2s ease' }}
    >
      {isEditing ? (
        /* ---- Edit Mode ---- */
        <div className={styles.editMode}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className={styles.editTitleInput}
            autoFocus
          />
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="Description (optional)"
            className={styles.editDescInput}
            rows={2}
          />
          <div className={styles.editActions}>
            <button onClick={handleCancelEdit} className={styles.cancelBtn} disabled={isUpdating}>
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className={styles.saveBtn}
              disabled={isUpdating || !editTitle.trim()}
            >
              {isUpdating ? <Spinner size="sm" color="white" /> : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        /* ---- View Mode ---- */
        <>
          <div className={styles.mainRow}>
            {/* Toggle Checkbox */}
            <button
              className={`${styles.checkbox} ${isCompleted ? styles.checked : ''}`}
              onClick={() => onToggle(task.id)}
              disabled={isToggling}
              aria-label={isCompleted ? 'Mark as pending' : 'Mark as complete'}
              title={isCompleted ? 'Mark as pending' : 'Mark as complete'}
            >
              {isToggling ? (
                <Spinner size="sm" color={isCompleted ? 'white' : 'primary'} />
              ) : isCompleted ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : null}
            </button>

            {/* Task Content */}
            <div className={styles.content}>
              <p className={`${styles.title} ${isCompleted ? styles.titleDone : ''}`}>
                {task.title}
              </p>
              {task.description && (
                <p className={styles.description}>{task.description}</p>
              )}
              <p className={styles.meta}>
                <span className={`${styles.badge} ${isCompleted ? styles.badgeComplete : styles.badgePending}`}>
                  {isCompleted ? 'Completed' : 'Pending'}
                </span>
                <span className={styles.date}>{formatDate(task.createdAt)}</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button
                className={styles.actionBtn}
                onClick={() => setIsEditing(true)}
                title="Edit task"
                aria-label="Edit task"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <button
                className={`${styles.actionBtn} ${styles.deleteBtn} ${confirmDelete ? styles.deleteBtnConfirm : ''}`}
                onClick={handleDeleteClick}
                disabled={isDeleting}
                title={confirmDelete ? 'Click again to confirm deletion' : 'Delete task'}
                aria-label={confirmDelete ? 'Confirm delete' : 'Delete task'}
              >
                {isDeleting ? (
                  <Spinner size="sm" color="white" />
                ) : confirmDelete ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {confirmDelete && (
            <p className={styles.deleteConfirmText}>
              Click delete again to confirm. This cannot be undone.
            </p>
          )}
        </>
      )}
    </div>
  );
}
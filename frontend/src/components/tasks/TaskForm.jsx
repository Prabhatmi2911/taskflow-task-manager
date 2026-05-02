import React, { useState } from 'react';
import Spinner from '../common/Spinner';
import styles from './TaskForm.module.css';

/**
 * TaskForm — form for creating a new task.
 * - Type title and press Enter OR click Add Task to submit
 * - Description is optional, shown after typing title
 */
export default function TaskForm({ onSubmit, loading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Task title is required');
      return;
    }

    const result = await onSubmit({
      title: trimmedTitle,
      description: description.trim() || null,
    });

    // Reset form on success
    if (result?.success !== false) {
      setTitle('');
      setDescription('');
      setError('');
      setIsExpanded(false);
    }
  };

  // Allow pressing Enter in title input to submit directly
  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (error) setError('');
    if (!isExpanded && e.target.value) setIsExpanded(true);
    if (!e.target.value) setIsExpanded(false);
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setError('');
    setIsExpanded(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputRow}>
        <div className={styles.addIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          onKeyDown={handleTitleKeyDown}
          placeholder="Add a new task… (press Enter to save quickly)"
          className={`${styles.titleInput} ${error ? styles.inputError : ''}`}
          maxLength={255}
          disabled={loading}
        />
        {/* Quick-add button visible when title typed but form not expanded yet */}
        {title.trim() && !isExpanded && (
          <button
            type="submit"
            className={styles.quickAddBtn}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" color="white" /> : 'Add'}
          </button>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {isExpanded && (
        <div className={styles.expandedSection}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)"
            className={styles.descInput}
            rows={3}
            maxLength={1000}
            disabled={loading}
          />
          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelBtn}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || !title.trim()}
            >
              {loading ? (
                <><Spinner size="sm" color="white" /> Adding…</>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                  Add Task
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
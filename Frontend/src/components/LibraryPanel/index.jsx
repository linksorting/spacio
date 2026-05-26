import { X } from 'lucide-react';
import styles from './LibraryPanel.module.css';

/**
 * @param {{ title: string, onClose: () => void }} props
 */
export default function LibraryPanel({ title, onClose }) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>{title}</span>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close panel">
          <X size={16} strokeWidth={2} />
        </button>
      </div>
      <div className={styles.emptyState}>
        {title} is coming soon.
        <br />
        Save designs and bookmark products here in a future update.
      </div>
    </div>
  );
}

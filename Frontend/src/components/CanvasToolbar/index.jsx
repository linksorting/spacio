import {
  ExternalLink,
  Home,
  Square,
  Upload,
} from 'lucide-react';
import styles from './CanvasToolbar.module.css';

/**
 * @param {{
 *   mode: '2d' | '3d',
 *   activeTool?: 'move' | 'wall' | 'room',
 *   onModeChange: (m: '2d' | '3d') => void,
 *   onAddWall: () => void,
 *   onAddRoom: () => void,
 *   onUploadFloorPlan: () => void,
 *   onExport: () => void,
 * }} props
 */
export default function CanvasToolbar({
  mode,
  activeTool = 'move',
  onModeChange,
  onAddWall,
  onAddRoom,
  onUploadFloorPlan,
  onExport,
}) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.centreActions}>
        <button
          type="button"
          className={`${styles.actionBtn} ${activeTool === 'wall' ? styles.actionBtnActive : ''}`}
          onClick={onAddWall}
        >
          <Square size={15} strokeWidth={2} aria-hidden />
          Wall
        </button>
        <button
          type="button"
          className={`${styles.actionBtn} ${activeTool === 'room' ? styles.actionBtnActive : ''}`}
          onClick={onAddRoom}
        >
          <Home size={15} strokeWidth={2} aria-hidden />
          Room
        </button>
        <button type="button" className={styles.actionBtn} onClick={onUploadFloorPlan}>
          <Upload size={15} strokeWidth={2} aria-hidden />
          Upload Floor Plan
        </button>
      </div>

      <div className={styles.rightActions}>
        <div className={styles.modeToggle}>
          <button
            type="button"
            className={`${styles.modeBtn} ${mode === '2d' ? styles.modeBtnActive : ''}`}
            onClick={() => onModeChange('2d')}
          >
            2D
          </button>
          <button
            type="button"
            className={`${styles.modeBtn} ${mode === '3d' ? styles.modeBtnActive : ''}`}
            onClick={() => onModeChange('3d')}
          >
            3D
          </button>
        </div>
        <button type="button" className={styles.exportBtn} onClick={onExport}>
          <ExternalLink size={14} strokeWidth={2} aria-hidden />
          Export 2D plans
        </button>
      </div>
    </div>
  );
}

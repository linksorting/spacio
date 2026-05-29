import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  DoorOpen,
  ExternalLink,
  Home,
  Layers,
  Square,
  Upload,
} from 'lucide-react';
import { OPENING_TYPES } from '@/lib/wallOpenings';
import styles from './CanvasToolbar.module.css';

/**
 * @param {{
 *   mode: '2d' | '3d',
 *   activeTool?: 'move' | 'wall' | 'room',
 *   showCeiling?: boolean,
 *   wallPlacementMode?: import('@/lib/wallOpenings.js').WallPlacementConfig | null,
 *   onModeChange: (m: '2d' | '3d') => void,
 *   onAddWall: () => void,
 *   onAddRoom: () => void,
 *   onSelectOpening: (cfg: import('@/lib/wallOpenings.js').WallPlacementConfig) => void,
 *   onToggleCeiling: () => void,
 *   onUploadFloorPlan: () => void,
 *   onExport: () => void,
 * }} props
 */
export default function CanvasToolbar({
  mode,
  activeTool = 'move',
  showCeiling = true,
  wallPlacementMode = null,
  onModeChange,
  onAddWall,
  onAddRoom,
  onSelectOpening,
  onToggleCeiling,
  onUploadFloorPlan,
  onExport,
}) {
  const [openingsOpen, setOpeningsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onDocClick = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpeningsOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

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

        <div className={styles.menuWrap} ref={menuRef}>
          <button
            type="button"
            className={`${styles.actionBtn} ${wallPlacementMode ? styles.actionBtnActive : ''}`}
            onClick={() => setOpeningsOpen((open) => !open)}
            title="Place doors, windows, and doorways on walls"
          >
            <DoorOpen size={15} strokeWidth={2} aria-hidden />
            Openings
            <ChevronDown size={14} aria-hidden />
          </button>
          {openingsOpen ? (
            <div className={styles.dropdown}>
              {OPENING_TYPES.map((cfg) => (
                <button
                  key={`${cfg.type}-${cfg.label}`}
                  type="button"
                  className={`${styles.dropdownItem} ${wallPlacementMode?.label === cfg.label ? styles.dropdownItemActive : ''}`}
                  onClick={() => {
                    onSelectOpening(cfg);
                    setOpeningsOpen(false);
                  }}
                >
                  <span>{cfg.label}</span>
                  <span className={styles.dropdownMeta}>{cfg.widthCm}×{cfg.heightCm} cm</span>
                </button>
              ))}
              {wallPlacementMode ? (
                <div className={styles.dropdownHint}>
                  Click on a wall in 3D to place · Esc to cancel
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className={`${styles.actionBtn} ${showCeiling ? styles.actionBtnActive : ''}`}
          onClick={onToggleCeiling}
          title="Toggle ceiling visibility in 3D"
        >
          <Layers size={15} strokeWidth={2} aria-hidden />
          Ceiling
        </button>
        <button type="button" className={styles.actionBtn} onClick={onUploadFloorPlan}>
          <Upload size={15} strokeWidth={2} aria-hidden />
          Import
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
          Export
        </button>
      </div>
    </div>
  );
}

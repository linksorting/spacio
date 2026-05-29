import { useEffect, useRef, useState } from 'react';



/**

 * Project selected item centre to screen space for move-handle overlay.

 * @param {{

 *   selectedItem: { x: number, z: number } | null,

 *   projectWorldToScreen: ((x: number, z: number) => { x: number, y: number } | null) | null,

 *   visible?: boolean,

 * }} props

 */

export default function MoveHandlesOverlay({ selectedItem, projectWorldToScreen, visible = true }) {

  const [position, setPosition] = useState(null);

  const lastScreenRef = useRef(null);



  useEffect(() => {

    if (!visible || !selectedItem || !projectWorldToScreen) {

      setPosition(null);

      lastScreenRef.current = null;

      return undefined;

    }



    let raf = 0;

    let lastTick = 0;

    const tick = (now) => {

      if (now - lastTick < 66) {

        raf = window.requestAnimationFrame(tick);

        return;

      }

      lastTick = now;



      const screen = projectWorldToScreen(selectedItem.x, selectedItem.z);

      if (!screen) {

        setPosition(null);

        lastScreenRef.current = null;

      } else {

        const prev = lastScreenRef.current;

        if (!prev || Math.abs(prev.x - screen.x) > 0.5 || Math.abs(prev.y - screen.y) > 0.5) {

          lastScreenRef.current = screen;

          setPosition(screen);

        }

      }

      raf = window.requestAnimationFrame(tick);

    };

    raf = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(raf);

  }, [projectWorldToScreen, selectedItem, visible]);



  if (!position) return null;



  return (

    <div

      id="move-handles"

      aria-hidden

      style={{

        position: 'fixed',

        left: position.x - 60,

        top: position.y - 60,

        width: 120,

        height: 120,

        pointerEvents: 'none',

        zIndex: 20,

        userSelect: 'none',

      }}

    >

      {[

        { label: '↑', top: 0, left: 45 },

        { label: '↓', top: 90, left: 45 },

        { label: '←', top: 45, left: 0 },

        { label: '→', top: 45, left: 90 },

      ].map((arrow) => (

        <div

          key={arrow.label}

          style={{

            position: 'absolute',

            top: arrow.top,

            left: arrow.left,

            width: 30,

            height: 30,

            display: 'flex',

            alignItems: 'center',

            justifyContent: 'center',

            fontSize: 18,

            color: '#6366f1',

            opacity: 0.85,

            textShadow: '0 0 6px rgba(99,102,241,0.6)',

          }}

        >

          {arrow.label}

        </div>

      ))}

    </div>

  );

}


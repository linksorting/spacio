/**
 * RoomFloorPlan – architectural-style top-down SVG floor plan diagrams.
 * One template per room type, all drawn to a consistent 420×320 viewBox.
 * Uses standard architectural conventions: thick walls, door-swing arcs,
 * hatched window glass, labelled furniture.
 */

// ─── SHARED HELPERS ──────────────────────────────────────────────────────────

const W  = '#1a1210';   // wall fill
const FL = '#faf5ef';   // floor fill
const WG = '#bde0f5';   // window glass
const DW = '#7a5e3a';   // door wood
const TL = '#888070';   // label text

function Label({ x, y, text, size = 7, anchor = 'middle', color = TL }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size}
      fontFamily="'DM Sans', sans-serif" fill={color} fontStyle="italic"
    >{text}</text>
  );
}

/** Horizontal window slot cut into a top or bottom wall */
function WindowH({ x, y, w, wallH = 8 }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={wallH} fill={FL} />
      <rect x={x} y={y + 1} width={w} height={wallH - 2} fill={WG} opacity={0.85} />
      <line x1={x} y1={y + wallH / 2} x2={x + w} y2={y + wallH / 2} stroke="#5a9ec8" strokeWidth={0.7} />
      <line x1={x + w / 2} y1={y + 1} x2={x + w / 2} y2={y + wallH - 1} stroke="#5a9ec8" strokeWidth={0.7} />
    </g>
  );
}

/** Vertical window slot cut into a left or right wall */
function WindowV({ x, y, h, wallW = 8 }) {
  return (
    <g>
      <rect x={x} y={y} width={wallW} height={h} fill={FL} />
      <rect x={x + 1} y={y} width={wallW - 2} height={h} fill={WG} opacity={0.85} />
      <line x1={x + wallW / 2} y1={y} x2={x + wallW / 2} y2={y + h} stroke="#5a9ec8" strokeWidth={0.7} />
      <line x1={x + 1} y1={y + h / 2} x2={x + wallW - 1} y2={y + h / 2} stroke="#5a9ec8" strokeWidth={0.7} />
    </g>
  );
}

/** Door cut + swing arc in a horizontal wall (bottom face, swing into room = upward) */
function DoorH({ x, wallY, w, wallH = 8, swingUp = true }) {
  const sx = swingUp ? x : x + w;
  const sy = wallY;
  const ex = swingUp ? x + w : x;
  const sweep = swingUp ? 1 : 0;
  return (
    <g>
      <rect x={x} y={wallY} width={w} height={wallH} fill={FL} />
      <path d={`M${sx} ${sy} A${w} ${w} 0 0 ${sweep} ${ex} ${sy - w}`}
        fill="none" stroke="#8a8a8a" strokeWidth={0.9} strokeDasharray="3 2" />
      <line x1={sx} y1={sy} x2={ex} y2={sy - w} stroke={W} strokeWidth={1} />
    </g>
  );
}

/** Door cut + swing arc in a vertical wall (right face, swing into room = leftward) */
function DoorV({ wallX, y, h, wallW = 8, swingLeft = true }) {
  const sy = swingLeft ? y : y + h;
  const ey = swingLeft ? y + h : y;
  const ex = wallX + (swingLeft ? -h : h);
  const sweep = swingLeft ? 0 : 1;
  return (
    <g>
      <rect x={wallX} y={y} width={wallW} height={h} fill={FL} />
      <path d={`M${wallX} ${sy} A${h} ${h} 0 0 ${sweep} ${ex} ${ey}`}
        fill="none" stroke="#8a8a8a" strokeWidth={0.9} strokeDasharray="3 2" />
      <line x1={wallX} y1={sy} x2={ex} y2={ey} stroke={W} strokeWidth={1} />
    </g>
  );
}

/** Simple dimension line with arrows + label */
function Dim({ x1, y1, x2, y2, label, offset = 12 }) {
  const isH = Math.abs(y2 - y1) < 4;
  const lx = isH ? (x1 + x2) / 2 : x1 - offset;
  const ly = isH ? y1 - offset + 4 : (y1 + y2) / 2;
  const anchor = isH ? 'middle' : 'end';
  const rot = isH ? 0 : -90;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#aaa" strokeWidth={0.7} markerEnd="none" />
      <line x1={x1} y1={y1 - 3} x2={x1} y2={y1 + 3} stroke="#aaa" strokeWidth={0.7} />
      <line x1={x2} y1={y2 - 3} x2={x2} y2={y2 + 3} stroke="#aaa" strokeWidth={0.7} />
      <text x={lx} y={ly} textAnchor={anchor} fontSize={7} fill="#aaa"
        fontFamily="'DM Sans', sans-serif" transform={rot ? `rotate(${rot},${lx},${ly})` : undefined}
      >{label}</text>
    </g>
  );
}

// ─── ROOM PLAN COMPONENTS ─────────────────────────────────────────────────────

function LivingRoomPlan() {
  /* Room 6.0 × 4.8 m — 1 m = 44 px — inner: 56→320, 30→241 */
  return (
    <svg viewBox="0 0 420 290" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      {/* floor */}
      <rect x={56} y={30} width={264} height={211} fill={FL} />
      {/* walls */}
      <rect x={48} y={22} width={280} height={8}   fill={W} />  {/* top */}
      <rect x={48} y={233} width={280} height={8}  fill={W} />  {/* bottom */}
      <rect x={48} y={22} width={8}   height={219} fill={W} />  {/* left */}
      <rect x={320} y={22} width={8}  height={219} fill={W} />  {/* right */}
      {/* window — top wall centre */}
      <WindowH x={130} y={22} w={120} />
      {/* window — right wall mid */}
      <WindowV x={320} y={90} h={80} />
      {/* door — bottom-left */}
      <DoorH x={60} wallY={233} w={44} swingUp />
      {/* TV unit against top wall */}
      <rect x={120} y={38} width={136} height={24} rx={2} fill="#5a4030" stroke="#2a1a0a" strokeWidth={1} />
      <rect x={126} y={42} width={124} height={15} fill="#1a1210" />
      <Label x={188} y={73} text="TV unit" />
      {/* 3-seat sofa against bottom wall */}
      <rect x={68} y={186} width={168} height={44} rx={2} fill="#3f443e" stroke="#121212" strokeWidth={1.2} />
      <rect x={70} y={186} width={164} height={11} fill="#292d29" />
      <rect x={70} y={197} width={13} height={31} fill="#30342f" />
      <rect x={223} y={197} width={13} height={31} fill="#30342f" />
      {[84, 112, 140, 168, 196].map(px => (
        <rect key={px} x={px} y={200} width={26} height={26} rx={1.5} fill="#565b52" stroke="#1a1a1a" strokeWidth={0.5} />
      ))}
      <Label x={152} y={244} text="Sofa (3-seat)" />
      {/* round coffee table */}
      <ellipse cx={175} cy={162} rx={42} ry={22} fill="#6b6259" stroke="#111" strokeWidth={1.2} />
      <ellipse cx={175} cy={162} rx={32} ry={15} fill="#756c62" />
      <Label x={175} y={166} text="Coffee table" size={6} color="#f0e8df" />
      {/* armchair right side */}
      <rect x={254} y={180} width={56} height={56} rx={2} fill="#3f443e" stroke="#121212" strokeWidth={1} />
      <rect x={256} y={180} width={52} height={10} fill="#292d29" />
      <rect x={256} y={190} width={11} height={44} fill="#30342f" />
      <rect x={299} y={190} width={11} height={44} fill="#30342f" />
      <rect x={269} y={194} width={28} height={38} rx={2} fill="#565b52" />
      <Label x={282} y={248} text="Chair" />
      {/* console / media unit left */}
      <rect x={60} y={62} width={48} height={20} rx={1} fill="#7a5e3a" stroke="#2a1f10" strokeWidth={1} />
      <Label x={84} y={95} text="Console" />
      {/* plant */}
      <circle cx={304} cy={220} r={15} fill="#3d6a30" stroke="#1f3a18" strokeWidth={1} />
      <circle cx={297} cy={214} r={8} fill="#4d7a3a" opacity={0.8} />
      <circle cx={310} cy={216} r={7} fill="#4d7a3a" opacity={0.8} />
      <rect x={297} y={228} width={14} height={9} fill="#7a5535" />
      <Label x={305} y={252} text="Plant" />
      {/* rug */}
      <rect x={92} y={155} width={210} height={70} rx={3} fill="none" stroke="#c9a87a" strokeWidth={1.2} strokeDasharray="5 3" />
      {/* dims */}
      <Dim x1={48} y1={14} x2={328} y2={14} label="6.4 m" />
      <Dim x1={360} y1={22} x2={360} y2={241} label="4.8 m" />
      {/* title */}
      <Label x={210} y={278} text="LIVING ROOM" size={9} color="#3d2820" />
    </svg>
  );
}

function KitchenPlan() {
  /* L-shaped kitchen run, island, 4.2 × 3.8 m */
  return (
    <svg viewBox="0 0 420 320" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      {/* floor */}
      <rect x={50} y={30} width={280} height={230} fill={FL} />
      {/* walls */}
      <rect x={42} y={22} width={296} height={8}   fill={W} />
      <rect x={42} y={260} width={296} height={8}  fill={W} />
      <rect x={42} y={22} width={8}   height={246} fill={W} />
      <rect x={330} y={22} width={8}  height={246} fill={W} />
      {/* window top wall above sink */}
      <WindowH x={140} y={22} w={100} />
      {/* window right wall */}
      <WindowV x={330} y={60} h={80} />
      {/* door bottom */}
      <DoorH x={56} wallY={260} w={50} swingUp />

      {/* COUNTER RUN — top wall (base cabinets) */}
      <rect x={50} y={30} width={280} height={50} fill="#9c8a70" stroke="#4a3826" strokeWidth={1} />
      <rect x={50} y={33} width={88} height={44} rx={1.5} fill="#b0a080" stroke="#5a4830" strokeWidth={1} />
      <rect x={140} y={33} width={100} height={44} rx={1.5} fill="#b0a080" stroke="#5a4830" strokeWidth={1} />
      <rect x={242} y={33} width={88} height={44} rx={1.5} fill="#b0a080" stroke="#5a4830" strokeWidth={1} />
      {/* stove on top counter */}
      <rect x={145} y={35} width={55} height={42} rx={1} fill="#c8cdd2" stroke="#555" strokeWidth={1} />
      <circle cx={160} cy={48} r={8} fill="#b0b8c0" stroke="#666" strokeWidth={1} />
      <circle cx={160} cy={48} r={4.5} fill="#888" />
      <circle cx={188} cy={48} r={8} fill="#b0b8c0" stroke="#666" strokeWidth={1} />
      <circle cx={188} cy={48} r={4.5} fill="#888" />
      <circle cx={160} cy={68} r={6} fill="#b0b8c0" stroke="#666" strokeWidth={1} />
      <circle cx={188} cy={68} r={6} fill="#b0b8c0" stroke="#666" strokeWidth={1} />
      <Label x={174} y={88} text="Gas Stove" size={6} />
      {/* fridge on right end of top counter */}
      <rect x={248} y={33} width={42} height={44} rx={1} fill="#dde2e7" stroke="#555" strokeWidth={1} />
      <rect x={252} y={37} width={34} height={18} rx={1} fill="#c8d0d8" />
      <rect x={252} y={57} width={34} height={16} rx={1} fill="#d5dbe0" />
      <rect x={280} y={43} width={4} height={9} rx={1} fill="#a0a8b0" />
      <Label x={270} y={88} text="Fridge" size={6} />
      {/* sink niche in top counter */}
      <rect x={66} y={35} width={60} height={42} rx={1} fill="#c4d8e2" stroke="#5a7888" strokeWidth={1} />
      <ellipse cx={96} cy={52} rx={18} ry={12} fill="#d8eaf0" stroke="#7a9aaa" strokeWidth={1} />
      <circle cx={96} cy={52} r={3} fill="#5a7888" />
      <Label x={96} y={88} text="Sink" size={6} />

      {/* COUNTER RUN — left wall */}
      <rect x={50} y={80} width={50} height={152} fill="#9c8a70" stroke="#4a3826" strokeWidth={1} />
      <rect x={52} y={83} width={46} height={45} rx={1.5} fill="#b0a080" stroke="#5a4830" strokeWidth={1} />
      <rect x={52} y={132} width={46} height={45} rx={1.5} fill="#b0a080" stroke="#5a4830" strokeWidth={1} />
      <rect x={52} y={181} width={46} height={48} rx={1.5} fill="#b0a080" stroke="#5a4830" strokeWidth={1} />
      <Label x={75} y={246} text="Cabinets" size={6} />

      {/* WALL MODULES above top counter */}
      <rect x={50} y={22} width={280} height={8} fill={W} />
      <rect x={55} y={24} width={270} height={5} fill="#c8b8a0" stroke="#7a6040" strokeWidth={0.5} />

      {/* ISLAND */}
      <rect x={136} y={158} width={150} height={70} rx={3} fill="#9c8878" stroke="#5a4030" strokeWidth={1.2} />
      <rect x={140} y={162} width={142} height={62} rx={2} fill="#b0a090" stroke="#6a5040" strokeWidth={0.8} />
      {/* cooktop in island */}
      <rect x={155} y={168} width={50} height={38} rx={1} fill="#d0d5da" stroke="#555" strokeWidth={1} />
      <circle cx={168} cy={180} r={6} fill="#b0b8c0" stroke="#555" strokeWidth={0.8} />
      <circle cx={193} cy={180} r={6} fill="#b0b8c0" stroke="#555" strokeWidth={0.8} />
      <circle cx={168} cy={196} r={5} fill="#b0b8c0" stroke="#555" strokeWidth={0.8} />
      <circle cx={193} cy={196} r={5} fill="#b0b8c0" stroke="#555" strokeWidth={0.8} />
      <Label x={211} y={200} text="Cooktop" size={5} />
      <Label x={211} y={240} text="Island" size={7} />

      {/* bar stools at island south side */}
      {[148, 192, 236, 280].map(sx => (
        <circle key={sx} cx={sx} cy={244} r={10} fill="#4a4f48" stroke="#121212" strokeWidth={1} />
      ))}
      <Label x={214} y={264} text="Bar stools" size={6} />

      {/* pendant lights above island */}
      <circle cx={165} cy={144} r={6} fill="#efc2b6" stroke="#c07060" strokeWidth={0.8} />
      <circle cx={211} cy={144} r={6} fill="#efc2b6" stroke="#c07060" strokeWidth={0.8} />
      <circle cx={257} cy={144} r={6} fill="#efc2b6" stroke="#c07060" strokeWidth={0.8} />
      <line x1={165} y1={30} x2={165} y2={138} stroke="#aaa" strokeWidth={0.5} strokeDasharray="2 2" />
      <line x1={211} y1={30} x2={211} y2={138} stroke="#aaa" strokeWidth={0.5} strokeDasharray="2 2" />
      <line x1={257} y1={30} x2={257} y2={138} stroke="#aaa" strokeWidth={0.5} strokeDasharray="2 2" />
      <Label x={211} y={140} text="Pendants" size={5} color="#c07060" />

      {/* dims */}
      <Dim x1={42} y1={14} x2={338} y2={14} label="6.6 m" />
      <Dim x1={376} y1={22} x2={376} y2={268} label="5.0 m" />
      <Label x={210} y={308} text="KITCHEN" size={9} color="#3d2820" />
    </svg>
  );
}

function BedroomPlan() {
  /* 4.5 × 4.0 m master bedroom with ensuite nook */
  return (
    <svg viewBox="0 0 420 310" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      {/* floor */}
      <rect x={50} y={30} width={280} height={220} fill={FL} />
      {/* walls */}
      <rect x={42} y={22} width={296} height={8}   fill={W} />
      <rect x={42} y={250} width={296} height={8}  fill={W} />
      <rect x={42} y={22} width={8}   height={236} fill={W} />
      <rect x={330} y={22} width={8}  height={236} fill={W} />
      {/* two windows — top wall */}
      <WindowH x={90} y={22} w={80} />
      <WindowH x={210} y={22} w={80} />
      {/* door — bottom right */}
      <DoorH x={264} wallY={250} w={48} swingUp={false} />

      {/* wardrobe wall — full left wall */}
      <rect x={50} y={30} width={60} height={220} fill="#7a5e3a" stroke="#2a1f10" strokeWidth={1} />
      <line x1={50} y1={80} x2={110} y2={80} stroke="#2a1f10" strokeWidth={0.7} />
      <line x1={50} y1={130} x2={110} y2={130} stroke="#2a1f10" strokeWidth={0.7} />
      <line x1={50} y1={180} x2={110} y2={180} stroke="#2a1f10" strokeWidth={0.7} />
      <line x1={50} y1={230} x2={110} y2={230} stroke="#2a1f10" strokeWidth={0.7} />
      <circle cx={107} cy={55}  r={2} fill="#2a1f10" />
      <circle cx={107} cy={105} r={2} fill="#2a1f10" />
      <circle cx={107} cy={155} r={2} fill="#2a1f10" />
      <circle cx={107} cy={205} r={2} fill="#2a1f10" />
      <Label x={80} y={248} text="Wardrobe" size={6} />

      {/* bed — centred in room right section */}
      <rect x={146} y={68} width={140} height={150} rx={4} fill="#d8d2c8" stroke="#5a5040" strokeWidth={1.4} />
      <rect x={146} y={68} width={140} height={28} rx={3} fill="#7a6b55" />
      <rect x={152} y={72} width={56} height={22} rx={3} fill="#fff" stroke="#bbb" strokeWidth={0.6} />
      <rect x={222} y={72} width={56} height={22} rx={3} fill="#fff" stroke="#bbb" strokeWidth={0.6} />
      <line x1={146} y1={150} x2={286} y2={150} stroke="#5a5040" strokeWidth={0.8} opacity={0.6} />
      <Label x={216} y={230} text="Bed (King)" />

      {/* nightstands */}
      <rect x={114} y={90} width={30} height={30} rx={1.5} fill="#8a6a4a" stroke="#2a1f10" strokeWidth={1} />
      <circle cx={129} cy={105} r={2} fill="#2a1f10" />
      <rect x={288} y={90} width={30} height={30} rx={1.5} fill="#8a6a4a" stroke="#2a1f10" strokeWidth={1} />
      <circle cx={303} cy={105} r={2} fill="#2a1f10" />
      <Label x={129} y={131} text="NS" size={5} />
      <Label x={303} y={131} text="NS" size={5} />

      {/* pendant lights */}
      <circle cx={196} cy={56} r={6} fill="#f0e0d0" stroke="#c07060" strokeWidth={0.8} />
      <circle cx={236} cy={56} r={6} fill="#f0e0d0" stroke="#c07060" strokeWidth={0.8} />

      {/* dresser at far right */}
      <rect x={290} y={168} width={38} height={70} rx={2} fill="#8a6a4a" stroke="#2a1f10" strokeWidth={1} />
      <line x1={290} y1={203} x2={328} y2={203} stroke="#2a1f10" strokeWidth={0.7} />
      <circle cx={286} cy={185} r={2} fill="#2a1f10" />
      <circle cx={286} cy={220} r={2} fill="#2a1f10" />
      <Label x={309} y={250} text="Dresser" size={6} />

      {/* rug */}
      <rect x={130} y={160} width={164} height={78} rx={3} fill="none" stroke="#c9a87a" strokeWidth={1.2} strokeDasharray="5 3" />

      {/* floor lamp */}
      <circle cx={126} cy={168} r={7} fill="#3d6a30" stroke="#1f3a18" strokeWidth={0.8} />
      <Label x={126} y={183} text="Lamp" size={5} />

      {/* dims */}
      <Dim x1={42} y1={14} x2={338} y2={14} label="5.6 m" />
      <Dim x1={376} y1={22} x2={376} y2={258} label="4.5 m" />
      <Label x={210} y={298} text="BEDROOM" size={9} color="#3d2820" />
    </svg>
  );
}

function BathroomPlan() {
  /* 2.8 × 2.2 m — 1 m = 70 px — inner: 70→266, 30→184 */
  return (
    <svg viewBox="0 0 370 270" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      {/* floor */}
      <rect x={70} y={30} width={196} height={154} fill="#e8f4f8" />
      {/* walls */}
      <rect x={62} y={22} width={212} height={8}  fill={W} />
      <rect x={62} y={184} width={212} height={8} fill={W} />
      <rect x={62} y={22} width={8}   height={170} fill={W} />
      <rect x={266} y={22} width={8}  height={170} fill={W} />
      {/* frosted window top wall */}
      <WindowH x={142} y={22} w={80} />
      {/* door right wall */}
      <DoorV wallX={266} y={130} h={46} swingLeft />

      {/* FREESTANDING BATHTUB — centre-left */}
      <rect x={80} y={40} width={80} height={44} rx={8} fill="#dce9f0" stroke="#4a6a80" strokeWidth={1.4} />
      <rect x={86} y={46} width={68} height={32} rx={6} fill="#edf5fa" stroke="#6a8a9a" strokeWidth={0.8} />
      <ellipse cx={120} cy={62} rx={27} ry={14} fill="#f4f9fc" />
      <rect x={82} y={38} width={72} height={9} rx={3} fill="#cddde8" stroke="#5a7888" strokeWidth={0.8} />
      <circle cx={106} cy={44} r={3.5} fill="#8aaab8" />
      <circle cx={134} cy={44} r={3.5} fill="#8aaab8" />
      <Label x={120} y={96} text="Freestanding Tub" size={6} />

      {/* GLASS SHOWER — top right */}
      <rect x={176} y={30} width={82} height={82} rx={2} fill="#cee0ea" stroke="#4a6a80" strokeWidth={1.4} />
      <rect x={180} y={34} width={74} height={74} rx={2} fill="#e0eff7" stroke="#6a8898" strokeWidth={0.8} />
      {[34, 50, 66, 82, 98].map(yy => (
        <line key={yy} x1={180} y1={yy} x2={254} y2={yy} stroke="#b8d0dc" strokeWidth={0.4} opacity={0.7} />
      ))}
      {[196, 212, 228, 244].map(xx => (
        <line key={xx} x1={xx} y1={34} x2={xx} y2={108} stroke="#b8d0dc" strokeWidth={0.4} opacity={0.7} />
      ))}
      <circle cx={217} cy={71} r={5.5} fill="#88b0c5" stroke="#4a6a80" strokeWidth={1} />
      <circle cx={217} cy={71} r={2.5} fill="#5a8aa0" />
      <line x1={176} y1={30} x2={176} y2={112} stroke="#88b8d0" strokeWidth={1.4} />
      <Label x={217} y={122} text="Shower" size={6} />

      {/* VANITY UNIT — bottom wall */}
      <rect x={70} y={140} width={100} height={36} rx={2} fill="#b8c5cc" stroke="#4a6070" strokeWidth={1.2} />
      <ellipse cx={120} cy={158} rx={28} ry={14} fill="#dde9f0" stroke="#7a9aaa" strokeWidth={0.8} />
      <ellipse cx={120} cy={158} rx={16} ry={8} fill="#e8f2f7" stroke="#88a8ba" strokeWidth={0.6} />
      <circle cx={120} cy={158} r={3} fill="#5a7888" />
      <rect x={104} y={140} width={32} height={7} rx={2} fill="#9ab8c8" stroke="#5a7888" strokeWidth={0.6} />
      <Label x={120} y={188} text="Vanity + Basin" size={6} />

      {/* TOILET — bottom right */}
      <rect x={194} y={130} width={30} height={14} rx={2} fill="#d8d8d6" stroke="#555" strokeWidth={1} />
      <ellipse cx={209} cy={160} rx={22} ry={24} fill="#e5e5e3" stroke="#555" strokeWidth={1.2} />
      <ellipse cx={209} cy={162} rx={14} ry={18} fill="#f0f0ee" stroke="#777" strokeWidth={0.6} />
      <Label x={209} y={190} text="Toilet" size={6} />

      {/* towel rack right wall */}
      <rect x={258} y={68} width={6} height={42} rx={2} fill="#9aacb8" stroke="#5a6a78" strokeWidth={0.8} />
      <Label x={260} y={122} text="Rack" size={5} />

      {/* dims */}
      <Dim x1={62} y1={14} x2={274} y2={14} label="3.0 m" />
      <Dim x1={310} y1={22} x2={310} y2={192} label="2.3 m" />
      <Label x={185} y={255} text="BATHROOM" size={9} color="#3d2820" />
    </svg>
  );
}

function DiningPlan() {
  /* 4.0 × 3.6 m formal dining */
  return (
    <svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      {/* floor */}
      <rect x={50} y={30} width={270} height={210} fill={FL} />
      {/* walls */}
      <rect x={42} y={22} width={286} height={8}  fill={W} />
      <rect x={42} y={240} width={286} height={8} fill={W} />
      <rect x={42} y={22} width={8}   height={226} fill={W} />
      <rect x={320} y={22} width={8}  height={226} fill={W} />
      {/* 2 windows top wall */}
      <WindowH x={80} y={22} w={70} />
      <WindowH x={220} y={22} w={70} />
      {/* door right wall */}
      <DoorV wallX={320} y={30} h={50} swingLeft />

      {/* ORNATE SIDEBOARD */}
      <rect x={56} y={38} width={130} height={34} rx={2} fill="#7a5e3a" stroke="#2a1f10" strokeWidth={1} />
      <line x1={121} y1={38} x2={121} y2={72} stroke="#2a1f10" strokeWidth={0.7} />
      <circle cx={118} cy={55} r={2} fill="#2a1f10" />
      <circle cx={124} cy={55} r={2} fill="#2a1f10" />
      <Label x={121} y={82} text="Sideboard" />

      {/* DINING TABLE */}
      <rect x={96} y={106} width={178} height={100} rx={3} fill="#6b6259" stroke="#111" strokeWidth={1.4} />
      <line x1={96} y1={156} x2={274} y2={156} stroke="#222" strokeWidth={0.7} opacity={0.6} />
      <line x1={185} y1={106} x2={185} y2={206} stroke="#222" strokeWidth={0.7} opacity={0.4} />
      <Label x={185} y={162} text="Dining Table" size={7} color={FL} />

      {/* chairs — top row */}
      {[112, 162, 212, 258].map(cx => (
        <rect key={cx} x={cx - 14} y={84} width={28} height={20} rx={2} fill="#4a4f48" stroke="#121212" strokeWidth={1} />
      ))}
      {/* chairs — bottom row */}
      {[112, 162, 212, 258].map(cx => (
        <rect key={cx} x={cx - 14} y={208} width={28} height={20} rx={2} fill="#4a4f48" stroke="#121212" strokeWidth={1} />
      ))}
      {/* chairs — left */}
      <rect x={74} y={120} width={20} height={28} rx={2} fill="#4a4f48" stroke="#121212" strokeWidth={1} />
      <rect x={74} y={160} width={20} height={28} rx={2} fill="#4a4f48" stroke="#121212" strokeWidth={1} />
      {/* chairs — right */}
      <rect x={276} y={120} width={20} height={28} rx={2} fill="#4a4f48" stroke="#121212" strokeWidth={1} />
      <rect x={276} y={160} width={20} height={28} rx={2} fill="#4a4f48" stroke="#121212" strokeWidth={1} />
      <Label x={185} y={238} text="10 chairs" size={6} />

      {/* pendant above table */}
      <circle cx={185} cy={96} r={9} fill="#f0e0d0" stroke="#c07060" strokeWidth={1} />
      <line x1={185} y1={22} x2={185} y2={87} stroke="#aaa" strokeWidth={0.6} strokeDasharray="2 2" />
      <Label x={185} y={91} text="●" size={5} color="#c07060" />

      {/* plant corner */}
      <circle cx={294} cy={218} r={16} fill="#3d6a30" stroke="#1f3a18" strokeWidth={1} />
      <Label x={294} y={244} text="Plant" size={6} />

      {/* rug */}
      <rect x={72} y={82} width={226} height={152} rx={4} fill="none" stroke="#c9a87a" strokeWidth={1.2} strokeDasharray="5 3" />

      {/* dims */}
      <Dim x1={42} y1={14} x2={328} y2={14} label="5.4 m" />
      <Dim x1={366} y1={22} x2={366} y2={248} label="4.2 m" />
      <Label x={210} y={286} text="DINING ROOM" size={9} color="#3d2820" />
    </svg>
  );
}

function HousePlan() {
  /* Compact 2-bed apartment floor plan ~8 × 6 m */
  return (
    <svg viewBox="0 0 520 400" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      {/* overall boundary */}
      <rect x={28} y={20} width={466} height={340} fill={FL} stroke={W} strokeWidth={8} />

      {/* ── INTERIOR PARTITION WALLS ── */}
      {/* vertical wall dividing living+kitchen from bedrooms */}
      <rect x={296} y={20} width={8} height={340} fill={W} />
      {/* horizontal wall splitting bedroom 1 from bedroom 2 */}
      <rect x={296} y={190} width={198} height={8} fill={W} />
      {/* bathroom partition off hallway */}
      <rect x={200} y={230} width={8} height={130} fill={W} />
      {/* horizontal hallway wall */}
      <rect x={28} y={230} width={180} height={8} fill={W} />

      {/* ── ROOM LABELS ── */}
      <text x={155} y={128} textAnchor="middle" fontSize={11} fontWeight="600" fill="#3d2820"
        fontFamily="'DM Sans', sans-serif">LIVING ROOM</text>
      <text x={155} y={60} textAnchor="middle" fontSize={11} fontWeight="600" fill="#3d2820"
        fontFamily="'DM Sans', sans-serif">KITCHEN</text>
      <text x={395} y={108} textAnchor="middle" fontSize={11} fontWeight="600" fill="#3d2820"
        fontFamily="'DM Sans', sans-serif">BEDROOM 1</text>
      <text x={395} y={285} textAnchor="middle" fontSize={11} fontWeight="600" fill="#3d2820"
        fontFamily="'DM Sans', sans-serif">BEDROOM 2</text>
      <text x={104} y={285} textAnchor="middle" fontSize={10} fontWeight="600" fill="#3d2820"
        fontFamily="'DM Sans', sans-serif">HALLWAY</text>
      <text x={248} y={310} textAnchor="middle" fontSize={10} fontWeight="600" fill="#3d2820"
        fontFamily="'DM Sans', sans-serif">BATHROOM</text>

      {/* ── WINDOWS ── */}
      {/* kitchen top */}
      <WindowH x={100} y={20} w={90} />
      {/* living room top */}
      <WindowH x={100} y={20} w={90} />
      <WindowH x={60} y={228} w={80} />
      {/* bedroom 1 top */}
      <WindowH x={340} y={20} w={90} />
      {/* bedroom 1 right */}
      <WindowV x={486} y={40} h={80} />
      {/* bedroom 2 right */}
      <WindowV x={486} y={218} h={80} />

      {/* ── DOORS ── */}
      {/* front door bottom-left */}
      <DoorH x={46} wallY={352} w={50} swingUp />
      {/* living → hallway */}
      <DoorH x={80} wallY={230} w={42} swingUp={false} />
      {/* bath door */}
      <DoorV wallX={200} y={280} h={42} swingLeft={false} />
      {/* bedroom 1 door */}
      <DoorH x={320} wallY={190} w={42} swingUp />
      {/* bedroom 2 door */}
      <DoorH x={320} wallY={352} w={42} swingUp />

      {/* ── KITCHEN FURNITURE ── */}
      <rect x={36} y={28} width={260} height={44} fill="#9c8a70" stroke="#4a3826" strokeWidth={1} />
      {/* stove */}
      <rect x={120} y={30} width={50} height={40} rx={1} fill="#c8cdd2" stroke="#555" strokeWidth={0.8} />
      <circle cx={133} cy={43} r={6} fill="#888" />
      <circle cx={157} cy={43} r={6} fill="#888" />
      <circle cx={133} cy={60} r={5} fill="#888" />
      <circle cx={157} cy={60} r={5} fill="#888" />
      {/* fridge */}
      <rect x={268} y={30} width={28} height={40} rx={1} fill="#dde2e7" stroke="#555" strokeWidth={0.8} />

      {/* ── LIVING ROOM FURNITURE ── */}
      {/* sofa */}
      <rect x={48} y={148} width={140} height={50} rx={2} fill="#3f443e" stroke="#121212" strokeWidth={1} />
      <rect x={50} y={148} width={136} height={11} fill="#292d29" />
      {/* coffee table */}
      <rect x={90} y={108} width={80} height={38} rx={2} fill="#6b6259" stroke="#111" strokeWidth={1} />
      {/* armchair */}
      <rect x={230} y={140} width={52} height={55} rx={2} fill="#3f443e" stroke="#121212" strokeWidth={1} />
      <rect x={232} y={140} width={48} height={10} fill="#292d29" />

      {/* ── BEDROOM 1 FURNITURE ── */}
      <rect x={330} y={32} width={110} height={140} rx={4} fill="#d8d2c8" stroke="#5a5040" strokeWidth={1.2} />
      <rect x={330} y={32} width={110} height={24} rx={3} fill="#7a6b55" />
      <rect x={466} y={62} width={20} height={24} rx={1.5} fill="#8a6a4a" stroke="#2a1f10" strokeWidth={0.8} />
      {/* wardrobe bed 1 */}
      <rect x={304} y={32} width={26} height={158} fill="#7a5e3a" stroke="#2a1f10" strokeWidth={0.8} />

      {/* ── BEDROOM 2 FURNITURE ── */}
      <rect x={330} y={210} width={110} height={130} rx={4} fill="#d8d2c8" stroke="#5a5040" strokeWidth={1.2} />
      <rect x={330} y={210} width={110} height={24} rx={3} fill="#7a6b55" />
      <rect x={304} y={210} width={26} height={142} fill="#7a5e3a" stroke="#2a1f10" strokeWidth={0.8} />

      {/* ── BATHROOM ── */}
      {/* bath */}
      <rect x={212} y={242} width={62} height={35} rx={5} fill="#dce9f0" stroke="#4a6a80" strokeWidth={1} />
      <ellipse cx={243} cy={259} rx={22} ry={12} fill="#f4f9fc" />
      {/* toilet */}
      <rect x={280} y={240} width={21} height={12} rx={2} fill="#d8d8d6" stroke="#555" strokeWidth={0.8} />
      <ellipse cx={290} cy={261} rx={15} ry={20} fill="#e5e5e3" stroke="#555" strokeWidth={1} />
      {/* vanity */}
      <rect x={212} y={298} width={80} height={28} rx={2} fill="#b8c5cc" stroke="#4a6070" strokeWidth={1} />
      <ellipse cx={252} cy={312} rx={22} ry={10} fill="#dde9f0" />

      {/* dims */}
      <Dim x1={28} y1={10} x2={494} y2={10} label="9.0 m" />
      <Dim x1={508} y1={20} x2={508} y2={360} label="6.5 m" />
      <Label x={265} y={390} text="APARTMENT FLOOR PLAN" size={10} color="#3d2820" />
    </svg>
  );
}

// ─── PUBLIC COMPONENT ─────────────────────────────────────────────────────────

const PLANS = {
  'Living Room': LivingRoomPlan,
  'Kitchen':     KitchenPlan,
  'Bedroom':     BedroomPlan,
  'Bathroom':    BathroomPlan,
  'Dining':      DiningPlan,
  'Multi-Room':  HousePlan,
};

export default function RoomFloorPlan({ roomType }) {
  const Plan = PLANS[roomType] || PLANS['Living Room'];
  return (
    <div
      className="overflow-hidden"
      style={{
        background: '#faf6f2',
        borderRadius: 12,
        border: '1px solid #ede5e0',
        padding: '16px 8px 8px',
      }}
    >
      <div
        className="text-[11px] uppercase tracking-widest font-medium text-center mb-3"
        style={{ color: '#b59d96' }}
      >
        Floor Plan · {roomType}
      </div>
      <Plan />
      <div
        className="flex items-center justify-center gap-6 mt-3 pt-3 flex-wrap text-[10px]"
        style={{ borderTop: '1px solid #ede5e0', color: '#b59d96' }}
      >
        <span className="flex items-center gap-1.5">
          <span style={{ display: 'inline-block', width: 16, height: 7, background: '#1a1210' }} />
          Wall
        </span>
        <span className="flex items-center gap-1.5">
          <span style={{ display: 'inline-block', width: 16, height: 7, background: '#bde0f5' }} />
          Window
        </span>
        <span className="flex items-center gap-1.5">
          <span style={{ display: 'inline-block', width: 16, height: 7, background: '#7a5e3a' }} />
          Door / Joinery
        </span>
        <span className="flex items-center gap-1.5">
          <span style={{ display: 'inline-block', width: 16, height: 7, background: 'none', border: '1.5px dashed #c9a87a' }} />
          Rug / Zone
        </span>
      </div>
    </div>
  );
}

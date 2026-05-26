/* eslint-disable react/no-unknown-property */
import React from 'react';
import { Box, Cylinder, RoundedBox, Torus } from '@react-three/drei';

const fabric = (color, roughness = 0.92) => <meshStandardMaterial color={color} roughness={roughness} />;
const wood = (color, roughness = 0.42) => <meshStandardMaterial color={color} roughness={roughness} />;
const metal = (color = '#b68a43', roughness = 0.28) => <meshStandardMaterial color={color} metalness={1} roughness={roughness} />;
const glass = (color = '#e8f4f8', opacity = 0.35) => <meshPhysicalMaterial color={color} transparent opacity={opacity} roughness={0.08} metalness={0.1} />;
const marble = (color = '#ebe8e3') => <meshStandardMaterial color={color} roughness={0.22} metalness={0.05} />;

function Legs({ width, depth, height, color = '#4a4039', count = 4 }) {
  const inset = Math.min(width, depth) * 0.18;
  const positions = count === 4
    ? [[-width / 2 + inset, height / 2, -depth / 2 + inset], [width / 2 - inset, height / 2, -depth / 2 + inset], [-width / 2 + inset, height / 2, depth / 2 - inset], [width / 2 - inset, height / 2, depth / 2 - inset]]
    : [[0, height / 2, 0]];
  return positions.map((position, index) => (
    <Cylinder key={index} args={[0.025, 0.03, height, 12]} position={position}>{wood(color, 0.35)}</Cylinder>
  ));
}

function SofaModel({ width, depth, height }) {
  return (
    <>
      <RoundedBox args={[width, height * 0.14, depth * 0.92]} radius={0.04} position={[0, height * 0.07, 0]}>{fabric('#d8cdbf')}</RoundedBox>
      <RoundedBox args={[width * 0.96, height * 0.42, depth * 0.78]} radius={0.08} position={[0, height * 0.3, depth * 0.04]}>{fabric('#e7decf')}</RoundedBox>
      <RoundedBox args={[width * 0.9, height * 0.28, depth * 0.34]} radius={0.07} position={[0, height * 0.62, depth * 0.24]}>{fabric('#f0e8da')}</RoundedBox>
      <RoundedBox args={[width * 0.08, height * 0.34, depth * 0.72]} radius={0.05} position={[-width * 0.44, height * 0.48, depth * 0.02]}>{fabric('#ded4c4')}</RoundedBox>
      <RoundedBox args={[width * 0.08, height * 0.34, depth * 0.72]} radius={0.05} position={[width * 0.44, height * 0.48, depth * 0.02]}>{fabric('#ded4c4')}</RoundedBox>
      {[[-0.34, 0.12], [0, 0.12], [0.34, 0.12]].map(([x, y], index) => (
        <RoundedBox key={index} args={[width * 0.22, height * 0.08, depth * 0.48]} radius={0.03} position={[width * x, height * y, depth * 0.08]}>{fabric('#f5efe6', 0.96)}</RoundedBox>
      ))}
      <Legs width={width} depth={depth} height={height * 0.14} />
    </>
  );
}

function ArmchairModel({ width, depth, height }) {
  return (
    <>
      <RoundedBox args={[width * 0.78, height * 0.16, depth * 0.78]} radius={0.05} position={[0, height * 0.08, 0]}>{wood('#5c4638')}</RoundedBox>
      <RoundedBox args={[width * 0.72, height * 0.34, depth * 0.62]} radius={0.08} position={[0, height * 0.34, depth * 0.04]}>{fabric('#d9cfc0')}</RoundedBox>
      <RoundedBox args={[width * 0.68, height * 0.28, depth * 0.12]} radius={0.06} position={[0, height * 0.58, depth * 0.28]}>{fabric('#ece4d7')}</RoundedBox>
      <RoundedBox args={[width * 0.12, height * 0.28, depth * 0.58]} radius={0.05} position={[-width * 0.34, height * 0.42, 0]}>{fabric('#d2c5b4')}</RoundedBox>
      <RoundedBox args={[width * 0.12, height * 0.28, depth * 0.58]} radius={0.05} position={[width * 0.34, height * 0.42, 0]}>{fabric('#d2c5b4')}</RoundedBox>
      <Cylinder args={[0.02, 0.02, height * 0.12, 10]} position={[-width * 0.28, height * 0.02, depth * 0.28]} rotation={[0.4, 0, 0]}>{metal('#c49a52')}</Cylinder>
      <Cylinder args={[0.02, 0.02, height * 0.12, 10]} position={[width * 0.28, height * 0.02, depth * 0.28]} rotation={[0.4, 0, 0]}>{metal('#c49a52')}</Cylinder>
    </>
  );
}

function ChairModel({ width, depth, height }) {
  return (
    <>
      <Box args={[width * 0.82, 0.025, depth * 0.82]} position={[0, height * 0.42, 0]}>{fabric('#d8ccb8')}</Box>
      {[0, 1, 2, 3].map((index) => {
        const x = index % 2 === 0 ? -width * 0.32 : width * 0.32;
        const z = index < 2 ? -depth * 0.32 : depth * 0.32;
        return <Cylinder key={index} args={[0.018, 0.022, height * 0.42, 10]} position={[x, height * 0.21, z]}>{wood('#c4a574')}</Cylinder>;
      })}
      <RoundedBox args={[width * 0.78, height * 0.34, 0.04]} radius={0.02} position={[0, height * 0.72, -depth * 0.36]}>{fabric('#e8dfd0')}</RoundedBox>
      <Box args={[0.04, height * 0.34, depth * 0.72]} position={[-width * 0.36, height * 0.72, 0]}>{wood('#c4a574')}</Box>
      <Box args={[0.04, height * 0.34, depth * 0.72]} position={[width * 0.36, height * 0.72, 0]}>{wood('#c4a574')}</Box>
    </>
  );
}

function StoolModel({ width, depth, height }) {
  return (
    <>
      <Cylinder args={[Math.min(width, depth) * 0.38, Math.min(width, depth) * 0.38, 0.05, 24]} position={[0, height * 0.88, 0]}>{fabric('#8b5a42', 0.88)}</Cylinder>
      <Cylinder args={[0.025, 0.035, height * 0.82, 16]} position={[0, height * 0.44, 0]}>{metal('#2a2a2a', 0.35)}</Cylinder>
      <Torus args={[Math.min(width, depth) * 0.22, 0.015, 8, 24]} rotation={[Math.PI / 2, 0, 0]} position={[0, height * 0.18, 0]}>{metal('#2a2a2a', 0.35)}</Torus>
    </>
  );
}

function SectionalModel({ width, depth, height }) {
  return (
    <>
      <RoundedBox args={[width * 0.62, height * 0.14, depth * 0.72]} radius={0.06} position={[-width * 0.16, height * 0.07, 0]}>{fabric('#d8cdbf')}</RoundedBox>
      <RoundedBox args={[width * 0.34, height * 0.14, depth * 0.72]} radius={0.06} position={[width * 0.3, height * 0.07, depth * 0.12]} rotation={[0, -Math.PI / 2, 0]}>{fabric('#d8cdbf')}</RoundedBox>
      <RoundedBox args={[width * 0.58, height * 0.38, depth * 0.62]} radius={0.08} position={[-width * 0.16, height * 0.32, 0]}>{fabric('#e7decf')}</RoundedBox>
      <RoundedBox args={[width * 0.3, height * 0.38, depth * 0.58]} radius={0.08} position={[width * 0.28, height * 0.32, depth * 0.14]} rotation={[0, -Math.PI / 2, 0]}>{fabric('#e7decf')}</RoundedBox>
      <RoundedBox args={[width * 0.52, height * 0.24, depth * 0.28]} radius={0.07} position={[-width * 0.16, height * 0.58, depth * 0.18]}>{fabric('#f0e8da')}</RoundedBox>
      <Legs width={width * 0.7} depth={depth * 0.7} height={height * 0.14} />
    </>
  );
}

function DiningTableModel({ width, depth, height }) {
  return (
    <>
      <RoundedBox args={[width, height * 0.08, depth]} radius={0.03} position={[0, height * 0.92, 0]}>{wood('#9a6b43')}</RoundedBox>
      <Box args={[width * 0.82, 0.02, depth * 0.82]} position={[0, height * 0.86, 0]}>{wood('#b07d4f', 0.35)}</Box>
      <Legs width={width} depth={depth} height={height * 0.84} color="#6f4a2f" />
    </>
  );
}

function CoffeeTableModel({ width, depth, height, round = false }) {
  if (round) {
    return (
      <>
        <Cylinder args={[Math.min(width, depth) * 0.46, Math.min(width, depth) * 0.48, height * 0.06, 32]} position={[0, height * 0.9, 0]}>{marble()}</Cylinder>
        <Cylinder args={[Math.min(width, depth) * 0.14, Math.min(width, depth) * 0.18, height * 0.82, 24]} position={[0, height * 0.44, 0]}>{marble('#e4e0da')}</Cylinder>
        <Cylinder args={[Math.min(width, depth) * 0.22, Math.min(width, depth) * 0.24, 0.04, 24]} position={[0, height * 0.06, 0]}>{marble('#ddd8d2')}</Cylinder>
      </>
    );
  }
  return (
    <>
      <RoundedBox args={[width, height * 0.06, depth]} radius={0.02} position={[0, height * 0.92, 0]}>{glass('#f5f5f5', 0.55)}</RoundedBox>
      <Box args={[0.04, height * 0.82, 0.04]} position={[-width * 0.38, height * 0.44, -depth * 0.38]}>{metal('#c49a52')}</Box>
      <Box args={[0.04, height * 0.82, 0.04]} position={[width * 0.38, height * 0.44, -depth * 0.38]}>{metal('#c49a52')}</Box>
      <Box args={[0.04, height * 0.82, 0.04]} position={[-width * 0.38, height * 0.44, depth * 0.38]}>{metal('#c49a52')}</Box>
      <Box args={[0.04, height * 0.82, 0.04]} position={[width * 0.38, height * 0.44, depth * 0.38]}>{metal('#c49a52')}</Box>
    </>
  );
}

function DeskModel({ width, depth, height }) {
  return (
    <>
      <RoundedBox args={[width, height * 0.07, depth]} radius={0.025} position={[0, height * 0.9, 0]}>{wood('#7a5438')}</RoundedBox>
      <Box args={[width * 0.18, height * 0.12, depth * 0.72]} position={[-width * 0.34, height * 0.78, 0]}>{wood('#68462f')}</Box>
      <Legs width={width} depth={depth} height={height * 0.82} color="#543722" />
    </>
  );
}

function ConsoleModel({ width, depth, height }) {
  return (
    <>
      <RoundedBox args={[width, height * 0.08, depth]} radius={0.02} position={[0, height * 0.88, 0]}>{wood('#2f241d')}</RoundedBox>
      <Box args={[width * 0.92, height * 0.52, 0.025]} position={[0, height * 0.52, -depth * 0.42]}>{wood('#3a2d24')}</Box>
      <Box args={[0.035, height * 0.78, depth * 0.82]} position={[-width * 0.46, height * 0.4, 0]}>{wood('#2f241d')}</Box>
      <Box args={[0.035, height * 0.78, depth * 0.82]} position={[width * 0.46, height * 0.4, 0]}>{wood('#2f241d')}</Box>
    </>
  );
}

function BookshelfModel({ width, depth, height }) {
  const shelves = 5;
  return (
    <>
      <Box args={[0.035, height, depth]} position={[-width / 2, height / 2, 0]}>{metal('#3a3a3a', 0.45)}</Box>
      <Box args={[0.035, height, depth]} position={[width / 2, height / 2, 0]}>{metal('#3a3a3a', 0.45)}</Box>
      {Array.from({ length: shelves }, (_, index) => (
        <Box key={index} args={[width, 0.025, depth * 0.92]} position={[0, height * (0.16 + index * 0.17), 0]}>{wood('#dcc7a8')}</Box>
      ))}
      {[[-0.28, 0.22], [0.08, 0.42], [0.24, 0.62]].map(([x, y], index) => (
        <Box key={`book-${index}`} args={[width * 0.08, height * 0.12, depth * 0.55]} position={[width * x, height * y, 0]} rotation={[0, index * 0.2, 0]}>{fabric(['#8b7355', '#5f6d7a', '#9a6748'][index % 3], 0.85)}</Box>
      ))}
    </>
  );
}

function SideboardModel({ width, depth, height }) {
  return (
    <>
      <RoundedBox args={[width, height, depth]} radius={0.03} position={[0, height / 2, 0]}>{wood('#c9a574')}</RoundedBox>
      <Box args={[width * 0.44, height * 0.72, 0.02]} position={[-width * 0.22, height * 0.5, 0]}>{wood('#b8925f')}</Box>
      <Box args={[width * 0.44, height * 0.72, 0.02]} position={[width * 0.22, height * 0.5, 0]}>{wood('#b8925f')}</Box>
      <Cylinder args={[0.012, 0.012, 0.04, 8]} position={[-width * 0.08, height * 0.5, depth * 0.46]} rotation={[Math.PI / 2, 0, 0]}>{metal('#d4af63')}</Cylinder>
      <Cylinder args={[0.012, 0.012, 0.04, 8]} position={[width * 0.08, height * 0.5, depth * 0.46]} rotation={[Math.PI / 2, 0, 0]}>{metal('#d4af63')}</Cylinder>
    </>
  );
}

function WardrobeModel({ width, depth, height }) {
  return (
    <>
      <RoundedBox args={[width, height, depth]} radius={0.025} position={[0, height / 2, 0]}>{fabric('#f2ece4', 0.9)}</RoundedBox>
      <Box args={[0.02, height * 0.88, depth * 0.92]} position={[0, height * 0.5, 0]}>{wood('#d8d0c6', 0.5)}</Box>
      <Cylinder args={[0.01, 0.01, 0.05, 8]} position={[-width * 0.06, height * 0.5, depth * 0.47]} rotation={[Math.PI / 2, 0, 0]}>{metal('#9a9a9a')}</Cylinder>
      <Cylinder args={[0.01, 0.01, 0.05, 8]} position={[width * 0.06, height * 0.5, depth * 0.47]} rotation={[Math.PI / 2, 0, 0]}>{metal('#9a9a9a')}</Cylinder>
    </>
  );
}

function BenchModel({ width, depth, height }) {
  return (
    <>
      <RoundedBox args={[width, height * 0.12, depth]} radius={0.04} position={[0, height * 0.72, 0]}>{wood('#b8895d')}</RoundedBox>
      <Box args={[width * 0.42, height * 0.28, depth * 0.72]} position={[-width * 0.2, height * 0.38, 0]}>{fabric('#d8c7aa', 0.9)}</Box>
      <Box args={[width * 0.42, height * 0.28, depth * 0.72]} position={[width * 0.2, height * 0.38, 0]}>{fabric('#d8c7aa', 0.9)}</Box>
      <Legs width={width} depth={depth} height={height * 0.62} />
    </>
  );
}

function FloorLampModel({ width, depth, height }) {
  return (
    <>
      <Cylinder args={[0.16, 0.2, 0.06, 24]} position={[0, 0.03, 0]}>{marble('#e8e4de')}</Cylinder>
      <Box args={[0.025, height * 0.78, 0.025]} position={[0, height * 0.42, 0]} rotation={[0, 0, 0.18]}>{metal()}</Box>
      <mesh position={[0, height * 0.84, height * 0.08]} rotation={[0, 0, -0.55]}>
        <cylinderGeometry args={[0.012, 0.012, height * 0.34, 12]} />{metal()}
      </mesh>
      <mesh position={[0, height * 0.92, height * 0.22]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[Math.max(width, 0.28) * 0.42, 0.28, 28, 1, true]} />{fabric('#f2e8d8', 0.95)}
      </mesh>
    </>
  );
}

function TableLampModel({ width, depth, height }) {
  return (
    <>
      <Cylinder args={[width * 0.28, width * 0.34, height * 0.28, 24]} position={[0, height * 0.14, 0]}>{fabric('#d8d0c4', 0.4)}</Cylinder>
      <Cylinder args={[0.015, 0.015, height * 0.42, 12]} position={[0, height * 0.48, 0]}>{metal('#c49a52')}</Cylinder>
      <mesh position={[0, height * 0.82, 0]}><coneGeometry args={[width * 0.34, height * 0.22, 24, 1, true]} />{fabric('#f5efe6', 0.94)}</mesh>
    </>
  );
}

function PendantModel({ width, depth, height }) {
  return (
    <>
      <Cylinder args={[0.04, 0.04, 0.03, 16]} position={[0, height * 0.98, 0]}>{metal('#2a2a2a', 0.35)}</Cylinder>
      <Cylinder args={[0.008, 0.008, height * 0.42, 10]} position={[0, height * 0.76, 0]}>{metal('#c49a52')}</Cylinder>
      <mesh position={[0, height * 0.52, 0]}><sphereGeometry args={[Math.max(width, depth) * 0.34, 24, 24]} />{glass('#fff7ef', 0.72)}</mesh>
    </>
  );
}

function PlantModel({ width, depth, height }) {
  return (
    <>
      <Cylinder args={[width * 0.22, width * 0.16, height * 0.18, 20]} position={[0, height * 0.09, 0]}>{fabric('#a45d42', 0.86)}</Cylinder>
      <Cylinder args={[0.018, 0.024, height * 0.52, 10]} position={[0, height * 0.38, 0]}>{wood('#5f4931')}</Cylinder>
      {[[-0.18, 0.72, 0], [0.16, 0.62, 0.04], [-0.12, 0.48, -0.02], [0.1, 0.86, 0], [-0.04, 0.94, 0.02]].map(([x, y, z], index) => (
        <mesh key={index} position={[width * x, height * y, depth * z]} rotation={[0, index * 0.8, index * 0.15]}>
          <sphereGeometry args={[0.18, 12, 10]} />{fabric('#385d39', 0.88)}
        </mesh>
      ))}
    </>
  );
}

function RugModel({ width, depth, height }) {
  return (
    <>
      <RoundedBox args={[width, Math.max(height, 0.015), depth]} radius={0.03} position={[0, Math.max(height, 0.015) / 2, 0]}>{fabric('#b59c78', 1)}</RoundedBox>
      <RoundedBox args={[width * 0.88, Math.max(height, 0.01), depth * 0.88]} radius={0.025} position={[0, Math.max(height, 0.015) + 0.004, 0]}>{fabric('#c9b08a', 1)}</RoundedBox>
    </>
  );
}

function ArtModel({ width, depth, height }) {
  return (
    <>
      <Box args={[width + 0.06, height + 0.06, depth]} position={[0, height / 2, 0]}>{wood('#d8cbb8')}</Box>
      <Box args={[width, height, depth * 0.4]} position={[0, height / 2, 0]}>{fabric('#d9dee8', 0.75)}</Box>
      <Box args={[width * 0.72, height * 0.58, 0.01]} position={[0, height * 0.52, depth * 0.12]}>{fabric('#b8c4d8', 0.65)}</Box>
    </>
  );
}

function VaseModel({ width, depth, height }) {
  return (
    <>
      <Cylinder args={[width * 0.22, width * 0.28, height * 0.12, 20]} position={[0, height * 0.06, 0]}>{fabric('#c8d2dc', 0.35)}</Cylinder>
      <Cylinder args={[width * 0.18, width * 0.22, height * 0.28, 20]} position={[0, height * 0.24, 0]}>{fabric('#d2dbe3', 0.32)}</Cylinder>
      <mesh position={[0, height * 0.42, 0]} scale={[1, 1.2, 1]}><sphereGeometry args={[width * 0.2, 16, 12]} />{fabric('#bcc7d0', 0.34)}</mesh>
    </>
  );
}

function MirrorModel({ width, depth, height }) {
  const radius = Math.min(width, height) / 2;
  return (
    <>
      <mesh position={[0, height / 2, 0]}><torusGeometry args={[radius, 0.025, 8, 32]} />{metal('#2a2a2a', 0.35)}</mesh>
      <mesh position={[0, height / 2, 0]}><circleGeometry args={[radius * 0.92, 32]} />{glass('#dfe8ef', 0.85)}</mesh>
    </>
  );
}

function BedModel({ width, depth, height }) {
  return (
    <>
      <RoundedBox args={[width, height * 0.22, depth * 0.92]} radius={0.04} position={[0, height * 0.11, 0]}>{wood('#8b6f4e')}</RoundedBox>
      <RoundedBox args={[width * 0.94, height * 0.18, depth * 0.88]} radius={0.06} position={[0, height * 0.28, depth * 0.02]}>{fabric('#e8dfd0')}</RoundedBox>
      <RoundedBox args={[width * 0.88, height * 0.12, depth * 0.72]} radius={0.05} position={[0, height * 0.42, depth * 0.04]}>{fabric('#f2ebe2')}</RoundedBox>
      <RoundedBox args={[width * 0.92, height * 0.34, depth * 0.08]} radius={0.04} position={[0, height * 0.58, -depth * 0.4]}>{fabric('#d8cdbf')}</RoundedBox>
      {[[-0.28, 0.62], [0.28, 0.62]].map(([x, y], index) => (
        <RoundedBox key={index} args={[width * 0.18, height * 0.1, depth * 0.16]} radius={0.05} position={[width * x, height * y, -depth * 0.28]}>{fabric('#f5efe6')}</RoundedBox>
      ))}
      <Legs width={width} depth={depth} height={height * 0.12} color="#5c4638" />
    </>
  );
}

function KitchenIslandModel({ width, depth, height }) {
  return (
    <>
      <RoundedBox args={[width, height * 0.88, depth]} radius={0.03} position={[0, height * 0.46, 0]}>{fabric('#f0ece6', 0.92)}</RoundedBox>
      <RoundedBox args={[width * 0.96, height * 0.06, depth * 0.96]} radius={0.02} position={[0, height * 0.92, 0]}>{marble('#e7e2da')}</RoundedBox>
      <Box args={[width * 0.42, height * 0.62, 0.02]} position={[-width * 0.22, height * 0.48, depth * 0.48]}>{wood('#d8d0c4', 0.55)}</Box>
      <Box args={[width * 0.42, height * 0.62, 0.02]} position={[width * 0.22, height * 0.48, depth * 0.48]}>{wood('#d8d0c4', 0.55)}</Box>
    </>
  );
}

function VanityModel({ width, depth, height }) {
  return (
    <>
      <RoundedBox args={[width, height * 0.72, depth]} radius={0.025} position={[0, height * 0.38, 0]}>{wood('#c9a574')}</RoundedBox>
      <RoundedBox args={[width * 0.88, height * 0.08, depth * 0.82]} radius={0.02} position={[0, height * 0.78, 0]}>{marble('#ebe8e3')}</RoundedBox>
      <mesh position={[0, height * 0.82, depth * 0.08]}><sphereGeometry args={[width * 0.12, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />{fabric('#e8eef2', 0.35)}</mesh>
      <Cylinder args={[0.012, 0.012, 0.08, 8]} position={[width * 0.28, height * 0.84, depth * 0.42]} rotation={[Math.PI / 2, 0, 0]}>{metal('#c49a52')}</Cylinder>
    </>
  );
}

function ToiletModel({ width, depth, height }) {
  return (
    <>
      <RoundedBox args={[width * 0.72, height * 0.42, depth * 0.62]} radius={0.08} position={[0, height * 0.28, depth * 0.08]}>{fabric('#f2f0ec', 0.35)}</RoundedBox>
      <RoundedBox args={[width * 0.52, height * 0.24, depth * 0.18]} radius={0.05} position={[0, height * 0.62, -depth * 0.28]}>{fabric('#f2f0ec', 0.35)}</RoundedBox>
      <Box args={[width * 0.18, height * 0.52, 0.04]} position={[0, height * 0.48, -depth * 0.42]}>{fabric('#ece8e2', 0.4)}</Box>
    </>
  );
}

function BathtubModel({ width, depth, height }) {
  return (
    <>
      <mesh position={[0, height * 0.42, 0]}><capsuleGeometry args={[depth * 0.34, width * 0.72, 8, 16]} rotation={[0, 0, Math.PI / 2]} />{fabric('#f0ece8', 0.32)}</mesh>
      <RoundedBox args={[width * 0.78, height * 0.08, depth * 0.72]} radius={0.12} position={[0, height * 0.12, 0]}>{fabric('#ece8e4', 0.38)}</RoundedBox>
      <Cylinder args={[0.015, 0.015, 0.12, 8]} position={[width * 0.28, height * 0.78, -depth * 0.22]} rotation={[0.4, 0, 0]}>{metal('#c49a52')}</Cylinder>
    </>
  );
}

function TowelRackModel({ width, depth, height }) {
  return (
    <>
      <Cylinder args={[0.012, 0.012, height * 0.8, 8]} position={[-width * 0.42, height * 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>{metal('#c49a52')}</Cylinder>
      <Cylinder args={[0.012, 0.012, height * 0.8, 8]} position={[width * 0.42, height * 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>{metal('#c49a52')}</Cylinder>
      <Cylinder args={[0.014, 0.014, width * 0.76, 8]} position={[0, height * 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>{metal('#c49a52')}</Cylinder>
    </>
  );
}

function CurtainsModel({ width, depth, height }) {
  return (
    <>
      <Box args={[width, 0.03, depth * 0.8]} position={[0, height * 0.98, 0]}>{metal('#2a2a2a', 0.35)}</Box>
      {[-0.22, 0.22].map((x, index) => (
        <RoundedBox key={index} args={[width * 0.24, height * 0.92, depth * 0.04]} radius={0.01} position={[width * x, height * 0.48, 0]}>{fabric('#efe8dc', 0.94)}</RoundedBox>
      ))}
    </>
  );
}

function GenericDecorModel({ width, depth, height, color = '#aa8762' }) {
  return (
    <>
      <RoundedBox args={[width, height, depth]} radius={0.04} position={[0, height / 2, 0]}>{fabric(color, 0.75)}</RoundedBox>
      <RoundedBox args={[width * 0.82, height * 0.82, depth * 0.82]} radius={0.03} position={[0, height * 0.52, depth * 0.06]}>{fabric('#d8c9b0', 0.8)}</RoundedBox>
    </>
  );
}

export function DetailedFurnitureModel({ product, width, depth, height }) {
  const type = product?.modelType || 'decor';
  switch (type) {
    case 'sofa': return <SofaModel width={width} depth={depth} height={height} />;
    case 'sectional': return <SectionalModel width={width} depth={depth} height={height} />;
    case 'armchair': return <ArmchairModel width={width} depth={depth} height={height} />;
    case 'chair': return <ChairModel width={width} depth={depth} height={height} />;
    case 'stool': return <StoolModel width={width} depth={depth} height={height} />;
    case 'dining-table': return <DiningTableModel width={width} depth={depth} height={height} />;
    case 'coffee-table': return <CoffeeTableModel width={width} depth={depth} height={height} round={product.id.includes('carrara') || product.id.includes('pebble')} />;
    case 'side-table': return <CoffeeTableModel width={width} depth={depth} height={height} />;
    case 'desk': return <DeskModel width={width} depth={depth} height={height} />;
    case 'console': return <ConsoleModel width={width} depth={depth} height={height} />;
    case 'bookshelf': return <BookshelfModel width={width} depth={depth} height={height} />;
    case 'sideboard': return <SideboardModel width={width} depth={depth} height={height} />;
    case 'wardrobe': return <WardrobeModel width={width} depth={depth} height={height} />;
    case 'bench': return <BenchModel width={width} depth={depth} height={height} />;
    case 'floor-lamp': return <FloorLampModel width={width} depth={depth} height={height} />;
    case 'table-lamp': return <TableLampModel width={width} depth={depth} height={height} />;
    case 'pendant':
    case 'spot':
    case 'sconce': return <PendantModel width={width} depth={depth} height={height} />;
    case 'led-strip': return <Box args={[width, 0.02, depth * 0.2]} position={[0, height * 0.92, 0]}>{fabric('#fff2d9', 0.5)}</Box>;
    case 'plant': return <PlantModel width={width} depth={depth} height={height} />;
    case 'rug': return <RugModel width={width} depth={depth} height={height} />;
    case 'art': return <ArtModel width={width} depth={depth} height={height} />;
    case 'vase': return <VaseModel width={width} depth={depth} height={height} />;
    case 'mirror': return <MirrorModel width={width} depth={depth} height={height} />;
    case 'bed': return <BedModel width={width} depth={depth} height={height} />;
    case 'kitchen-island': return <KitchenIslandModel width={width} depth={depth} height={height} />;
    case 'vanity': return <VanityModel width={width} depth={depth} height={height} />;
    case 'toilet': return <ToiletModel width={width} depth={depth} height={height} />;
    case 'bathtub': return <BathtubModel width={width} depth={depth} height={height} />;
    case 'towel-rack': return <TowelRackModel width={width} depth={depth} height={height} />;
    case 'curtains': return <CurtainsModel width={width} depth={depth} height={height} />;
    case 'pillow': return <RoundedBox args={[width, height, depth]} radius={0.18} position={[0, height / 2, 0]}>{fabric('#e7decf')}</RoundedBox>;
    case 'books': return <GenericDecorModel width={width} depth={depth} height={height} color="#8b7355" />;
    case 'basket': return <GenericDecorModel width={width} depth={depth} height={height} color="#c4a574" />;
    case 'sculpture': return <GenericDecorModel width={width} depth={depth} height={height} color="#8e8e8e" />;
    case 'staircase':
      return (
        <>
          {Array.from({ length: 6 }, (_, index) => (
            <Box key={index} args={[width * 0.18, height * 0.08, depth * 0.72]} position={[-width * 0.28 + index * width * 0.11, height * (0.08 + index * 0.14), 0]}>{wood('#c4a574')}</Box>
          ))}
          <Box args={[0.04, height, 0.04]} position={[-width * 0.42, height * 0.5, -depth * 0.3]}>{metal('#2a2a2a', 0.35)}</Box>
        </>
      );
    default: return <GenericDecorModel width={width} depth={depth} height={height} />;
  }
}

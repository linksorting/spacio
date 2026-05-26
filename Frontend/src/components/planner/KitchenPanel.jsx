import React, { useState } from 'react';
import { Search, Heart, ChevronLeft, Info } from 'lucide-react';
import { useDrag } from './DragContext';

// ── Data ─────────────────────────────────────────────────────────────────────

const KITCHEN_TABS = [
  { id: 'cabinet_styles',    label: 'Cabinet Styles' },
  { id: 'accessories',       label: 'Accessories' },
  { id: 'kd_furniture',      label: 'Kitchen & Dining Furniture' },
  { id: 'appliances',        label: 'Appliances' },
];

// Cabinet Styles — 8 styles shown as a 2-col image grid
const CABINET_STYLES = [
  { id: 'cs1', name: 'Recessed',        count: 637, img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&q=80' },
  { id: 'cs2', name: 'Beadboard',       count: 6,   img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400&h=300&fit=crop&q=80' },
  { id: 'cs3', name: 'Flat Panel/Slab', count: 558, img: 'https://images.unsplash.com/photo-1556909096-54b5f11d0d07?w=400&h=300&fit=crop&q=80' },
  { id: 'cs4', name: 'Raised',          count: 756, img: 'https://images.unsplash.com/photo-1556909075-b5d50dc0c74e?w=400&h=300&fit=crop&q=80' },
  { id: 'cs5', name: 'Shaker',          count: 722, img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&q=80&sat=-30' },
  { id: 'cs6', name: 'Rustic',          count: 4,   img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=300&fit=crop&q=80' },
  { id: 'cs7', name: 'Inset',           count: 112, img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop&q=80' },
  { id: 'cs8', name: 'Louvered',        count: 8,   img: 'https://images.unsplash.com/photo-1556909096-54b5f11d0d07?w=400&h=300&fit=crop&q=80' },
];

// Products within a chosen cabinet style
const CABINET_STYLE_PRODUCTS = {
  cs1: [
    { id: 'cs1p1', name: 'Recessed Panel Base Cabinet 36"',         img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'cs1p2', name: 'Recessed Wall Cabinet 30"',               img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop' },
    { id: 'cs1p3', name: 'Recessed Blind Corner Unit Wd39',         img: 'https://images.unsplash.com/photo-1556909096-54b5f11d0d07?w=300&h=300&fit=crop' },
    { id: 'cs1p4', name: 'Recessed 4-Door Pantry Cabinet',          img: 'https://images.unsplash.com/photo-1556909075-b5d50dc0c74e?w=300&h=300&fit=crop' },
    { id: 'cs1p5', name: 'Recessed Panel Island Unit',              img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'cs1p6', name: 'Recessed Open Shelf Cabinet',             img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=300&h=300&fit=crop' },
  ],
  cs2: [
    { id: 'cs2p1', name: 'Beadboard Base Cabinet',                  img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop' },
    { id: 'cs2p2', name: 'Beadboard Tall Pantry',                   img: 'https://images.unsplash.com/photo-1556909096-54b5f11d0d07?w=300&h=300&fit=crop' },
    { id: 'cs2p3', name: 'Beadboard Wall Unit 24"',                 img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'cs2p4', name: 'Beadboard Corner Cabinet',                img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&h=300&fit=crop' },
    { id: 'cs2p5', name: 'Beadboard Open Shelf Unit',               img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=300&h=300&fit=crop' },
    { id: 'cs2p6', name: 'Beadboard Island Base',                   img: 'https://images.unsplash.com/photo-1556909075-b5d50dc0c74e?w=300&h=300&fit=crop' },
  ],
  cs3: [
    { id: 'cs3p1', name: 'Flat Panel Slab Base 36"',                img: 'https://images.unsplash.com/photo-1556909096-54b5f11d0d07?w=300&h=300&fit=crop' },
    { id: 'cs3p2', name: 'Slab Wall Cabinet 42"',                   img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'cs3p3', name: 'Flat Panel Drawer Base',                  img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop' },
    { id: 'cs3p4', name: 'Slab Corner Lazy Susan',                  img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&h=300&fit=crop' },
    { id: 'cs3p5', name: 'Flat Panel Tall Unit 90"',                img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=300&h=300&fit=crop' },
    { id: 'cs3p6', name: 'Slab Floating Shelf Set',                 img: 'https://images.unsplash.com/photo-1556909075-b5d50dc0c74e?w=300&h=300&fit=crop' },
  ],
  cs4: [
    { id: 'cs4p1', name: 'Raised Panel Base Cabinet',               img: 'https://images.unsplash.com/photo-1556909075-b5d50dc0c74e?w=300&h=300&fit=crop' },
    { id: 'cs4p2', name: 'Raised Wall Cabinet Wd36',                img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'cs4p3', name: 'Raised Angled Valance',                   img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop' },
    { id: 'cs4p4', name: 'Raised Panel Blind Corner Wd39',          img: 'https://images.unsplash.com/photo-1556909096-54b5f11d0d07?w=300&h=300&fit=crop' },
    { id: 'cs4p5', name: 'Raised Two Drawer Single Door',           img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&h=300&fit=crop' },
    { id: 'cs4p6', name: 'Raised Panel Island Cabinet',             img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=300&h=300&fit=crop' },
  ],
  cs5: [
    { id: 'cs5p1', name: 'Shaker Base Cabinet 30"',                 img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'cs5p2', name: 'Shaker Wall Cabinet 42"',                 img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop' },
    { id: 'cs5p3', name: 'Shaker Four Drawer Base',                 img: 'https://images.unsplash.com/photo-1556909096-54b5f11d0d07?w=300&h=300&fit=crop' },
    { id: 'cs5p4', name: 'Shaker Pantry Tall Unit',                 img: 'https://images.unsplash.com/photo-1556909075-b5d50dc0c74e?w=300&h=300&fit=crop' },
    { id: 'cs5p5', name: 'Shaker Corner Lazy Susan',                img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&h=300&fit=crop' },
    { id: 'cs5p6', name: 'Shaker Open Shelf Upper',                 img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=300&h=300&fit=crop' },
  ],
  cs6: [
    { id: 'cs6p1', name: 'Rustic Barnwood Base Cabinet',            img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=300&h=300&fit=crop' },
    { id: 'cs6p2', name: 'Rustic Plank Wall Unit',                  img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&h=300&fit=crop' },
    { id: 'cs6p3', name: 'Rustic Live-Edge Open Shelf',             img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'cs6p4', name: 'Rustic Island With Storage',              img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop' },
  ],
  cs7: [
    { id: 'cs7p1', name: 'Inset Base Cabinet 36"',                  img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&h=300&fit=crop' },
    { id: 'cs7p2', name: 'Inset Wall Cabinet 30"',                  img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'cs7p3', name: 'Inset Drawer Stack',                      img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop' },
    { id: 'cs7p4', name: 'Inset Pantry Unit 96"',                   img: 'https://images.unsplash.com/photo-1556909096-54b5f11d0d07?w=300&h=300&fit=crop' },
  ],
  cs8: [
    { id: 'cs8p1', name: 'Louvered Base Cabinet',                   img: 'https://images.unsplash.com/photo-1556909096-54b5f11d0d07?w=300&h=300&fit=crop' },
    { id: 'cs8p2', name: 'Louvered Wall Cabinet',                   img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'cs8p3', name: 'Louvered Island Panel',                   img: 'https://images.unsplash.com/photo-1556909075-b5d50dc0c74e?w=300&h=300&fit=crop' },
    { id: 'cs8p4', name: 'Louvered Pantry Door',                    img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=300&h=300&fit=crop' },
  ],
};

// Accessories sub-tabs
const ACCESSORIES_TABS = [
  { id: 'kitchen_acc', label: 'Kitchen Acc.' },
  { id: 'dining_acc',  label: 'Dining Acc.' },
  { id: 'bar_acc',     label: 'Bar Access.' },
];

const ACCESSORIES_PRODUCTS = {
  kitchen_acc: [
    { id: 'ka1',  name: 'Black Ceramic Bowl',                       img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&h=300&fit=crop' },
    { id: 'ka2',  name: 'Geo Gold Laser Cut Charger Plate',         img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=300&fit=crop' },
    { id: 'ka3',  name: 'Ceiling Mount Wooden Accessories Hanger',  img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'ka4',  name: 'Wall Mount Utensil Bar Rack With 6 Hooks', img: 'https://images.unsplash.com/photo-1556910638-6cdac31d44dc?w=300&h=300&fit=crop' },
    { id: 'ka5',  name: 'Non-Stick Pot With Lid',                   img: 'https://images.unsplash.com/photo-1584990347449-39ad126b7b6c?w=300&h=300&fit=crop' },
    { id: 'ka6',  name: 'Round Oak Tray',                           img: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=300&h=300&fit=crop' },
    { id: 'ka7',  name: 'KitchenAid Copper Mixing Bowl Set',        img: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=300&h=300&fit=crop' },
    { id: 'ka8',  name: 'Marble Rolling Pin',                       img: 'https://images.unsplash.com/photo-1612198790700-b1bb8de59e78?w=300&h=300&fit=crop' },
    { id: 'ka9',  name: 'Epicurean Bamboo Cutting Board',           img: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=300&h=300&fit=crop' },
    { id: 'ka10', name: 'Lodge Cast Iron Skillet 12"',              img: 'https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=300&h=300&fit=crop' },
  ],
  dining_acc: [
    { id: 'da1', name: 'Geo Gold Laser Cut Charger Plate',          img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=300&fit=crop' },
    { id: 'da2', name: 'Schott Zwiesel Crystal Glass',              img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop' },
    { id: 'da3', name: 'Top Plate Rack With 40mm Thick Top Panel',  img: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=300&h=300&fit=crop' },
    { id: 'da4', name: 'Glass Apothecary Jar',                      img: 'https://images.unsplash.com/photo-1526290766257-c4ada550a20b?w=300&h=300&fit=crop' },
    { id: 'da5', name: 'Teak Wood Bowl',                            img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&h=300&fit=crop' },
    { id: 'da6', name: 'Stone Mortar Bowl',                         img: 'https://images.unsplash.com/photo-1584990347449-39ad126b7b6c?w=300&h=300&fit=crop' },
    { id: 'da7', name: 'Libeco Linen Napkin Set of 4',              img: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=300&h=300&fit=crop' },
    { id: 'da8', name: 'Riedel Crystal Candle Holder',              img: 'https://images.unsplash.com/photo-1608543168256-60b3ef0a5e1e?w=300&h=300&fit=crop' },
  ],
  bar_acc: [
    { id: 'ba1', name: 'Riedel Old World Pinot Noir Wine Glass',    img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=300&fit=crop' },
    { id: 'ba2', name: 'Crafthouse by Fortessa Cocktail Shaker',    img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&h=300&fit=crop' },
    { id: 'ba3', name: 'Waterford Lismore Whiskey Decanter',        img: 'https://images.unsplash.com/photo-1527766833261-b09c3163a791?w=300&h=300&fit=crop' },
    { id: 'ba4', name: 'Moscow Mule Copper Mug Set of 2',           img: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=300&h=300&fit=crop' },
    { id: 'ba5', name: 'Umbra Trigg Wine Bottle Rack',              img: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop' },
    { id: 'ba6', name: 'Acacia Wood Bar Serving Tray',              img: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=300&h=300&fit=crop' },
  ],
};

// Kitchen & Dining Furniture sub-tabs
const KD_FURNITURE_TABS = [
  { id: 'base_units',   label: 'Base Units' },
  { id: 'wall_units',   label: 'Wall Units' },
  { id: 'cabinet_sets', label: 'Cabinet Sets' },
  { id: 'sinks',        label: 'Sinks' },
  { id: 'backsplash',   label: 'Back-Splas...' },
  { id: 'islands',      label: 'Islands' },
  { id: 'tall_units',   label: 'Tall Units' },
  { id: 'fillers',      label: 'Fillers' },
  { id: 'worktops',     label: 'Work Tops' },
  { id: 'tables',       label: 'Tables & Ch...' },
];

const KD_FURNITURE_PRODUCTS = {
  base_units: [
    { id: 'bu1', name: 'Restoration Hardware Dark Oak Display Unit',img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&h=300&fit=crop' },
    { id: 'bu2', name: 'Two Drawer Single Door Wall Recessed',      img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'bu3', name: 'Four Drawer Base Recessed Shutter',         img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop' },
    { id: 'bu4', name: 'Recessed Panel Blind Base Corner Wd39',     img: 'https://images.unsplash.com/photo-1556909096-54b5f11d0d07?w=300&h=300&fit=crop' },
    { id: 'bu5', name: 'Three Drawer Base Cabinet 36"',             img: 'https://images.unsplash.com/photo-1556909075-b5d50dc0c74e?w=300&h=300&fit=crop' },
    { id: 'bu6', name: 'Sink Base Cabinet 33"',                     img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop' },
    { id: 'bu7', name: 'Corner Base Lazy Susan 36"',                img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=300&h=300&fit=crop' },
    { id: 'bu8', name: 'Spice Drawer Base 12"',                     img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
  ],
  wall_units: [
    { id: 'wu1', name: 'Wall Cabinet 30" Wide',                     img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop' },
    { id: 'wu2', name: 'Wall Cabinet With Glass Door',              img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&h=300&fit=crop' },
    { id: 'wu3', name: 'Corner Wall Cabinet 24"',                   img: 'https://images.unsplash.com/photo-1556909096-54b5f11d0d07?w=300&h=300&fit=crop' },
    { id: 'wu4', name: 'Open Wall Shelf 36"',                       img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'wu5', name: 'Microwave Wall Cabinet',                    img: 'https://images.unsplash.com/photo-1556909075-b5d50dc0c74e?w=300&h=300&fit=crop' },
    { id: 'wu6', name: 'Floating Wall Shelf Set',                   img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=300&h=300&fit=crop' },
  ],
  cabinet_sets: [
    { id: 'cas1', name: 'L-Shape Shaker Kitchen Set 8x10',          img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'cas2', name: 'U-Shape Kitchen Cabinet Set 10x10',        img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop' },
    { id: 'cas3', name: 'Galley Kitchen Flat Panel Set 8x12',       img: 'https://images.unsplash.com/photo-1556909096-54b5f11d0d07?w=300&h=300&fit=crop' },
    { id: 'cas4', name: 'Peninsula Cabinet Set With Island',        img: 'https://images.unsplash.com/photo-1556909075-b5d50dc0c74e?w=300&h=300&fit=crop' },
  ],
  sinks: [
    { id: 'si1', name: 'Kraus Undermount Stainless Steel Sink',     img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop' },
    { id: 'si2', name: 'KOHLER Whitehaven Farmhouse Apron Sink',    img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300&h=300&fit=crop' },
    { id: 'si3', name: 'Blanco Diamond Double Basin Sink',          img: 'https://images.unsplash.com/photo-1556910638-6cdac31d44dc?w=300&h=300&fit=crop' },
    { id: 'si4', name: 'Elkay Bar Prep Sink 15"',                   img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'si5', name: 'American Standard Drop-In Porcelain Sink',  img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300&h=300&fit=crop' },
    { id: 'si6', name: 'Franke Granite Composite Onyx Sink',        img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop' },
  ],
  backsplash: [
    { id: 'bp1', name: 'Dal-Tile Subway Tile Backsplash 3x6',       img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&h=300&fit=crop' },
    { id: 'bp2', name: 'Merola Arabesque Mosaic Backsplash',        img: 'https://images.unsplash.com/photo-1556909096-54b5f11d0d07?w=300&h=300&fit=crop' },
    { id: 'bp3', name: 'Calacatta Herringbone Marble Backsplash',   img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300&h=300&fit=crop' },
    { id: 'bp4', name: 'Elida Ceramica Glass Tile Backsplash',      img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=300&fit=crop' },
  ],
  islands: [
    { id: 'is1', name: 'Hampton Bay 48" White Kitchen Island',      img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'is2', name: 'John Boos Butcher Block Island 60"',        img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop' },
    { id: 'is3', name: 'Caesarstone Waterfall Marble Island',       img: 'https://images.unsplash.com/photo-1556909096-54b5f11d0d07?w=300&h=300&fit=crop' },
    { id: 'is4', name: 'IKEA RÅSKOG Rolling Kitchen Island',        img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=300&h=300&fit=crop' },
    { id: 'is5', name: 'Crosley Two-Tier Island With Seating',      img: 'https://images.unsplash.com/photo-1556909075-b5d50dc0c74e?w=300&h=300&fit=crop' },
    { id: 'is6', name: 'Rejuvenation Industrial Steel Island Cart', img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&h=300&fit=crop' },
  ],
  tall_units: [
    { id: 'tu1', name: 'Waypoint Living Spaces 84" Pantry Cabinet', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'tu2', name: 'Wolf Oven Tower Cabinet',                   img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop' },
    { id: 'tu3', name: 'Sub-Zero Fridge Surround Tall Cabinet',     img: 'https://images.unsplash.com/photo-1556909096-54b5f11d0d07?w=300&h=300&fit=crop' },
    { id: 'tu4', name: 'Hafele Utility Pull-Out Cabinet 90"',      img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=300&h=300&fit=crop' },
  ],
  fillers: [
    { id: 'fi1', name: 'Cabinet Base Filler Strip 3"',              img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'fi2', name: 'Wall Cabinet Filler 6"',                    img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop' },
    { id: 'fi3', name: 'Furniture Foot Kick Panel',                 img: 'https://images.unsplash.com/photo-1556909096-54b5f11d0d07?w=300&h=300&fit=crop' },
    { id: 'fi4', name: 'Corner Cabinet Filler 90°',                 img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&h=300&fit=crop' },
  ],
  worktops: [
    { id: 'wt1', name: 'Silestone Calacatta Gold Quartz Worktop',   img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'wt2', name: 'Calacatta Marble Slab Countertop',          img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300&h=300&fit=crop' },
    { id: 'wt3', name: 'John Boos Maple Butcher Block Worktop',     img: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=300&h=300&fit=crop' },
    { id: 'wt4', name: 'Stainless Steel Commercial Countertop',     img: 'https://images.unsplash.com/photo-1556910638-6cdac31d44dc?w=300&h=300&fit=crop' },
    { id: 'wt5', name: 'Formica Compact Laminate Worktop',          img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&h=300&fit=crop' },
    { id: 'wt6', name: 'Neolith Porcelain Slab Countertop',         img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=300&h=300&fit=crop' },
  ],
  tables: [
    { id: 'ta1', name: 'Saarinen Round Marble Dining Table',        img: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=300&h=300&fit=crop' },
    { id: 'ta2', name: 'IKEA EKEDALEN Extendable Dining Table',     img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=300&h=300&fit=crop' },
    { id: 'ta3', name: 'Pottery Barn Benchwright Dining Table 72"', img: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=300&h=300&fit=crop' },
    { id: 'ta4', name: 'West Elm Industrial Bistro Table',          img: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=300&h=300&fit=crop' },
    { id: 'ta5', name: 'Crate & Barrel Counter Height Table',       img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop' },
    { id: 'ta6', name: 'Wayfair Folding Breakfast Nook Table',      img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=300&h=300&fit=crop' },
  ],
};

// Appliances sub-tabs
const APPLIANCES_TABS = [
  { id: 'ro_water',     label: 'Ro / Water ...' },
  { id: 'chimneys',     label: 'Chimneys' },
  { id: 'mixer_grind',  label: 'Mixer Grind...' },
  { id: 'hob_stoves',   label: 'Hob & Stoves' },
  { id: 'ovens',        label: 'Ovens & Mi...' },
  { id: 'toasters',     label: 'Toasters' },
  { id: 'dishwashers',  label: 'Dishwashers' },
  { id: 'hob_and_st',   label: 'Hob And St...' },
];

const APPLIANCES_PRODUCTS = {
  ro_water: [
    { id: 'rw1', name: 'KENT Grand Plus Under-Sink RO Purifier',    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop' },
    { id: 'rw2', name: 'APEC Water ROES-50 Countertop RO System',   img: 'https://images.unsplash.com/photo-1556910638-6cdac31d44dc?w=300&h=300&fit=crop' },
    { id: 'rw3', name: 'Brita UltraMax Wall Mount Dispenser',       img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop' },
    { id: 'rw4', name: 'Pureit Copper Hot & Cold Water Purifier',   img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
  ],
  chimneys: [
    { id: 'ch1', name: 'Vent-A-Hood Premier Magic Lung Range Hood', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'ch2', name: 'Bosch 800 Series 36" Chimney Wall Hood',    img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop' },
    { id: 'ch3', name: 'Elica 60cm GALAXY T-Shape Chimney',         img: 'https://images.unsplash.com/photo-1556909096-54b5f11d0d07?w=300&h=300&fit=crop' },
    { id: 'ch4', name: 'Faber TENDER 3D Island Chimney',            img: 'https://images.unsplash.com/photo-1556909075-b5d50dc0c74e?w=300&h=300&fit=crop' },
    { id: 'ch5', name: 'Broan-NuTone Slim Line Stainless Chimney',  img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=300&h=300&fit=crop' },
    { id: 'ch6', name: 'Fotile JQG9001 Decorative Glass Chimney',   img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&h=300&fit=crop' },
  ],
  mixer_grind: [
    { id: 'mg1', name: 'KitchenAid Artisan 5-Qt Stand Mixer',       img: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=300&h=300&fit=crop' },
    { id: 'mg2', name: 'Vitamix 5200 Professional Blender',         img: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=300&h=300&fit=crop' },
    { id: 'mg3', name: 'Morphy Richards Icon 1000W Food Processor', img: 'https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=300&h=300&fit=crop' },
    { id: 'mg4', name: 'Preethi Eco Plus 750W Mixer Grinder',       img: 'https://images.unsplash.com/photo-1556910638-6cdac31d44dc?w=300&h=300&fit=crop' },
  ],
  hob_stoves: [
    { id: 'hs1', name: 'Hestan 42" Professional Built-In Gas Grill',img: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=300&h=300&fit=crop' },
    { id: 'hs2', name: 'Bosch 800 Series 4-Burner Gas Hob',         img: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&h=300&fit=crop' },
    { id: 'hs3', name: 'Miele KM6360 4-Zone Induction Cooktop',     img: 'https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=300&h=300&fit=crop' },
    { id: 'hs4', name: 'Gaggenau VG491 5-Burner Gas Hob',           img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'hs5', name: 'Duxtop 1800W Portable Induction Cooktop',   img: 'https://images.unsplash.com/photo-1556910638-6cdac31d44dc?w=300&h=300&fit=crop' },
    { id: 'hs6', name: 'Wolf GR486G 48" Dual Fuel Range',           img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop' },
  ],
  ovens: [
    { id: 'ov1', name: 'Bosch 800 Series 30" Double Wall Oven',     img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop' },
    { id: 'ov2', name: 'Whirlpool 2.2 Cu Ft Built-In Microwave',    img: 'https://images.unsplash.com/photo-1556909096-54b5f11d0d07?w=300&h=300&fit=crop' },
    { id: 'ov3', name: 'Samsung 30" Flex Duo Convection Oven',      img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'ov4', name: 'LG NeoChef Smart Inverter Microwave 32L',   img: 'https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=300&h=300&fit=crop' },
    { id: 'ov5', name: 'Wolf SO30TE/S/TH 30" E Series Single Oven', img: 'https://images.unsplash.com/photo-1556909075-b5d50dc0c74e?w=300&h=300&fit=crop' },
    { id: 'ov6', name: 'Miele H 6600 BM Speed Oven 24"',            img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&h=300&fit=crop' },
  ],
  toasters: [
    { id: 'to1', name: 'KitchenAid 4-Slice Automatic Long Slot Toaster', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'to2', name: 'Dualit NewGen 2-Slot Architect Series Toaster',  img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop' },
    { id: 'to3', name: 'Smeg TSF01 2-Slice Retro Pastel Toaster',        img: 'https://images.unsplash.com/photo-1556909096-54b5f11d0d07?w=300&h=300&fit=crop' },
    { id: 'to4', name: 'Breville Die-Cast 4-Slice Smart Toaster',        img: 'https://images.unsplash.com/photo-1556910638-6cdac31d44dc?w=300&h=300&fit=crop' },
  ],
  dishwashers: [
    { id: 'dw1', name: 'Bosch SHPM88Z75N 500 Series 24" Dishwasher',     img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop' },
    { id: 'dw2', name: 'Miele G7156SCVi Fully-Integrated Dishwasher',    img: 'https://images.unsplash.com/photo-1556909096-54b5f11d0d07?w=300&h=300&fit=crop' },
    { id: 'dw3', name: 'Samsung DW80R9950US StormWash+ Dishwasher',      img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&h=300&fit=crop' },
    { id: 'dw4', name: 'LG LDFN4542D QuadWash Dishwasher',               img: 'https://images.unsplash.com/photo-1556910638-6cdac31d44dc?w=300&h=300&fit=crop' },
    { id: 'dw5', name: 'Whirlpool WDT730PAHZ Compact Dishwasher',        img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=300&h=300&fit=crop' },
  ],
  hob_and_st: [
    { id: 'hst1', name: 'Bertazzoni PRO366DFSBI 36" Pro Series Range',   img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'hst2', name: 'La Cornue CornuFé 110 Freestanding Range',      img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&h=300&fit=crop' },
    { id: 'hst3', name: 'AGA Classic 3 Series 4-Oven Range',             img: 'https://images.unsplash.com/photo-1556909096-54b5f11d0d07?w=300&h=300&fit=crop' },
    { id: 'hst4', name: 'Ilve Majestic Hob & Oven Combo 60"',            img: 'https://images.unsplash.com/photo-1556909075-b5d50dc0c74e?w=300&h=300&fit=crop' },
  ],
};

// ── Sub-components ────────────────────────────────────────────────────────────

function KitchenProductCard({ p, liked, onLike }) {
  const { setDraggingProduct } = useDrag();
  return (
    <div
      className="cursor-grab active:cursor-grabbing group select-none"
      style={{ borderRadius: 4, overflow: 'hidden', background: '#2a2a2a' }}
      onMouseDown={(e) => { e.preventDefault(); setDraggingProduct(p); }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
        <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" draggable={false} />
      </div>
      <div className="flex items-start justify-between gap-1 px-2 py-1.5">
        <div className="min-w-0">
          <div className="text-[11px] font-medium leading-snug" style={{ color: 'rgba(255,255,255,0.85)' }}>{p.name}</div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onLike(); }}
          onMouseDown={(e) => e.stopPropagation()}
          className="flex-shrink-0 mt-0.5 transition-all"
          style={{ color: liked ? '#e87a5a' : 'rgba(255,255,255,0.25)' }}
        >
          <Heart size={13} fill={liked ? '#e87a5a' : 'none'} />
        </button>
      </div>
    </div>
  );
}

function SubTabBar({ tabs, active, onSelect }) {
  return (
    <div className="flex flex-wrap gap-1.5 px-3 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className="px-2.5 py-1 rounded text-[11px] font-medium transition-all"
          style={{
            background: active === t.id ? '#e87a5a' : 'rgba(255,255,255,0.07)',
            color: active === t.id ? '#fff' : 'rgba(255,255,255,0.6)',
            border: active === t.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── Main KitchenPanel ─────────────────────────────────────────────────────────

export default function KitchenPanel() {
  const [activeTab, setActiveTab] = useState('cabinet_styles');
  const [search, setSearch] = useState('');
  const [likedProducts, setLikedProducts] = useState({});
  const toggleLike = id => setLikedProducts(prev => ({ ...prev, [id]: !prev[id] }));

  // Cabinet Styles drill-down
  const [selectedStyle, setSelectedStyle] = useState(null);

  // Accessories sub-tab
  const [accSubTab, setAccSubTab] = useState('kitchen_acc');

  // KD Furniture sub-tab
  const [kdSubTab, setKdSubTab] = useState('base_units');

  // Appliances sub-tab
  const [appSubTab, setAppSubTab] = useState('chimneys');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedStyle(null);
  };

  // ── Search across all kitchen products ───────────────────────────────────
  const allKitchenProducts = [
    ...CABINET_STYLES.map(s => ({ id: s.id, name: s.name, img: s.img })),
    ...Object.values(CABINET_STYLE_PRODUCTS).flat(),
    ...Object.values(ACCESSORIES_PRODUCTS).flat(),
    ...Object.values(KD_FURNITURE_PRODUCTS).flat(),
    ...Object.values(APPLIANCES_PRODUCTS).flat(),
  ];
  const searchResults = search
    ? allKitchenProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div className="flex flex-col h-full" style={{ background: '#1a1a1a' }}>

      {/* Search bar */}
      <div className="px-3 pt-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Search size={13} style={{ color: 'rgba(255,255,255,0.35)' }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setSelectedStyle(null); }}
            className="bg-transparent text-xs outline-none flex-1"
            placeholder="Search products or explore kitchen by..."
            style={{ color: 'rgba(255,255,255,0.8)' }}
          />
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="w-3 h-3 rounded" style={{ border: '1px solid rgba(255,255,255,0.2)' }} />
          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Exact Match</span>
          <Info size={12} strokeWidth={2} className="ml-0.5 cursor-help" style={{ color: 'rgba(255,255,255,0.25)' }} title="Match product names exactly" aria-hidden />
        </div>
      </div>

      {/* Search results */}
      {search ? (
        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-[10px] mb-2 px-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{searchResults.length} results</div>
          <div className="grid grid-cols-2 gap-2">
            {searchResults.map(p => (
              <KitchenProductCard key={p.id} p={p} liked={likedProducts[p.id]} onLike={() => toggleLike(p.id)} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Main tab strip */}
          <div className="px-3 pt-2.5 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex flex-wrap gap-1.5">
              {KITCHEN_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all"
                  style={{
                    background: activeTab === tab.id ? '#fff' : 'transparent',
                    color: activeTab === tab.id ? '#111' : 'rgba(255,255,255,0.65)',
                    border: activeTab === tab.id ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── CABINET STYLES ── */}
          {activeTab === 'cabinet_styles' && !selectedStyle && (
            <div className="flex-1 overflow-y-auto">
              <div className="px-3 py-2">
                <p className="text-[11px]" style={{ color: '#e87a5a' }}>
                  To design a kitchen, select any Cabinet style of your choice.
                </p>
                <p className="text-[11px] font-semibold text-white mt-1.5">{CABINET_STYLES.length} Styles</p>
              </div>
              <div className="grid grid-cols-2 gap-0.5 px-0.5 pb-2">
                {CABINET_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className="text-left group"
                  >
                    <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                      <img src={style.img} alt={style.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="flex items-center justify-between px-1 py-1.5">
                      <span className="text-[11px] font-medium" style={{ color: '#e87a5a' }}>{style.name}</span>
                      <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{style.count} Items</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── CABINET STYLE PRODUCTS (drill-down) ── */}
          {activeTab === 'cabinet_styles' && selectedStyle && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <button onClick={() => setSelectedStyle(null)} className="flex items-center gap-1 text-xs font-medium" style={{ color: '#e87a5a' }}>
                  <ChevronLeft size={13} /> {CABINET_STYLES.find(s => s.id === selectedStyle)?.name}
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                <div className="grid grid-cols-2 gap-2">
                  {(CABINET_STYLE_PRODUCTS[selectedStyle] || []).map(p => (
                    <KitchenProductCard key={p.id} p={p} liked={likedProducts[p.id]} onLike={() => toggleLike(p.id)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ACCESSORIES ── */}
          {activeTab === 'accessories' && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-xs font-bold" style={{ color: '#e87a5a' }}>Accessories</span>
              </div>
              <SubTabBar tabs={ACCESSORIES_TABS} active={accSubTab} onSelect={setAccSubTab} />
              <div className="flex-1 overflow-y-auto p-2">
                <div className="grid grid-cols-2 gap-2">
                  {(ACCESSORIES_PRODUCTS[accSubTab] || []).map(p => (
                    <KitchenProductCard key={p.id} p={p} liked={likedProducts[p.id]} onLike={() => toggleLike(p.id)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── KITCHEN & DINING FURNITURE ── */}
          {activeTab === 'kd_furniture' && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-xs font-bold" style={{ color: '#e87a5a' }}>Kitchen & Dining Furniture</span>
              </div>
              <SubTabBar tabs={KD_FURNITURE_TABS} active={kdSubTab} onSelect={setKdSubTab} />
              <div className="flex-1 overflow-y-auto p-2">
                <div className="grid grid-cols-2 gap-2">
                  {(KD_FURNITURE_PRODUCTS[kdSubTab] || []).map(p => (
                    <KitchenProductCard key={p.id} p={p} liked={likedProducts[p.id]} onLike={() => toggleLike(p.id)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── APPLIANCES ── */}
          {activeTab === 'appliances' && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-xs font-bold" style={{ color: '#e87a5a' }}>Appliances</span>
              </div>
              <SubTabBar tabs={APPLIANCES_TABS} active={appSubTab} onSelect={setAppSubTab} />
              <div className="flex-1 overflow-y-auto p-2">
                <div className="grid grid-cols-2 gap-2">
                  {(APPLIANCES_PRODUCTS[appSubTab] || []).map(p => (
                    <KitchenProductCard key={p.id} p={p} liked={likedProducts[p.id]} onLike={() => toggleLike(p.id)} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
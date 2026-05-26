# Product Catalog Assets

The planner catalog uses local assets only:

- `public/assets/products/thumbnails` for catalog cards
- `public/assets/products/top-view` for 2D canvas placement
- `public/assets/products/models` for optional `.glb` or `.gltf` models

## Add A Product

Add a product object in `src/data/productCatalog.js` using this shape:

```js
{
  id: 'curved-boucle-lounge-chair',
  name: 'Curved Boucle Lounge Chair',
  category: 'armchairs',
  subcategory: 'Lounge Chairs',
  brand: 'Atelier Vale',
  thumbnailUrl: '/assets/products/thumbnails/curved-boucle-lounge-chair.svg',
  topViewUrl: '/assets/products/top-view/curved-boucle-lounge-chair.svg',
  model3dUrl: '/assets/products/models/curved-boucle-lounge-chair.glb',
  dimensions: { width: 34, depth: 36, height: 29 },
  materials: ['boucle', 'powder coated steel'],
  colors: ['cream', 'black'],
  price: 860
}
```

Use inches for `dimensions`. The 2D canvas converts width and depth into a scaled footprint.

## Placeholder Assets

Run this when adding demo products before real 3D models exist:

```bash
npm run generate:product-placeholders
```

This creates consistent SVG studio thumbnails and top-view symbols for every product in `src/data/productCatalog.js`.

## Render From GLB Models

Place model files in:

```bash
public/assets/products/models
```

Name each model with the matching product id, for example:

```bash
public/assets/products/models/curved-boucle-lounge-chair.glb
```

Then run Blender from the `Frontend` directory:

```bash
npm run generate:product-thumbnails
```

The Blender workflow centers the model, normalizes scale, adds a neutral studio floor, soft area lights, contact shadows, a 3/4 camera, and writes a catalog thumbnail plus top-view render.

The current demo library ships with generated studio-style SVG placeholders. Replace them with PNG renders from Blender when final `.glb` files are available.

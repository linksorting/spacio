import argparse
import math
from pathlib import Path

import bpy
from mathutils import Vector


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--models", default="public/assets/products/models")
    parser.add_argument("--thumbnails", default="public/assets/products/thumbnails")
    parser.add_argument("--top-view", default="public/assets/products/top-view")
    return parser.parse_args()


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def import_model(path):
    suffix = path.suffix.lower()
    if suffix in {".glb", ".gltf"}:
        bpy.ops.import_scene.gltf(filepath=str(path))
    elif suffix == ".obj":
        bpy.ops.import_scene.obj(filepath=str(path))
    else:
        raise ValueError(f"Unsupported model format: {path.suffix}")


def scene_bounds(objects):
    points = []
    for obj in objects:
        if obj.type == "MESH":
            points.extend([obj.matrix_world @ Vector(corner) for corner in obj.bound_box])
    min_v = Vector((min(p.x for p in points), min(p.y for p in points), min(p.z for p in points)))
    max_v = Vector((max(p.x for p in points), max(p.y for p in points), max(p.z for p in points)))
    return min_v, max_v


def normalize_model():
    objects = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    min_v, max_v = scene_bounds(objects)
    center = (min_v + max_v) / 2
    size = max(max_v.x - min_v.x, max_v.y - min_v.y, max_v.z - min_v.z)
    scale = 2.4 / max(size, 0.001)

    for obj in objects:
        obj.location -= center
        obj.scale *= scale
        obj.select_set(True)

    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    min_v, max_v = scene_bounds(objects)
    for obj in objects:
        obj.location.z -= min_v.z
    return objects


def setup_world():
    bpy.context.scene.render.engine = "CYCLES"
    bpy.context.scene.cycles.samples = 96
    bpy.context.scene.view_settings.view_transform = "Filmic"
    bpy.context.scene.view_settings.look = "Medium High Contrast"
    bpy.context.scene.render.resolution_x = 512
    bpy.context.scene.render.resolution_y = 320
    bpy.context.scene.world.color = (0.94, 0.94, 0.92)

    bpy.ops.mesh.primitive_plane_add(size=8, location=(0, 0, 0))
    plane = bpy.context.object
    plane.name = "Studio shadow plane"
    mat = bpy.data.materials.new("warm light gray floor")
    mat.diffuse_color = (0.82, 0.80, 0.76, 1)
    plane.data.materials.append(mat)

    bpy.ops.object.light_add(type="AREA", location=(-2.8, -3.2, 4.5))
    key = bpy.context.object
    key.name = "Large softbox key"
    key.data.energy = 450
    key.data.size = 4.5

    bpy.ops.object.light_add(type="AREA", location=(3.5, 4.2, 3.2))
    fill = bpy.context.object
    fill.name = "Soft fill"
    fill.data.energy = 120
    fill.data.size = 5.2


def aim_camera(camera, target):
    direction = Vector(target) - camera.location
    camera.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def render_camera(output_path, location, focal_length=60):
    bpy.ops.object.camera_add(location=location)
    camera = bpy.context.object
    camera.data.lens = focal_length
    aim_camera(camera, (0, 0, 0.8))
    bpy.context.scene.camera = camera
    bpy.context.scene.render.filepath = str(output_path)
    bpy.ops.render.render(write_still=True)
    bpy.data.objects.remove(camera, do_unlink=True)


def render_model(model_path, thumbnail_dir, top_view_dir):
    clear_scene()
    setup_world()
    import_model(model_path)
    normalize_model()

    stem = model_path.stem
    render_camera(thumbnail_dir / f"{stem}.png", (3.0, -4.2, 2.4), 70)
    render_camera(top_view_dir / f"{stem}.png", (0.0, 0.0, 5.2), 80)


def main():
    args = parse_args()
    model_dir = Path(args.models)
    thumbnail_dir = Path(args.thumbnails)
    top_view_dir = Path(args.top_view)
    thumbnail_dir.mkdir(parents=True, exist_ok=True)
    top_view_dir.mkdir(parents=True, exist_ok=True)

    model_paths = sorted([*model_dir.glob("*.glb"), *model_dir.glob("*.gltf"), *model_dir.glob("*.obj")])
    for model_path in model_paths:
        render_model(model_path, thumbnail_dir, top_view_dir)


if __name__ == "__main__":
    main()

import math, os
from typing import Tuple
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from moviepy import VideoClip

# === Paramètres ===
INPUT_PATH = "assets/ocean.png"
OUTPUT_PATH = "public/ocean_loop_8s.mp4"
DURATION = 8.0
FPS = 30
TARGET_W, TARGET_H = 1920, 1080

# Zones/effets
SEA_PORTION = 0.48
WAVE_AMPL   = 8
WAVE_LEN    = 110
WAVE_SPEED  = 0.25

BOB_ANGLE_DEG = 0.35
BOB_ZOOM      = 0.01
BOB_SPEED     = 0.35

WIND_COUNT = 35
WIND_THICK = (2, 5)
WIND_SPEED = (120, 220)
WIND_ALPHA = 70
WIND_BLUR  = 1.5

BG_COLOR = (0, 0, 0)

def load_and_fit_image(path: str, size: Tuple[int, int]) -> Image.Image:
    img = Image.open(path).convert("RGB")
    img_ratio = img.width / img.height
    tgt_ratio = size[0] / size[1]
    if img_ratio > tgt_ratio:
        new_h = size[1]
        new_w = int(img_ratio * new_h)
    else:
        new_w = size[0]
        new_h = int(new_w / img_ratio)
    img = img.resize((new_w, new_h), Image.LANCZOS)
    left = (new_w - size[0]) // 2
    top  = (new_h - size[1]) // 2
    return img.crop((left, top, left + size[0], top + size[1]))

BASE = load_and_fit_image(INPUT_PATH, (TARGET_W, TARGET_H))
BASE_NP = np.array(BASE, dtype=np.uint8)

rng = np.random.default_rng(42)
WIND_PARAMS = []
for _ in range(WIND_COUNT):
    y = rng.integers(low=int(TARGET_H*0.15), high=int(TARGET_H*0.85))
    thickness = int(rng.integers(WIND_THICK[0], WIND_THICK[1]+1))
    speed = float(rng.uniform(WIND_SPEED[0], WIND_SPEED[1]))
    length = int(rng.integers(int(TARGET_W*0.25), int(TARGET_W*0.6)))
    offset = float(rng.uniform(0, TARGET_W))
    WIND_PARAMS.append((y, thickness, speed, length, offset))

def draw_wind_layer(t: float) -> Image.Image:
    layer = Image.new("RGBA", (TARGET_W, TARGET_H), (0, 0, 0, 0))
    dr = ImageDraw.Draw(layer)
    for (y, thickness, speed, length, offset) in WIND_PARAMS:
        x = ((offset + speed * t) % (TARGET_W + length)) - length
        segs = 6
        for i in range(segs):
            x0 = x + i*(length/segs)
            x1 = x + (i+1)*(length/segs)
            yy = y + 6*math.sin(2*math.pi*(i/segs) + t*1.1)
            dr.line([(x0, yy), (x1, yy)], fill=(255,255,255,WIND_ALPHA), width=int(thickness))
    if WIND_BLUR > 0:
        layer = layer.filter(ImageFilter.GaussianBlur(radius=WIND_BLUR))
    return layer

def apply_wave_displace(base_np: np.ndarray, t: float) -> np.ndarray:
    h, w, _ = base_np.shape
    out = base_np.copy()
    sea_start = int(h * (1.0 - SEA_PORTION))
    xs = np.arange(w, dtype=np.float32)
    freq = (2*np.pi) / max(1, WAVE_LEN)
    phase = 2*np.pi*WAVE_SPEED*t
    for y in range(sea_start, h):
        amp = WAVE_AMPL * ((y - sea_start) / max(1, h - sea_start))
        shift = amp * np.sin(freq * y + phase)
        xshift = (xs + shift).clip(0, w-1).astype(np.int32)
        out[y, :, :] = base_np[y, xshift, :]
    return out

def apply_bobbing(img: Image.Image, t: float) -> Image.Image:
    angle = BOB_ANGLE_DEG * math.sin(2*math.pi*BOB_SPEED*t)
    zoom  = 1.0 + BOB_ZOOM * math.sin(2*math.pi*BOB_SPEED*t + math.pi/2)
    zw, zh = int(TARGET_W*zoom), int(TARGET_H*zoom)
    zoomed = img.resize((zw, zh), Image.LANCZOS)
    left, top = (zw-TARGET_W)//2, (zh-TARGET_H)//2
    zoomed = zoomed.crop((left, top, left+TARGET_W, top+TARGET_H))
    rotated = zoomed.rotate(angle, resample=Image.BICUBIC, expand=False, fillcolor=BG_COLOR)
    return rotated

def make_frame(t: float) -> np.ndarray:
    displaced = apply_wave_displace(BASE_NP, t)
    frame = Image.fromarray(displaced)
    frame = apply_bobbing(frame, t)
    wind  = draw_wind_layer(t)
    frame = frame.convert("RGBA")
    frame.alpha_composite(wind)
    frame = frame.convert("RGB")
    return np.array(frame)

if __name__ == "__main__":
    os.makedirs("public", exist_ok=True)
    if not os.path.exists(INPUT_PATH):
        raise SystemExit(f"Image introuvable : {INPUT_PATH}")
    print("➡️  Génération vidéo…")
    clip = VideoClip(make_frame, duration=DURATION)
    # API MoviePy v2
    clip.write_videofile(
        OUTPUT_PATH,
        fps=FPS,
        codec="libx264",
        audio=False,
        preset="medium",
        ffmpeg_params=["-pix_fmt","yuv420p","-movflags","+faststart","-profile:v","high","-tune","animation"],
    )
    print(f"✅ Terminé : {OUTPUT_PATH}")

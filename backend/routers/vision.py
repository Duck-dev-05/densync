from fastapi import APIRouter, UploadFile, File
import io
import re
from PIL import Image
from services.vision import run_qwen

router = APIRouter(prefix="/api")

@router.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    width, height = image.size
    
    # Task 1: Generate a detailed caption
    caption_prompt = "Perform an industrial quality inspection on this image. Identify any visible defects, cracks, burns, or leaks. Describe the severity of the damage. Keep it brief."
    caption = run_qwen(caption_prompt, image)
    
    # Clean up any special tokens in the caption
    caption = caption.replace("<|im_end|>", "").strip()
    
    # Task 2: Object Detection (Qwen2-VL specific format)
    od_prompt = "Detect all defects, cracks, burnt components, leaks, and damaged areas. Return their bounding boxes."
    od_raw = run_qwen(od_prompt, image)
    
    # Parse Qwen2-VL bounding box format
    pattern = r'<\|object_ref_start\|>(.*?)<\|object_ref_end\|><\|box_start\|>\((\d+),(\d+)\),\((\d+),(\d+)\)<\|box_end\|>'
    matches = re.findall(pattern, od_raw)
    
    bboxes = []
    labels = []
    
    for match in matches:
        label = match[0]
        ymin = int(match[1])
        xmin = int(match[2])
        ymax = int(match[3])
        xmax = int(match[4])
        
        # Qwen normalizes coordinates to 1000
        x1 = (xmin / 1000.0) * width
        y1 = (ymin / 1000.0) * height
        x2 = (xmax / 1000.0) * width
        y2 = (ymax / 1000.0) * height
        
        labels.append(label)
        bboxes.append([x1, y1, x2, y2])
        
    return {
        "caption": caption,
        "objects": {
            "bboxes": bboxes,
            "labels": labels
        }
    }

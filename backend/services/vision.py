import torch
from transformers import AutoProcessor, Qwen2VLForConditionalGeneration
import transformers.models.qwen2_vl.processing_qwen2_vl
from PIL import Image

model_id = "Qwen/Qwen2-VL-2B-Instruct"
device = "cuda" if torch.cuda.is_available() else "cpu"
torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32

print(f"Loading native {model_id} on {device}...")
model = Qwen2VLForConditionalGeneration.from_pretrained(model_id, torch_dtype=torch_dtype).to(device)
processor = AutoProcessor.from_pretrained(model_id)
print("Model loaded successfully!")

def run_qwen(prompt: str, image: Image.Image) -> str:
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "image"},
                {"type": "text", "text": prompt},
            ],
        }
    ]
    text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    inputs = processor(text=[text], images=[image], padding=True, return_tensors="pt").to(device)
    
    generated_ids = model.generate(**inputs, max_new_tokens=256)
    generated_ids_trimmed = [
        out_ids[len(in_ids):] for in_ids, out_ids in zip(inputs.input_ids, generated_ids)
    ]
    
    output_text = processor.batch_decode(
        generated_ids_trimmed, skip_special_tokens=False, clean_up_tokenization_spaces=False
    )[0]
    return output_text

from fastapi import APIRouter, Depends
from sqlmodel import Session, select
import random
import subprocess
from database import get_session
from models import UserRanking, AiFeedbackQueue, User
from auth import get_current_user, require_expert_or_admin

router = APIRouter(prefix="/api")

@router.get("/analytics/factory")
async def get_factory_analytics(current_user: User = Depends(get_current_user)):
    """Factory-wide telemetry. Visible to every authenticated role (Factory Monitor)."""
    # Simulated live telemetry data
    return {
        "status": "success",
        "data": {
            "active_sensors": random.randint(2300, 2500),
            "ai_latency_ms": round(random.uniform(3.5, 5.5), 1),
            "critical_alerts": random.randint(0, 3),
            "engineers_online": random.randint(120, 160),
            "factories": [
                {"id": "haiphong", "name": "Hải Phòng", "status": random.choice(["success", "warning", "danger"]), "loc": "VN"},
                {"id": "gunma", "name": "Gunma", "status": random.choice(["success", "warning", "danger"]), "loc": "JP"},
                {"id": "bangkok", "name": "Bangkok", "status": random.choice(["success", "warning", "danger"]), "loc": "TH"},
            ]
        }
    }

@router.get("/leaderboard")
async def get_leaderboard(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Expert Ranking board - every authenticated role can read it."""
    rankings = session.exec(select(UserRanking).order_by(UserRanking.score.desc())).all()
    return {"status": "success", "data": rankings}

@router.get("/analytics/ai")
async def get_ai_analytics(
    session: Session = Depends(get_session),
    current_user: User = Depends(require_expert_or_admin),
):
    """Model Management telemetry - Factory Expert / System Admin only (matches RBAC)."""
    queue = session.exec(select(AiFeedbackQueue).where(AiFeedbackQueue.status == "pending")).all()
    
    # Read real local GPU telemetry using nvidia-smi
    gpu_usage = 0.0
    vram_used = 0.0
    vram_total = 80.0
    
    try:
        result = subprocess.run(
            ['nvidia-smi', '--query-gpu=utilization.gpu,memory.used,memory.total', '--format=csv,noheader,nounits'],
            stdout=subprocess.PIPE,
            text=True,
            check=True
        )
        # Parse the output: e.g. "4, 1335, 4096"
        parts = result.stdout.strip().split(',')
        if len(parts) >= 3:
            gpu_usage = float(parts[0].strip())
            # Convert MB to GB
            vram_used = round(float(parts[1].strip()) / 1024, 1)
            vram_total = round(float(parts[2].strip()) / 1024, 1)
    except Exception as e:
        print(f"Error fetching real GPU stats: {e}")
        # Fallback if nvidia-smi fails
        gpu_usage = round(random.uniform(78.5, 84.5), 1)
        vram_used = round(random.uniform(62.5, 66.8), 1)
        vram_total = 80.0

    return {
        "status": "success",
        "data": {
            "gpu_usage": gpu_usage,
            "vram": vram_used,
            "total_vram": vram_total,
            "latency": round(random.uniform(42.0, 48.0), 1), # Latency is still simulated for network transit
            "queue": queue
        }
    }

@router.post("/analytics/ai/queue/{task_id}")
async def update_ai_queue(
    task_id: str,
    payload: dict,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_expert_or_admin),
):
    """Approve/reject a queued AI prediction - Factory Expert / System Admin only."""
    action = payload.get("action")
    if action not in ["approved", "rejected"]:
        return {"status": "error", "message": "Invalid action"}
    
    item = session.exec(select(AiFeedbackQueue).where(AiFeedbackQueue.task_id == task_id)).first()
    if item:
        item.status = action
        session.add(item)
        session.commit()
        return {"status": "success"}
    return {"status": "error", "message": "Item not found"}

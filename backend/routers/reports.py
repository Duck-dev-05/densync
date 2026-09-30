from fastapi import APIRouter, Depends
from sqlmodel import Session
from database import get_session
from models import IncidentReport

router = APIRouter(prefix="/api")

@router.post("/submit-cause")
async def submit_cause(report: IncidentReport, session: Session = Depends(get_session)):
    session.add(report)
    session.commit()
    session.refresh(report)
    return {"status": "success", "data": report}

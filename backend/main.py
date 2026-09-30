from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import warnings
from contextlib import asynccontextmanager
from database import create_db_and_tables, get_session, engine
from models import UserRanking
from sqlmodel import Session, select

from routers import vision, knowledge, reports, analytics

warnings.filterwarnings("ignore")

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    with Session(engine) as session:
        if not session.exec(select(UserRanking)).first():
            session.add_all([
                UserRanking(user_id="u1", name="Dr. Kenji Tanaka", role="Senior Diagnostics Eng", location="Gunma Plant", score=12400, rank=1, level="Elite"),
                UserRanking(user_id="u2", name="Nguyen Thi Mai", role="Lead Robotics Tech", location="Hải Phòng", score=9850, rank=2, level="Senior"),
                UserRanking(user_id="u3", name="Somchai Prasert", role="Quality Assurance Lead", location="Bangkok Assembly", score=8900, rank=3, level="Senior"),
                UserRanking(user_id="u4", name="Elena Rostova", role="Automation Specialist", location="Berlin Stamping", score=8100, rank=4, level="Specialist"),
                UserRanking(user_id="u5", name="Marcus Chen", role="Systems Architect", location="Global Support", score=7650, rank=5, level="Specialist")
            ])
            session.commit()
    yield

app = FastAPI(title="Densync API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(vision.router)
app.include_router(knowledge.router)
app.include_router(reports.router)
app.include_router(analytics.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)


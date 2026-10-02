from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import warnings
import json
from contextlib import asynccontextmanager
from database import create_db_and_tables, get_session, engine
from models import UserRanking, User, UserRole, Solution, IncidentReport
from sqlmodel import Session, select

from routers import vision, knowledge, reports, analytics, users, solutions

warnings.filterwarnings("ignore")

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    with Session(engine) as session:
        # Seed UserRanking data
        if not session.exec(select(UserRanking)).first():
            session.add_all([
                UserRanking(user_id="u1", name="Dr. Kenji Tanaka", role="Senior Diagnostics Eng", location="Gunma Plant", score=12400, rank=1, level="Elite"),
                UserRanking(user_id="u2", name="Nguyen Thi Mai", role="Lead Robotics Tech", location="Hải Phòng", score=9850, rank=2, level="Senior"),
                UserRanking(user_id="u3", name="Somchai Prasert", role="Quality Assurance Lead", location="Bangkok Assembly", score=8900, rank=3, level="Senior"),
                UserRanking(user_id="u4", name="Elena Rostova", role="Automation Specialist", location="Berlin Stamping", score=8100, rank=4, level="Specialist"),
                UserRanking(user_id="u5", name="Marcus Chen", role="Systems Architect", location="Global Support", score=7650, rank=5, level="Specialist")
            ])
            session.commit()
        
        # Seed User data with roles
        if not session.exec(select(User)).first():
            session.add_all([
                # Factory Operators
                User(user_id="op1", name="Tanaka Hiroshi", role=UserRole.FACTORY_OPERATOR, factory_location="Gunma Plant", email="hiroshi@densync.com"),
                User(user_id="op2", name="Nguyen Van A", role=UserRole.FACTORY_OPERATOR, factory_location="Hải Phòng", email="vana@densync.com"),
                User(user_id="op3", name="Somchai B", role=UserRole.FACTORY_OPERATOR, factory_location="Bangkok Assembly", email="somchai@densync.com"),
                # Factory Experts
                User(user_id="exp1", name="Dr. Kenji Tanaka", role=UserRole.FACTORY_EXPERT, factory_location="Gunma Plant", email="kenji@densync.com"),
                User(user_id="exp2", name="Nguyen Thi Mai", role=UserRole.FACTORY_EXPERT, factory_location="Hải Phòng", email="mai@densync.com"),
                # System Administrators
                User(user_id="admin1", name="Marcus Chen", role=UserRole.SYSTEM_ADMIN, factory_location="Global Support", email="marcus@densync.com")
            ])
            session.commit()

        # Seed solutions: known errors -> verified fixes (per factory / global)
        if not session.exec(select(Solution)).first():
            session.add_all([
                Solution(
                    error_code="#ERR-101",
                    title="Conveyor Belt Jam",
                    summary="Immediate intervention to clear a stalled conveyor and safely restart the line without damaging the drive assembly.",
                    severity="high",
                    equipment="Conveyor Belt #3 — Line A",
                    factory=None,  # global: every factory already knows this fix
                    steps=json.dumps([
                        {"title": "Stop conveyor", "detail": "Press the E-stop on control panel CP-3 and wait for all belt motion to come to a complete halt. Confirm the drive motor indicator is off before proceeding."},
                        {"title": "Clear debris", "detail": "Inspect the full belt path for jammed material. Wearing cut-resistant gloves, remove debris from between the rollers and belt seams. Check that the belt is still tracked correctly on both ends."},
                        {"title": "Restart system", "detail": "Release the E-stop, reset the overload breaker, and restart at reduced speed. Observe one full cycle for unusual noise or slipping, then return the line to normal throughput."},
                    ]),
                    warnings=json.dumps([
                        "Lock out / tag out the panel before reaching into the belt path.",
                        "Do not restart if the belt is misaligned — re-track it first to prevent edge damage.",
                        "If the jam recurs twice, stop and escalate to a Factory Expert: a sensor fault may be the root cause.",
                    ]),
                    tools=json.dumps(["Cut-resistant gloves", "Lockout / tagout kit", "Inspection flashlight"]),
                    confidence=95,
                    estimated_time="10–15 min",
                    author="Dr. Kenji Tanaka",
                    author_role="Senior Diagnostics Eng",
                    uses=42,
                    rating=4.9,
                ),
                Solution(
                    error_code="#ERR-233",
                    title="Motor Overheating",
                    summary="Stabilize motor temperature by restoring airflow and shedding load, preventing thermal damage to the windings.",
                    severity="critical",
                    equipment="Main Drive Motor M-7 — Assembly Line B",
                    factory="Gunma Plant",  # factory-specific fix
                    steps=json.dumps([
                        {"title": "Check ventilation", "detail": "Confirm the cooling fan spins freely and that intake filters are not clogged with dust. Clean filters with compressed air and verify there is at least 30 cm clearance around the housing."},
                        {"title": "Reduce load", "detail": "Lower the operating load below 80% of rated capacity — shed non-critical consumers on the line and switch the drive to the reduced-speed profile."},
                        {"title": "Monitor temp", "detail": "Watch the temperature sensor for 15 minutes. Reading must fall below 75 °C and keep trending down before resuming full production."},
                    ]),
                    warnings=json.dumps([
                        "If temperature exceeds 110 °C or you smell burning, emergency-stop and isolate power immediately.",
                        "Never block the fan opening with guards or material during the reset.",
                        "A repeat overheating event within 24 h indicates bearing wear — escalate instead of re-applying this solution.",
                    ]),
                    tools=json.dumps(["IR thermometer", "Compressed air can", "Thermal camera (optional)"]),
                    confidence=88,
                    estimated_time="15–20 min",
                    author="Nguyen Thi Mai",
                    author_role="Lead Robotics Tech",
                    uses=37,
                    rating=4.7,
                ),
            ])
            session.commit()

        # Seed unresolved incident reports (new errors waiting for an expert)
        if not session.exec(select(IncidentReport)).first():
            session.add_all([
                IncidentReport(
                    title="Hydraulic pressure drop",
                    description="Robotic arm R-4 hydraulic line losing pressure after 20 min of operation.",
                    severity="high", category="Hydraulic", factory_location="Gunma Plant",
                ),
                IncidentReport(
                    title="Sensor calibration error",
                    description="Quality camera reporting false positives after firmware update.",
                    severity="medium", category="Electrical", factory_location="Hải Phòng",
                ),
                IncidentReport(
                    title="Unusual vibration pattern",
                    description="Spindle vibration above baseline on the Bangkok assembly line.",
                    severity="low", category="Mechanical", factory_location="Bangkok Assembly",
                ),
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
app.include_router(users.router)
app.include_router(solutions.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)


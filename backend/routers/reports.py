from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_session
from models import IncidentReport, Solution, User, UserRole
from auth import get_current_user, require_expert_or_admin

router = APIRouter(prefix="/api")


def _norm(code) -> str:
    return (code or "").strip().upper().lstrip("#")


@router.post("/submit-cause")
async def submit_cause(
    report: IncidentReport,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Submit incident report - All roles can submit reports."""
    # Stamp the reporter's factory so experts only see their own plant's reports
    if not report.factory_location:
        report.factory_location = current_user.factory_location
    session.add(report)
    session.commit()
    session.refresh(report)
    return {"status": "success", "data": report}


@router.get("/reports/pending")
async def pending_reports(
    session: Session = Depends(get_session),
    current_user: User = Depends(require_expert_or_admin),
):
    """New errors that have NO solution yet -> waiting for a Factory Expert.

    A report counts as resolved once a solution exists for its error code
    that is either global or scoped to the report's factory.
    """
    reports = session.exec(select(IncidentReport)).all()
    solutions = session.exec(select(Solution)).all()

    # Experts see their own factory; System Admins see everything
    if current_user.role != UserRole.SYSTEM_ADMIN:
        reports = [
            r for r in reports
            if not r.factory_location or r.factory_location == current_user.factory_location
        ]

    def covered(rep: IncidentReport) -> bool:
        for sol in solutions:
            if _norm(sol.error_code) != _norm(rep.title):
                continue
            if sol.factory is None:
                return True
            if rep.factory_location and sol.factory == rep.factory_location:
                return True
        return False

    pending = [r for r in reports if not covered(r)]
    pending.sort(key=lambda r: r.created_at, reverse=True)

    data = [
        {
            "id": r.id,
            "title": r.title,
            "description": r.description,
            "severity": r.severity,
            "category": r.category,
            "factory_location": r.factory_location,
            "created_at": r.created_at.isoformat(),
        }
        for r in pending
    ]
    return {"status": "success", "data": data}

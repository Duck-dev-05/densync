import json
import re
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from database import get_session
from models import Solution, SolutionCreate, IncidentReport, User, UserRole
from auth import get_current_user, require_expert_or_admin

router = APIRouter(prefix="/api")

ROLE_LABELS = {
    UserRole.FACTORY_OPERATOR: "Factory Operator",
    UserRole.FACTORY_EXPERT: "Factory Expert",
    UserRole.SYSTEM_ADMIN: "System Administrator",
}


def _norm(code: Optional[str]) -> str:
    """Normalize an error code for comparison ('#ERR-101' == 'err-101')."""
    return (code or "").strip().upper().lstrip("#")


def _parse_json_list(raw: str):
    if not raw:
        return []
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, list):
            return parsed
    except Exception:
        pass
    # Fallback: newline separated text
    return [ln.strip() for ln in raw.splitlines() if ln.strip()]


def _solution_dict(s: Solution) -> dict:
    steps = _parse_json_list(s.steps)
    steps = [
        {"title": st, "detail": ""} if isinstance(st, str) else st
        for st in steps
    ]
    return {
        "id": s.id,
        "error_code": s.error_code,
        "title": s.title,
        "summary": s.summary,
        "severity": s.severity,
        "equipment": s.equipment,
        "factory": s.factory,
        "steps": steps,
        "warnings": _parse_json_list(s.warnings),
        "tools": _parse_json_list(s.tools),
        "confidence": s.confidence,
        "estimated_time": s.estimated_time,
        "author": s.author,
        "author_role": s.author_role,
        "uses": s.uses,
        "rating": s.rating,
        "created_at": s.created_at.isoformat(),
    }


@router.get("/solutions/match")
async def match_solution(
    error_code: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Find the solution for an error code in the CURRENT USER'S factory.

    Priority: factory-specific solution -> global solution -> null
    (null = new error, waiting for a Factory Expert).

    Also returns `already_reported`: whether an incident report for this
    error already exists in the expert queue for this factory.
    """
    target = _norm(error_code)
    rows = session.exec(select(Solution)).all()

    factory_hit = next(
        (r for r in rows
         if _norm(r.error_code) == target and r.factory == current_user.factory_location),
        None,
    )
    global_hit = next(
        (r for r in rows if _norm(r.error_code) == target and r.factory is None),
        None,
    )
    picked = factory_hit or global_hit

    reports = session.exec(select(IncidentReport)).all()
    already_reported = any(
        _norm(r.title) == target
        and (r.factory_location is None or r.factory_location == current_user.factory_location)
        for r in reports
    )

    return {
        "status": "success",
        "data": _solution_dict(picked) if picked else None,
        "already_reported": already_reported,
    }


@router.get("/solutions")
async def list_solutions(
    mine: bool = False,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """List solutions visible to the current user.

    mine=true  -> solutions authored by the current user (expert view)
    otherwise  -> global solutions + solutions for the user's factory
    """
    rows = session.exec(select(Solution)).all()
    if mine:
        rows = [r for r in rows if r.author == current_user.name]
    else:
        rows = [
            r for r in rows
            if r.factory is None or r.factory == current_user.factory_location
        ]
    rows.sort(key=lambda r: r.created_at, reverse=True)
    return {"status": "success", "data": [_solution_dict(r) for r in rows]}


@router.get("/solutions/{solution_id}")
async def get_solution(
    solution_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    solution = session.get(Solution, solution_id)
    if not solution:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solution not found")
    # Same isolation rule as list_solutions: a factory-scoped solution is only
    # readable by users of that factory; global solutions are readable by all.
    if solution.factory is not None and solution.factory != current_user.factory_location:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. This solution belongs to another factory.",
        )
    return {"status": "success", "data": _solution_dict(solution)}


@router.post("/solutions")
async def create_solution(
    payload: SolutionCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_expert_or_admin),
):
    """Create a solution for an error code (Factory Expert / System Admin only).

    scope='factory' -> solution only applies to the creator's factory
    scope='global'  -> solution applies to every factory
    """

    def lines_to_step_json(text: str) -> str:
        items = []
        for ln in (text or "").splitlines():
            title = re.sub(r"^\s*\d+[.)]?\s*", "", ln).strip()
            if title:
                items.append({"title": title, "detail": ""})
        return json.dumps(items)

    def lines_to_json(text: str) -> str:
        return json.dumps([ln.strip() for ln in (text or "").splitlines() if ln.strip()])

    solution = Solution(
        error_code=payload.error_code.strip(),
        title=payload.title.strip(),
        summary=payload.summary.strip(),
        severity=payload.severity,
        equipment=payload.equipment.strip(),
        factory=None if payload.scope == "global" else current_user.factory_location,
        steps=lines_to_step_json(payload.steps),
        warnings=lines_to_json(payload.warnings),
        tools=lines_to_json(payload.tools),
        confidence=max(0, min(100, payload.confidence)),
        estimated_time=payload.estimated_time.strip(),
        author=current_user.name,
        author_role=ROLE_LABELS.get(current_user.role, str(current_user.role)),
    )
    session.add(solution)
    session.commit()
    session.refresh(solution)
    return {"status": "success", "data": _solution_dict(solution)}


@router.post("/solutions/{solution_id}/apply")
async def apply_solution(
    solution_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Operator feedback: solution was applied successfully (increments uses)."""
    solution = session.get(Solution, solution_id)
    if not solution:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solution not found")
    solution.uses += 1
    session.add(solution)
    session.commit()
    session.refresh(solution)
    return {"status": "success", "data": {"uses": solution.uses}}

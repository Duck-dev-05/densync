from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from database import get_session
from models import User, UserRole
from auth import get_current_user, require_system_admin, require_expert_or_admin

# Mounted under /api so it matches every other router (src/lib/api.ts uses
# "http://localhost:8000/api" as its base, so "/users/me" resolves to /api/users/me).
router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)) -> User:
    """Get current user information."""
    return current_user

@router.get("/")
async def get_all_users(
    session: Session = Depends(get_session),
    current_user: User = Depends(require_system_admin)
) -> List[User]:
    """Get all users (System Admin only)."""
    users = session.exec(select(User)).all()
    return users

@router.get("/factory/{factory_location}")
async def get_users_by_factory(
    factory_location: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_expert_or_admin)
) -> List[User]:
    """Get users by factory location (Expert or Admin only)."""
    users = session.exec(select(User).where(User.factory_location == factory_location)).all()
    return users

@router.get("/operators")
async def get_factory_operators(
    session: Session = Depends(get_session),
    current_user: User = Depends(require_expert_or_admin)
) -> List[User]:
    """Get all factory operators (Expert or Admin only)."""
    users = session.exec(select(User).where(User.role == UserRole.FACTORY_OPERATOR)).all()
    return users

@router.get("/experts")
async def get_factory_experts(
    session: Session = Depends(get_session),
    current_user: User = Depends(require_system_admin)
) -> List[User]:
    """Get all factory experts (System Admin only)."""
    users = session.exec(select(User).where(User.role == UserRole.FACTORY_EXPERT)).all()
    return users

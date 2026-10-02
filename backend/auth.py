from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from database import get_session
from models import User, UserRole

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
) -> User:
    """Get the current authenticated user from the token."""
    token = credentials.credentials
    
    # For simplicity, using user_id as token (in production, use JWT)
    user = session.exec(select(User).where(User.user_id == token)).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    return user

def require_role(*allowed_roles: UserRole):
    """Dependency factory to require specific user roles."""
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role: {', '.join([r.value for r in allowed_roles])}"
            )
        return current_user
    return role_checker

def require_factory_operator(current_user: User = Depends(get_current_user)) -> User:
    """Require Factory Operator role."""
    if current_user.role != UserRole.FACTORY_OPERATOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Factory Operator role required"
        )
    return current_user

def require_factory_expert(current_user: User = Depends(get_current_user)) -> User:
    """Require Factory Expert role."""
    if current_user.role != UserRole.FACTORY_EXPERT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Factory Expert role required"
        )
    return current_user

def require_system_admin(current_user: User = Depends(get_current_user)) -> User:
    """Require System Administrator role."""
    if current_user.role != UserRole.SYSTEM_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. System Administrator role required"
        )
    return current_user

def require_expert_or_admin(current_user: User = Depends(get_current_user)) -> User:
    """Require Factory Expert or System Administrator role."""
    if current_user.role not in [UserRole.FACTORY_EXPERT, UserRole.SYSTEM_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Expert or Administrator role required"
        )
    return current_user

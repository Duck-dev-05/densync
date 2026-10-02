from typing import Optional, List
from sqlmodel import Field, SQLModel
from datetime import datetime
from enum import Enum
from pydantic import NaiveDatetime

# NOTE: SQLModel maps a bare `datetime` annotation to a timezone-aware UTC column
# (UTCDateTime) and rejects the naive `datetime.utcnow()` values used below.
# `NaiveDatetime` maps to a naive DateTime column, matching how these timestamps
# are stored, serialized (isoformat without offset) and sorted.

class UserRole(str, Enum):
    FACTORY_OPERATOR = "factory_operator"
    FACTORY_EXPERT = "factory_expert"
    SYSTEM_ADMIN = "system_admin"

class IncidentReport(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    severity: str
    category: str
    factory_location: Optional[str] = None
    created_at: NaiveDatetime = Field(default_factory=datetime.utcnow)

class KnowledgeArticle(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    error_code: str
    title: str
    factory: str
    country: str
    author: str
    solved: bool = False
    category: str
    confidence: int
    steps_count: int
    views: int
    description: str
    tags: str # comma separated
    created_at: NaiveDatetime = Field(default_factory=datetime.utcnow)

class IoTDevice(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    device_id: str = Field(index=True, unique=True)
    name: str
    type: str
    factory: str
    status: str # "active", "warning", "offline"
    temperature: Optional[float] = None
    vibration: Optional[float] = None
    last_updated: NaiveDatetime = Field(default_factory=datetime.utcnow)

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, unique=True)
    name: str
    role: UserRole = Field(default=UserRole.FACTORY_OPERATOR)
    factory_location: str
    email: Optional[str] = None
    created_at: NaiveDatetime = Field(default_factory=datetime.utcnow)

class UserRanking(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, unique=True)
    name: str
    role: str
    location: str
    score: int = 0
    rank: int = 0
    level: str

class AiFeedbackQueue(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    task_id: str = Field(index=True, unique=True)
    image_src: str
    prediction: str
    confidence: int
    date_str: str
    status: str = "pending" # pending, approved, rejected

class Solution(SQLModel, table=True):
    """A verified fix for a known error code, optionally scoped to one factory."""
    id: Optional[int] = Field(default=None, primary_key=True)
    error_code: str = Field(index=True)
    title: str
    summary: str = ""
    severity: str = "medium"
    equipment: str = ""
    factory: Optional[str] = None  # None -> available to every factory
    steps: str = ""       # JSON array of {"title": ..., "detail": ...}
    warnings: str = ""    # JSON array of strings
    tools: str = ""       # JSON array of strings
    confidence: int = 85
    estimated_time: str = ""
    author: str = ""
    author_role: str = ""
    uses: int = 0
    rating: float = 4.5
    created_at: NaiveDatetime = Field(default_factory=datetime.utcnow)

class SolutionCreate(SQLModel):
    """Request body for experts creating a solution."""
    error_code: str
    title: str
    summary: str = ""
    steps: str = ""        # free text, one step per line
    warnings: str = ""     # free text, one warning per line
    tools: str = ""        # free text, one tool per line
    confidence: int = 80
    severity: str = "medium"
    equipment: str = ""
    estimated_time: str = ""
    scope: str = "factory"  # "factory" = creator's factory only, "global" = every factory

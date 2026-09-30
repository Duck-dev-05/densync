from typing import Optional, List
from sqlmodel import Field, SQLModel
from datetime import datetime

class IncidentReport(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    severity: str
    category: str
    factory_location: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

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
    created_at: datetime = Field(default_factory=datetime.utcnow)

class IoTDevice(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    device_id: str = Field(index=True, unique=True)
    name: str
    type: str
    factory: str
    status: str # "active", "warning", "offline"
    temperature: Optional[float] = None
    vibration: Optional[float] = None
    last_updated: datetime = Field(default_factory=datetime.utcnow)

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

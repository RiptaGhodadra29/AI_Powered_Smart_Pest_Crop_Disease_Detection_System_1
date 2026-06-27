from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class PredictionRequest(BaseModel):
    user_id: int
    image_id: int


class RecommendationResponse(BaseModel):
    disease_name: str
    severity: str
    description: str
    treatment: str
    organic_treatment: str
    chemical_treatment: str
    preventive_measures: str
    monitoring_actions: str


class PredictionResponse(BaseModel):
    prediction_id: int
    class_name: str
    confidence: float
    confidence_level: str
    model_name: str
    recommendation: RecommendationResponse


class PredictionHistoryItem(BaseModel):
    prediction_id: int
    class_name: str
    confidence: float
    model_name: str
    prediction_type: str
    created_at: datetime


class PredictionHistoryResponse(BaseModel):
    history: List[PredictionHistoryItem]


# Tolerant recommendation schema for the detail view: every field is optional
# because pest predictions and partial records may not populate all columns.
class RecommendationDetail(BaseModel):
    disease_name: Optional[str] = None
    severity: Optional[str] = None
    description: Optional[str] = None
    treatment: Optional[str] = None
    organic_treatment: Optional[str] = None
    chemical_treatment: Optional[str] = None
    preventive_measures: Optional[str] = None
    monitoring_actions: Optional[str] = None

    class Config:
        from_attributes = True


class PredictionDetailResponse(BaseModel):
    prediction_id: int
    class_name: str
    confidence: float
    model_name: str
    prediction_type: str
    created_at: datetime
    recommendation: Optional[RecommendationDetail] = None

    class Config:
        from_attributes = True


class DeleteResponse(BaseModel):
    deleted: bool
    prediction_id: int
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from backend.app.database.session import get_db

from backend.app.services.history_service import (
    get_user_history,
    get_prediction_detail,
    delete_prediction,
)

from backend.app.schemas.prediction_schema import (
    PredictionHistoryResponse,
    PredictionDetailResponse,
    DeleteResponse,
)

router = APIRouter()


# NOTE: the two-segment "/detail/{id}" path is declared before "/{user_id}"
# for clarity; they never collide since they have different segment counts.
@router.get(
    "/detail/{prediction_id}",
    response_model=PredictionDetailResponse
)
def history_detail_api(
    prediction_id: int,
    db: Session = Depends(get_db)
):

    prediction = get_prediction_detail(
        db,
        prediction_id
    )

    if not prediction:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

    return {
        "prediction_id": prediction.id,
        "class_name": prediction.class_name,
        "confidence": prediction.confidence,
        "model_name": prediction.model_name,
        "prediction_type": prediction.prediction_type,
        "created_at": prediction.created_at,
        "recommendation": prediction.recommendation,
    }


@router.delete(
    "/{prediction_id}",
    response_model=DeleteResponse
)
def delete_history_api(
    prediction_id: int,
    db: Session = Depends(get_db)
):

    deleted = delete_prediction(
        db,
        prediction_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

    return {
        "deleted": True,
        "prediction_id": prediction_id,
    }


@router.get(
    "/{user_id}",
    response_model=PredictionHistoryResponse
)
def history_api(
    user_id: int,
    db: Session = Depends(get_db)
):

    predictions = get_user_history(
        db,
        user_id
    )

    history = []

    for prediction in predictions:

        history.append(
    {
        "prediction_id": prediction.id,
        "class_name": prediction.class_name,
        "confidence": prediction.confidence,
        "model_name": prediction.model_name,
        "prediction_type": prediction.prediction_type,
        "created_at": prediction.created_at
    }
)

    return {
        "history": history
    }

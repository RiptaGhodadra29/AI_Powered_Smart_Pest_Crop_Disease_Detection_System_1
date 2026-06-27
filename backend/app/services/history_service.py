from backend.app.models.prediction import Prediction
from backend.app.models.recommendation import Recommendation


def get_user_history(
    db,
    user_id
):
    return (
        db.query(Prediction)
        .filter(
            Prediction.user_id == user_id
        )
        .order_by(Prediction.created_at.desc())
        .all()
    )


def get_prediction_detail(
    db,
    prediction_id
):
    return (
        db.query(Prediction)
        .filter(
            Prediction.id == prediction_id
        )
        .first()
    )


def delete_prediction(
    db,
    prediction_id
):
    prediction = (
        db.query(Prediction)
        .filter(
            Prediction.id == prediction_id
        )
        .first()
    )

    if not prediction:
        return False

    # Remove the linked recommendation first to satisfy the FK constraint.
    db.query(Recommendation).filter(
        Recommendation.prediction_id == prediction_id
    ).delete()

    db.delete(prediction)
    db.commit()

    return True

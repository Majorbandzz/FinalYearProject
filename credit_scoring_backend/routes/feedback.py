from flask import Blueprint, request, jsonify, session
from models import db, Payment, User
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/', methods=['POST'])
def generate_feedback():
    user_id = session.get('user_id')
    
    if not user_id:
        return jsonify({'message': 'Unauthorized'}), 401

    data = request.get_json()
    income = data.get('income')
    total_spending = data.get('total_spending')
    payments = data.get('payments', [])

    feedback = []

    try:
        for p in payments:
            payment = Payment(
                user_id=user_id,
                name=p['name'],
                amount=p['amount'],
                missed=p.get('missed', False),
                on_time=p.get('onTime', False)
            )
            db.session.add(payment)

        db.session.commit()

        missed = [p for p in payments if p.get('missed')]
        on_time = [p for p in payments if p.get('onTime')]

        if missed:
            feedback.append(f"You missed {len(missed)} payments. Try setting up direct debits for {missed[0]['name']}.")
        if on_time:
            feedback.append(f"You made {len(on_time)} payments on time. Great job staying consistent!")
        if total_spending > income * 0.5:
            feedback.append("Your monthly spending exceeds 50% of your income. Consider budgeting to improve your creditworthiness.")
        if not missed and not on_time:
            feedback.append("No payment status marked. Mark payments as 'missed' or 'on time' to receive targeted advice.")

        return jsonify({'feedback': feedback})

    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Database error: {str(e)}")
        return jsonify({'error': 'Failed to save payments or generate feedback'}), 500
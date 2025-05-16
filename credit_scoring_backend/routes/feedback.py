from flask import Blueprint, request, jsonify
from models import db, User, Payment

feedback_bp = Blueprint('feedback', __name__)


@feedback_bp.route('/feedback', methods=['POST'])
def feedback():
    data = request.get_json()

    user_id = data.get('user_id')
    income = data.get('income')
    total_spending = data.get('total_spending')
    payments = data.get('payments', [])

    if not user_id or income is None or total_spending is None:
        return jsonify({'message': 'Missing required fields'}), 400

    for p in payments:
        name = p.get('name')
        amount = p.get('amount')
        missed = p.get('missed', False)
        on_time = p.get('onTime', False)

        if name and amount is not None:
            new_payment = Payment(
                user_id=user_id,
                name=name,
                amount=amount,
                missed=missed,
                on_time=on_time
            )
            db.session.add(new_payment)

    db.session.commit()

    missed_payments = [p for p in payments if p.get('missed')]
    on_time_payments = [p for p in payments if p.get('onTime')]
    payments_made = payments

    feedback = []

    if missed_payments and sum(p['amount'] for p in missed_payments if 'amount' in p) > 0:
        feedback.append("Try to reduce missed payments. They lower your score.")

    if total_spending > income * 0.4:
        feedback.append("Your monthly spending is more than 40% of your income. Try to lower it.")

    if payments_made:
        avg_payment = sum(p['amount'] for p in payments_made if 'amount' in p) / len(payments_made)
        if avg_payment > 100:
            feedback.append("You're making large payments. Consider using a debit card for small purchases to avoid interest.")

    if len(on_time_payments) < len(payments_made):
        feedback.append("Increase the number of on-time payments to build a better score.")

    if not feedback:
        feedback.append("You're on the right track! Keep up your consistent payment behavior.")

    return jsonify({'feedback': feedback}), 200


@feedback_bp.route('/payments/<int:user_id>', methods=['GET'])
def get_payments(user_id):
    payments = Payment.query.filter_by(user_id=user_id).order_by(Payment.timestamp.desc()).all()
    result = [
        {
            'name': p.name,
            'amount': p.amount,
            'missed': p.missed,
            'on_time': p.on_time,
            'timestamp': p.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }
        for p in payments
    ]
    return jsonify({'payments': result}), 200

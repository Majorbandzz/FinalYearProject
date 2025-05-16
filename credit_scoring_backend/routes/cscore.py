from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, UserCreditData, User
from calculations.credit_scoring import calculate_credit_score

cscore_bp = Blueprint('cscore', __name__)

@cscore_bp.route('/submit', methods=['POST'])
def create_credit_score():
    data = request.get_json()
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({'message': 'Missing user_id'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    required_fields = [
        'total_payments', 'missed_payments', 'total_credit_limit',
        'credit_used', 'credit_history_length', 'credit_accounts'
    ]

    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Missing required credit data fields'}), 400

    if int(data['missed_payments']) > int(data['total_payments']):
        return jsonify({'message': 'Missed payments cannot exceed total payments'}), 400

    score_input = {
        'total_payments': int(data['total_payments']),
        'missed_payments': int(data['missed_payments']),
        'total_credit_limit': float(data['total_credit_limit']),
        'credit_used': float(data['credit_used']),
        'credit_history_length': int(data['credit_history_length']),
        'credit_accounts': int(data['credit_accounts']),
    }

    existing_credit_data = UserCreditData.query.filter_by(user_id=user_id).first()
    if existing_credit_data:
        for field, value in score_input.items():
            setattr(existing_credit_data, field, value)
    else:
        new_credit_data = UserCreditData(user_id=user_id, **score_input)
        db.session.add(new_credit_data)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error saving credit data: {str(e)}'}), 500

    score = calculate_credit_score(user_id)
    user.credit_score = score

    try:
        db.session.commit()
        return jsonify({'message': 'Credit score updated successfully', 'credit_score': score}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error updating user score: {str(e)}'}), 500

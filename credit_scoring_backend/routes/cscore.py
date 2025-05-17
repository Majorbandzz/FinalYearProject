from flask import Blueprint, request, jsonify, session
from models import db, UserCreditData, User
from calculations.credit_scoring import calculate_credit_score
import traceback

cscore_bp = Blueprint('cscore', __name__)

@cscore_bp.route('/submit', methods=['POST'])
def create_credit_score():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'message': 'User not logged in'}), 401

        data = request.get_json()
        print(f"[DEBUG] Received data: {data}")

        required_fields = [
            'total_payments', 'missed_payments', 'total_credit_limit',
            'credit_used', 'credit_history_length', 'credit_accounts'
        ]

        if not all(field in data for field in required_fields):
            return jsonify({'message': 'Missing required fields'}), 400

        score_input = {
            'total_payments': int(data['total_payments']),
            'missed_payments': int(data['missed_payments']),
            'total_credit_limit': float(data['total_credit_limit']),
            'credit_used': float(data['credit_used']),
            'credit_history_length': int(data['credit_history_length']),
            'credit_accounts': int(data['credit_accounts']),
        }

        credit_data = UserCreditData.query.filter_by(user_id=user_id).first()

        if credit_data:
            for field, value in score_input.items():
                setattr(credit_data, field, value)
        else:
            credit_data = UserCreditData(user_id=user_id, **score_input)
            db.session.add(credit_data)

        db.session.commit()
        print(f"[DEBUG] Credit data saved successfully for user {user_id}")

        score = calculate_credit_score(user_id)
        if score is None:
            return jsonify({'message': 'Failed to calculate credit score'}), 500

        user = User.query.get(user_id)
        if user:
            user.credit_score = score
            db.session.commit()
            print(f"[DEBUG] Credit score {score} saved for user {user_id}")
        else:
            print(f"[ERROR] User {user_id} not found when saving credit score")

        return jsonify({
            'message': 'Credit score updated successfully',
            'credit_score': score
        }), 200

    except ValueError as e:
        print(f"[ERROR] Invalid data format: {str(e)}")
        return jsonify({'message': 'Invalid data format'}), 400

    except Exception as e:
        print(f"[ERROR] Unexpected error: {str(e)}")
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'message': 'Failed to submit credit data'}), 500

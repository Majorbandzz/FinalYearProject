from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, UserCreditData, User
from calculations.credit_scoring import calculate_credit_score

cscore_bp = Blueprint('cscore', __name__)

@cscore_bp.route('/', methods=['POST'])
@jwt_required()  # Use JWT for authentication
def create_credit_score():
    # Get user ID from JWT token instead of g.user
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    data = request.get_json()
    required_fields = [
        'on_time_payments', 'missed_payments', 'total_credit_limit', 
        'credit_used', 'credit_history_length', 'credit_accounts', 'recent_inquiries'
    ]
        
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400
    
    score_input = {
        'on_time_payments': int(data['on_time_payments']),
        'missed_payments': int(data['missed_payments']),
        'total_credit_limit': float(data['total_credit_limit']),
        'credit_used': float(data['credit_used']),
        'credit_history_length': int(data['credit_history_length']),
        'credit_accounts': int(data['credit_accounts']),
        'recent_inquiries': int(data['recent_inquiries'])
    }
    
    score = calculate_credit_score(score_input)
    
    #This helps JWT to find the existing credit data
    existing_credit_data = UserCreditData.query.filter_by(user_id=user_id).first()
    
    if existing_credit_data:
        existing_credit_data.on_time_payments = int(data['on_time_payments'])
        existing_credit_data.missed_payments = int(data['missed_payments'])
        existing_credit_data.total_credit_limit = float(data['total_credit_limit'])
        existing_credit_data.credit_used = float(data['credit_used'])
        existing_credit_data.credit_history_length = int(data['credit_history_length'])
        existing_credit_data.credit_accounts = int(data['credit_accounts'])
        existing_credit_data.recent_inquiries = int(data['recent_inquiries'])
    else:
        new_credit_data = UserCreditData(
            user_id=user_id, 
            on_time_payments=int(data['on_time_payments']),
            missed_payments=int(data['missed_payments']),
            total_credit_limit=float(data['total_credit_limit']),
            credit_used=float(data['credit_used']),
            credit_history_length=int(data['credit_history_length']),
            credit_accounts=int(data['credit_accounts']),
            recent_inquiries=int(data['recent_inquiries'])
        )
        db.session.add(new_credit_data)
    
    #After the score is recieved this will update the users credit score
    user.credit_score = score
    
    try:
        db.session.commit()
        return jsonify({'message': 'Credit score updated successfully', 'score': score}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error updating credit score: {str(e)}'}), 500
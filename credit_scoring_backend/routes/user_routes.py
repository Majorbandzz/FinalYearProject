from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User

user_blueprint = Blueprint("user_blueprint", __name__)

@user_blueprint.route("/test", methods=["GET"])
def test():
    return {"message": "The user route works smoothly!"}

@user_blueprint.route('/me', methods=['GET'])
@jwt_required()
def get_user_profile():
    user_id = get_jwt_identity()
    user = User.query.filter_by(user_id=user_id).first()
    
    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({
        'name': user.name,
        'email': user.email,
        'phone_number': user.phone_number,
        'date_of_birth': user.date_of_birth.isoformat() if user.date_of_birth else None,
        'address': user.address,
        'credit_score': user.credit_score or 0
    }), 200

@user_blueprint.route('/me', methods=['OPTIONS'])
def options_user_profile():
    response = jsonify({'status': 'success'})
    response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response


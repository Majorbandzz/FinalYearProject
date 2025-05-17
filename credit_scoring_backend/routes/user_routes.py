from flask import Blueprint, jsonify, session
from models import User

user_blueprint = Blueprint("user_blueprint", __name__)

@user_blueprint.route("/test", methods=["GET"])
def test():
    return {"message": "The user route works smoothly!"}

@user_blueprint.route('/me', methods=['GET'])
def get_user_profile():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({'message': 'User not logged in'}), 401

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

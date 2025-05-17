from flask import Blueprint, request, jsonify, session
from models import db, User
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()
auth_blueprint = Blueprint('auth_blueprint', __name__)

@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "User already exists!"}), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    new_user = User(
        name=data['name'],
        email=data['email'],
        date_of_birth=data['date_of_birth'],
        address=data['address'],
        password_hash=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully!"}), 201

@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({"message": "Invalid credentials!"}), 401

    session['user_id'] = user.user_id
    return jsonify({
        'message': 'Login successful!',
        'user': {
            'user_id': user.user_id,
            'name': user.name,
            'email': user.email,
            'credit_score': user.credit_score or 0
        }
    }), 200

@auth_blueprint.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logged out"})


@auth_blueprint.route('/user', methods=['GET'])
def get_current_user():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'message': 'Unauthorized'}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    print(f"Retrieved user data for ID {user_id}: Name - {user.name}, Credit Score - {user.credit_score}")  # Log user data

    return jsonify({
        'user': {
            'name': user.name,
            'email': user.email,
            'credit_score': user.credit_score or 0,
        }
    }), 200


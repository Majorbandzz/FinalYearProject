from flask import Blueprint, request, jsonify
from models import db, User
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt()
from flask_jwt_extended import create_access_token

auth_blueprint = Blueprint('auth_blueprint', __name__)

@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print("Received data:", data) 
    
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"message": "User already exists!"}), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    new_user = User(
        name=data['name'],
        email=data['email'],
        phone_number=data.get('phone_number', ''),
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

    access_token = create_access_token(identity=user.user_id)

    return jsonify({
    'access_token': access_token,
    'user': {
        'name': user.name,
        'email': user.email,
        'credit_score': user.credit_score or 0
    }
}), 200


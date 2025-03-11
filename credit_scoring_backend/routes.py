from flask import Blueprint, request, jsonify
from models import db, User, UserCreditData  
from calculations.credit_scoring import calculate_credit_score  

user_blueprint = Blueprint('user_blueprint', __name__)

@user_blueprint.route('', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        new_user = User(
            name=data['name'],
            email=data['email'],
            phone_number=data.get('phone_number', ''),
            date_of_birth=data['date_of_birth'],
            address=data['address']
        )

        db.session.add(new_user)
        db.session.commit()  

        new_credit_data = UserCreditData(
            user_id=new_user.user_id, 
            on_time_payments=0,
            missed_payments=0,
            total_credit_limit=1000,  
            credit_used=0,
            credit_history_length=0,
            credit_accounts=1,
            recent_inquiries=0
        )

        db.session.add(new_credit_data)
        db.session.commit()

        credit_score = calculate_credit_score(new_user.user_id)

        return jsonify({
            "message": "Your account was created successfully!",
            "credit_score": credit_score
        }), 201

    except Exception as e:
        db.session.rollback() 
        return jsonify({"error": str(e)}), 400


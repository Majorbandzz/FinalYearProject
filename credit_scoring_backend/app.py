from flask import Flask, request, jsonify, session
from flask_cors import CORS
from datetime import datetime
from models import db, bcrypt, User, UserCreditData
from calculations.credit_scoring import calculate_credit_score
import os
import traceback

app = Flask(__name__)
app.secret_key = os.environ.get("JWT_SECRET_KEY", "default_secret")

CORS(app, supports_credentials=True, origins=["http://localhost:3000"],
     allow_headers=['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie'])

@app.before_request
def handle_preflight():
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Cookie',
            'Access-Control-Allow-Credentials': 'true'
        }
        return '', 204, headers


app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:hotdog123@localhost/credit_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
bcrypt.init_app(app)


@app.route("/auth/register", methods=["POST"])
def register():
    try:
        data = request.json
        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()
        dob = data.get("date_of_birth", "").strip() or data.get("dob", "").strip()
        address = data.get("address", "").strip()

        if not all([name, email, password, dob, address]):
            return jsonify({"message": "All fields are required"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"message": "Email already registered"}), 400

        user = User(name=name, email=email, address=address, date_of_birth=datetime.strptime(dob, '%Y-%m-%d'))
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        return jsonify({"message": "User registered"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Registration failed", "error": str(e)}), 500

@app.route("/auth/login", methods=["POST"])
def login():
    try:
        data = request.json
        user = User.query.filter_by(email=data["email"]).first()
        if user and user.check_password(data["password"]):
            session["user_id"] = user.user_id
            return jsonify({"message": "Login successful"})
        return jsonify({"message": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@app.route("/auth/logout", methods=["POST"])
def logout():
    session.pop("user_id", None)
    return jsonify({"message": "Logged out"})

@app.route("/auth/user", methods=["GET"])
def get_user():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"message": "Not logged in"}), 401
    user = User.query.get(user_id)
    return jsonify({
        "user": {
            "user_id": user.user_id,
            "name": user.name,
            "email": user.email,
            "credit_score": user.credit_score
        }
    })

@app.route("/cscore/submit", methods=["POST"])
def submit_credit_data():
    try:
        data = request.json
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({"message": "Not logged in"}), 401

        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404

        
        total_payments = int(data.get("total_payments", 0))
        missed_payments = int(data.get("missed_payments", 0))
        total_credit_limit = float(data.get("total_credit_limit", 0))
        credit_used = float(data.get("credit_used", 0))
        credit_history_length = int(data.get("credit_history_length", 0))
        credit_accounts = int(data.get("credit_accounts", 0))

       
        credit_data = UserCreditData.query.filter_by(user_id=user_id).first()
        if not credit_data:
            credit_data = UserCreditData(
                user_id=user_id,
                total_payments=total_payments,
                missed_payments=missed_payments,
                total_credit_limit=total_credit_limit,
                credit_used=credit_used,
                credit_history_length=credit_history_length,
                credit_accounts=credit_accounts
            )
            db.session.add(credit_data)
        else:
            credit_data.total_payments = total_payments
            credit_data.missed_payments = missed_payments
            credit_data.total_credit_limit = total_credit_limit
            credit_data.credit_used = credit_used
            credit_data.credit_history_length = credit_history_length
            credit_data.credit_accounts = credit_accounts

        db.session.commit()

     
        with app.app_context():
            calculate_credit_score(user_id, credit_data)

        return jsonify({"message": "Credit data submitted successfully"})

    except Exception as e:
        print("Error in credit data submission:", str(e))
        traceback.print_exc()
        db.session.rollback()
        return jsonify({"message": "Failed to submit credit data", "error": str(e)}), 500


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)

from flask import Flask, request, jsonify, session
from flask_cors import CORS
from datetime import datetime
from models import db, bcrypt, User, UserCreditData
from calculations.credit_scoring import calculate_credit_score
from routes.auth_routes import auth_blueprint
from routes.user_routes import user_blueprint
from routes.cscore import cscore_bp
from routes.feedback import feedback_bp
import os
import traceback

app = Flask(__name__)
app.secret_key = os.environ.get("JWT_SECRET_KEY", "default_secret")


app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/credit_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

bcrypt.init_app(app)

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

app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True  
app.config['PERMANENT_SESSION_LIFETIME'] = 86400
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:hotdog123@localhost/credit_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
bcrypt.init_app(app)

app.register_blueprint(auth_blueprint, url_prefix="/auth")
app.register_blueprint(user_blueprint, url_prefix="/user")
app.register_blueprint(cscore_bp, url_prefix="/cscore")
app.register_blueprint(feedback_bp, url_prefix="/feedback")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS

from models import db, bcrypt
from routes.auth_routes import auth_blueprint
from routes import user_blueprint
from routes import cscore_bp
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)


from flask_cors import CORS

CORS(app, 
     origins=["http://localhost:3000"],
     allow_headers=["Content-Type", "Authorization"],
     supports_credentials=True,
     methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"])

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:hotdog123@localhost/credit_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")

db.init_app(app)
bcrypt.init_app(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

app.register_blueprint(user_blueprint, url_prefix='/users')
app.register_blueprint(auth_blueprint, url_prefix='/auth')
app.register_blueprint(cscore_bp, url_prefix='/cscore')

if __name__ == "__main__":
    app.run(debug=True)

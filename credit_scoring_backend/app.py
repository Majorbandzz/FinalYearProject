from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from models import db, bcrypt
from routes.auth_routes import auth_blueprint  
from routes import user_blueprint
from flask_migrate import Migrate

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to The Synergy Credit Scoring Tool!"



app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:hotdog123@localhost/credit_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['JWT_SECRET_KEY'] = ''

db.init_app(app)
bcrypt.init_app(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

app.register_blueprint(user_blueprint, url_prefix='/users')
app.register_blueprint(auth_blueprint, url_prefix='/auth') 

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)

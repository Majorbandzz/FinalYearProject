from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt 
from models import db, bcrypt  
from routes import user_blueprint

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to The Synergy Credit Scoring Tool!"


app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:hotdog123@localhost/credit_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
bcrypt.init_app(app)  

app.register_blueprint(user_blueprint, url_prefix='/users')

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)

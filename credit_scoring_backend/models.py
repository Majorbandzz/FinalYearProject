from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()  

class User(db.Model):
    __tablename__ = 'users'
    
    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)  
    phone_number = db.Column(db.String(20))
    date_of_birth = db.Column(db.Date, nullable=False)
    address = db.Column(db.String(255))
    credit_score = db.Column(db.Integer, default=300) 

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
       return bcrypt.check_password_hash(self.password_hash, password)


class UserCreditData(db.Model):
    __tablename__ = 'user_credit_data'

    credit_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False, unique=True)
    on_time_payments = db.Column(db.Integer, default=0)
    missed_payments = db.Column(db.Integer, default=0)
    total_credit_limit = db.Column(db.Float, default=1000.0) 
    credit_used = db.Column(db.Float, default=0.0)
    credit_history_length = db.Column(db.Integer, default=0)  
    credit_accounts = db.Column(db.Integer, default=1)  
    recent_inquiries = db.Column(db.Integer, default=0)

    user = db.relationship('User', backref=db.backref('credit_data', uselist=False, cascade="all, delete-orphan"))

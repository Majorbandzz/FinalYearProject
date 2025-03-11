class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:hotdog123@localhost/credit_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'Users'  
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone_number = db.Column(db.String(15), nullable=True)
    date_of_birth = db.Column(db.Date, nullable=False)
    address = db.Column(db.Text, nullable=True)

    def __repr__(self):
        return f'<User {self.name}>'

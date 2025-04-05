from ..app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20))
    role = db.Column(db.String(20), nullable=False)  # 'farmer', 'operator', 'admin'
    is_premium = db.Column(db.Boolean, default=False)
    latitude = db.Column(db.Float, nullable=True)  # Location data for operators
    longitude = db.Column(db.Float, nullable=True)  # Location data for operators
    is_available = db.Column(db.Boolean, default=True)  # Availability status for operators
    service_radius = db.Column(db.Float, default=50.0)  # Service radius in kilometers for operators
    hourly_rate = db.Column(db.Float, default=0.0)  # Hourly rate for operators
    service_details = db.Column(db.Text)  # Additional service details for operators
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    fields = db.relationship('Field', backref='owner', lazy=True)
    service_requests_farmer = db.relationship('ServiceRequest', 
                                            backref='farmer', 
                                            lazy=True,
                                            foreign_keys='ServiceRequest.farmer_id')
    service_requests_operator = db.relationship('ServiceRequest', 
                                              backref='operator', 
                                              lazy=True,
                                              foreign_keys='ServiceRequest.operator_id')
    
    def __init__(self, email, password, first_name, last_name, role, phone=None, latitude=None, longitude=None, service_radius=50.0, hourly_rate=0.0, service_details=None):
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.phone = phone
        self.role = role
        self.latitude = latitude
        self.longitude = longitude
        self.service_radius = service_radius if role == 'operator' else None
        self.hourly_rate = hourly_rate if role == 'operator' else None
        self.service_details = service_details if role == 'operator' else None
        self.set_password(password)  # Make sure to call set_password here
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'role': self.role,
            'is_premium': self.is_premium,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'is_available': self.is_available if self.role == 'operator' else None,
            'service_radius': self.service_radius if self.role == 'operator' else None,
            'hourly_rate': self.hourly_rate if self.role == 'operator' else None,
            'service_details': self.service_details if self.role == 'operator' else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<User {self.email}>'

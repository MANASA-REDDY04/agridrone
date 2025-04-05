from ..app import db
from datetime import datetime

class Field(db.Model):
    __tablename__ = 'fields'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    area = db.Column(db.Float)  # Area in hectares/acres
    coordinates = db.Column(db.Text, nullable=False)  # GeoJSON polygon as string
    crop_type = db.Column(db.String(50))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    service_requests = db.relationship('ServiceRequest', backref='field', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'area': self.area,
            'coordinates': self.coordinates,
            'crop_type': self.crop_type,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Field {self.name}>'

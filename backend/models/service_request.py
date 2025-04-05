from ..app import db
from datetime import datetime

class ServiceRequest(db.Model):
    __tablename__ = 'service_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    field_id = db.Column(db.Integer, db.ForeignKey('fields.id'), nullable=False)
    farmer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    operator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    service_type = db.Column(db.String(50), nullable=False)  # 'pesticide', 'fertilizer', etc.
    status = db.Column(db.String(20), default='pending')  # 'pending', 'accepted', 'completed', 'cancelled'
    scheduled_date = db.Column(db.Date, nullable=False)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'field_id': self.field_id,
            'farmer_id': self.farmer_id,
            'operator_id': self.operator_id,
            'service_type': self.service_type,
            'status': self.status,
            'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }
    
    def __repr__(self):
        return f'<ServiceRequest {self.id}>'

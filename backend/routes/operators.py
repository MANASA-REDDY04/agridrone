from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.user import User
from ..models.service_request import ServiceRequest
from ..app import db
from datetime import datetime

operators_bp = Blueprint('operators', __name__)

# Get available service requests
@operators_bp.route('/service-requests/available', methods=['GET'])
@jwt_required()
def get_available_requests():
    user_id = get_jwt_identity()
    # Convert string ID to integer for database query
    user = User.query.get(int(user_id))
    
    if not user or user.role != 'operator':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    # Get all pending service requests that don't have an operator assigned
    service_requests = ServiceRequest.query.filter_by(
        status='pending',
        operator_id=None
    ).all()
    
    return jsonify({
        'service_requests': [sr.to_dict() for sr in service_requests]
    }), 200

# Get operator's assigned service requests
@operators_bp.route('/service-requests', methods=['GET'])
@jwt_required()
def get_assigned_requests():
    user_id = get_jwt_identity()
    # Convert string ID to integer for database query
    user = User.query.get(int(user_id))
    
    if not user or user.role != 'operator':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    service_requests = ServiceRequest.query.filter_by(operator_id=int(user_id)).all()
    
    return jsonify({
        'service_requests': [sr.to_dict() for sr in service_requests]
    }), 200

# Accept a service request
@operators_bp.route('/service-requests/<int:request_id>/accept', methods=['POST'])
@jwt_required()
def accept_request(request_id):
    user_id = get_jwt_identity()
    # Convert string ID to integer for database query
    user = User.query.get(int(user_id))
    
    if not user or user.role != 'operator':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    service_request = ServiceRequest.query.filter_by(id=request_id, status='pending').first()
    
    if not service_request:
        return jsonify({'error': 'Service request not found or not available'}), 404
    
    service_request.operator_id = int(user_id)
    service_request.status = 'accepted'
    db.session.commit()
    
    return jsonify({
        'message': 'Service request accepted successfully',
        'service_request': service_request.to_dict()
    }), 200

# Mark a service request as completed
@operators_bp.route('/service-requests/<int:request_id>/complete', methods=['POST'])
@jwt_required()
def complete_request(request_id):
    user_id = get_jwt_identity()
    # Convert string ID to integer for database query
    user = User.query.get(int(user_id))
    
    if not user or user.role != 'operator':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    service_request = ServiceRequest.query.filter_by(
        id=request_id,
        operator_id=int(user_id),
        status='accepted'
    ).first()
    
    if not service_request:
        return jsonify({'error': 'Service request not found or not assigned to you'}), 404
    
    service_request.status = 'completed'
    service_request.completed_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({
        'message': 'Service request marked as completed',
        'service_request': service_request.to_dict()
    }), 200

# Get details of a specific service request
@operators_bp.route('/service-requests/<int:request_id>', methods=['GET'])
@jwt_required()
def get_service_request(request_id):
    user_id = get_jwt_identity()
    # Convert string ID to integer for database query
    user = User.query.get(int(user_id))
    
    if not user or user.role != 'operator':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    # Operators can view both their assigned requests and available requests
    service_request = ServiceRequest.query.filter(
        (ServiceRequest.id == request_id) & 
        ((ServiceRequest.operator_id == int(user_id)) | 
         (ServiceRequest.status == 'pending' and ServiceRequest.operator_id == None))
    ).first()
    
    if not service_request:
        return jsonify({'error': 'Service request not found or not accessible'}), 404
    
    # Get field details
    field = service_request.field
    
    return jsonify({
        'service_request': service_request.to_dict(),
        'field': field.to_dict()
    }), 200

# Update availability calendar (simplified version)
@operators_bp.route('/availability', methods=['POST'])
@jwt_required()
def update_availability():
    user_id = get_jwt_identity()
    # Convert string ID to integer for database query
    user = User.query.get(int(user_id))
    
    if not user or user.role != 'operator':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    # In a real application, this would store availability in a separate table
    # For this simplified version, we'll just return a success message
    
    return jsonify({
        'message': 'Availability updated successfully'
    }), 200

# Update operator's location and availability
@operators_bp.route('/update-location', methods=['POST'])
@jwt_required()
def update_location():
    user_id = get_jwt_identity()
    # Convert string ID to integer for database query
    user = User.query.get(int(user_id))
    
    if not user or user.role != 'operator':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    data = request.get_json()
    
    if 'latitude' in data and 'longitude' in data:
        user.latitude = data['latitude']
        user.longitude = data['longitude']
    
    if 'is_available' in data:
        user.is_available = data['is_available']
    
    if 'service_radius' in data:
        user.service_radius = data['service_radius']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Location and availability updated successfully',
        'user': user.to_dict()
    }), 200

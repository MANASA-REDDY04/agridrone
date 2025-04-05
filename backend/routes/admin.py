from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.user import User
from ..models.field import Field
from ..models.service_request import ServiceRequest
from ..app import db

admin_bp = Blueprint('admin', __name__)

# Admin authentication middleware
def admin_required(fn):
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        # Convert string ID to integer for database query
        user = User.query.get(int(user_id))
        
        if not user or user.role != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
        
        return fn(*args, **kwargs)
    
    wrapper.__name__ = fn.__name__
    return wrapper

# User management
@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@admin_required
def get_users():
    # Optional query parameters for filtering
    role = request.args.get('role')
    
    query = User.query
    
    if role:
        query = query.filter_by(role=role)
    
    users = query.all()
    
    return jsonify({
        'users': [user.to_dict() for user in users]
    }), 200

@admin_bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
@admin_required
def get_user(user_id):
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'user': user.to_dict()
    }), 200

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_user(user_id):
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    if 'first_name' in data:
        user.first_name = data['first_name']
    if 'last_name' in data:
        user.last_name = data['last_name']
    if 'phone' in data:
        user.phone = data['phone']
    if 'is_premium' in data:
        user.is_premium = data['is_premium']
    if 'role' in data:
        user.role = data['role']
    if 'password' in data:
        user.set_password(data['password'])
    
    db.session.commit()
    
    return jsonify({
        'message': 'User updated successfully',
        'user': user.to_dict()
    }), 200

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_user(user_id):
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({
        'message': 'User deleted successfully'
    }), 200

# Get all operators
@admin_bp.route('/operators', methods=['GET'])
@jwt_required()
@admin_required
def get_operators():
    operators = User.query.filter_by(role='operator').all()
    
    return jsonify({
        'operators': [operator.to_dict() for operator in operators]
    }), 200

# Service request management
@admin_bp.route('/service-requests', methods=['GET'])
@jwt_required()
@admin_required
def get_service_requests():
    # Optional query parameters for filtering
    status = request.args.get('status')
    
    query = ServiceRequest.query
    
    if status:
        query = query.filter_by(status=status)
    
    service_requests = query.all()
    
    return jsonify({
        'service_requests': [sr.to_dict() for sr in service_requests]
    }), 200

@admin_bp.route('/service-requests/<int:request_id>', methods=['GET'])
@jwt_required()
@admin_required
def get_service_request(request_id):
    service_request = ServiceRequest.query.get(request_id)
    
    if not service_request:
        return jsonify({'error': 'Service request not found'}), 404
    
    return jsonify({
        'service_request': service_request.to_dict()
    }), 200

@admin_bp.route('/service-requests/<int:request_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_service_request(request_id):
    service_request = ServiceRequest.query.get(request_id)
    
    if not service_request:
        return jsonify({'error': 'Service request not found'}), 404
    
    data = request.get_json()
    
    if 'status' in data:
        service_request.status = data['status']
    if 'operator_id' in data:
        service_request.operator_id = data['operator_id']
    if 'notes' in data:
        service_request.notes = data['notes']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Service request updated successfully',
        'service_request': service_request.to_dict()
    }), 200

# Dashboard statistics
@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
@admin_required
def get_stats():
    # Count users by role
    farmers_count = User.query.filter_by(role='farmer').count()
    operators_count = User.query.filter_by(role='operator').count()
    
    # Count service requests by status
    pending_count = ServiceRequest.query.filter_by(status='pending').count()
    accepted_count = ServiceRequest.query.filter_by(status='accepted').count()
    completed_count = ServiceRequest.query.filter_by(status='completed').count()
    cancelled_count = ServiceRequest.query.filter_by(status='cancelled').count()
    
    # Count fields
    fields_count = Field.query.count()
    
    return jsonify({
        'users': {
            'farmers': farmers_count,
            'operators': operators_count,
            'total': farmers_count + operators_count + User.query.filter_by(role='admin').count()
        },
        'service_requests': {
            'pending': pending_count,
            'accepted': accepted_count,
            'completed': completed_count,
            'cancelled': cancelled_count,
            'total': pending_count + accepted_count + completed_count + cancelled_count
        },
        'fields': fields_count
    }), 200

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..models.user import User
from ..app import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user already exists
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'error': 'Email already registered'}), 409
    
    # Create new user
    new_user = User(
        email=data.get('email'),
        password=data.get('password'),
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        phone=data.get('phone'),
        role=data.get('role')
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    # Create access token - convert ID to string to avoid JWT subject issues
    access_token = create_access_token(identity=str(new_user.id))
    
    return jsonify({
        'message': 'User registered successfully',
        'user': new_user.to_dict(),
        'access_token': access_token
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(email=data.get('email')).first()
    
    if not user or not user.check_password(data.get('password')):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Create access token - convert ID to string to avoid JWT subject issues
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict(),
        'access_token': access_token
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    # Convert string ID back to integer for database query
    user = User.query.get(int(user_id))
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'user': user.to_dict()
    }), 200

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    # Convert string ID back to integer for database query
    user = User.query.get(int(user_id))
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    # Update user fields
    if 'first_name' in data:
        user.first_name = data['first_name']
    if 'last_name' in data:
        user.last_name = data['last_name']
    if 'phone' in data:
        user.phone = data['phone']
    if 'password' in data:
        user.set_password(data['password'])
    
    # Update operator-specific fields
    if user.role == 'operator':
        if 'service_radius' in data:
            user.service_radius = data['service_radius']
        if 'latitude' in data:
            user.latitude = data['latitude']
        if 'longitude' in data:
            user.longitude = data['longitude']
        if 'hourly_rate' in data:
            user.hourly_rate = data['hourly_rate']
        if 'service_details' in data:
            user.service_details = data['service_details']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'user': user.to_dict()
    }), 200

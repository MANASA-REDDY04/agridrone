from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.user import User
from ..models.field import Field
from ..models.service_request import ServiceRequest
from ..app import db
from datetime import datetime

farmers_bp = Blueprint('farmers', __name__)

# Field management
@farmers_bp.route('/fields', methods=['GET'])
@jwt_required()
def get_fields():
    user_id = get_jwt_identity()
    # Convert string ID to integer for database query
    user = User.query.get(int(user_id))
    
    if not user or user.role != 'farmer':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    fields = Field.query.filter_by(user_id=int(user_id)).all()
    
    return jsonify({
        'fields': [field.to_dict() for field in fields]
    }), 200

@farmers_bp.route('/fields', methods=['POST'])
@jwt_required()
def create_field():
    user_id = get_jwt_identity()
    # Convert string ID to integer for database query
    user = User.query.get(int(user_id))
    
    if not user or user.role != 'farmer':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    data = request.get_json()
    
    new_field = Field(
        name=data.get('name'),
        description=data.get('description'),
        area=data.get('area'),
        coordinates=data.get('coordinates'),
        crop_type=data.get('crop_type'),
        user_id=int(user_id)
    )
    
    db.session.add(new_field)
    db.session.commit()
    
    return jsonify({
        'message': 'Field created successfully',
        'field': new_field.to_dict()
    }), 201

@farmers_bp.route('/fields/<int:field_id>', methods=['GET'])
@jwt_required()
def get_field(field_id):
    user_id = get_jwt_identity()
    # Convert string ID to integer for database query
    user = User.query.get(int(user_id))
    
    if not user or user.role != 'farmer':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    field = Field.query.filter_by(id=field_id, user_id=int(user_id)).first()
    
    if not field:
        return jsonify({'error': 'Field not found'}), 404
    
    return jsonify({
        'field': field.to_dict()
    }), 200

@farmers_bp.route('/fields/<int:field_id>', methods=['PUT'])
@jwt_required()
def update_field(field_id):
    user_id = get_jwt_identity()
    # Convert string ID to integer for database query
    user = User.query.get(int(user_id))
    
    if not user or user.role != 'farmer':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    field = Field.query.filter_by(id=field_id, user_id=int(user_id)).first()
    
    if not field:
        return jsonify({'error': 'Field not found'}), 404
    
    data = request.get_json()
    
    if 'name' in data:
        field.name = data['name']
    if 'description' in data:
        field.description = data['description']
    if 'area' in data:
        field.area = data['area']
    if 'coordinates' in data:
        field.coordinates = data['coordinates']
    if 'crop_type' in data:
        field.crop_type = data['crop_type']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Field updated successfully',
        'field': field.to_dict()
    }), 200

@farmers_bp.route('/fields/<int:field_id>', methods=['DELETE'])
@jwt_required()
def delete_field(field_id):
    user_id = get_jwt_identity()
    # Convert string ID to integer for database query
    user = User.query.get(int(user_id))
    
    if not user or user.role != 'farmer':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    field = Field.query.filter_by(id=field_id, user_id=int(user_id)).first()
    
    if not field:
        return jsonify({'error': 'Field not found'}), 404
    
    db.session.delete(field)
    db.session.commit()
    
    return jsonify({
        'message': 'Field deleted successfully'
    }), 200

# Service request management
@farmers_bp.route('/service-requests', methods=['GET'])
@jwt_required()
def get_service_requests():
    user_id = get_jwt_identity()
    # Convert string ID to integer for database query
    user = User.query.get(int(user_id))
    
    if not user or user.role != 'farmer':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    service_requests = ServiceRequest.query.filter_by(farmer_id=int(user_id)).all()
    
    return jsonify({
        'service_requests': [sr.to_dict() for sr in service_requests]
    }), 200

@farmers_bp.route('/service-requests', methods=['POST'])
@jwt_required()
def create_service_request():
    user_id = get_jwt_identity()
    # Convert string ID to integer for database query
    user = User.query.get(int(user_id))
    
    if not user or user.role != 'farmer':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    data = request.get_json()
    
    # Verify field belongs to farmer
    field = Field.query.filter_by(id=data.get('field_id'), user_id=int(user_id)).first()
    
    if not field:
        return jsonify({'error': 'Field not found or not owned by you'}), 404
    
    new_request = ServiceRequest(
        field_id=data.get('field_id'),
        farmer_id=int(user_id),
        service_type=data.get('service_type'),
        scheduled_date=datetime.strptime(data.get('scheduled_date'), '%Y-%m-%d').date(),
        notes=data.get('notes')
    )
    
    db.session.add(new_request)
    db.session.commit()
    
    return jsonify({
        'message': 'Service request created successfully',
        'service_request': new_request.to_dict()
    }), 201

@farmers_bp.route('/service-requests/<int:request_id>', methods=['GET'])
@jwt_required()
def get_service_request(request_id):
    user_id = get_jwt_identity()
    # Convert string ID to integer for database query
    user = User.query.get(int(user_id))
    
    if not user or user.role != 'farmer':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    service_request = ServiceRequest.query.filter_by(id=request_id, farmer_id=int(user_id)).first()
    
    if not service_request:
        return jsonify({'error': 'Service request not found'}), 404
    
    return jsonify({
        'service_request': service_request.to_dict()
    }), 200

@farmers_bp.route('/service-requests/<int:request_id>', methods=['PUT'])
@jwt_required()
def update_service_request(request_id):
    user_id = get_jwt_identity()
    # Convert string ID to integer for database query
    user = User.query.get(int(user_id))
    
    if not user or user.role != 'farmer':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    service_request = ServiceRequest.query.filter_by(id=request_id, farmer_id=int(user_id)).first()
    
    if not service_request:
        return jsonify({'error': 'Service request not found'}), 404
    
    # Can only update if status is pending
    if service_request.status != 'pending':
        return jsonify({'error': 'Cannot update a service request that has been accepted or completed'}), 400
    
    data = request.get_json()
    
    if 'field_id' in data:
        # Verify field belongs to farmer
        field = Field.query.filter_by(id=data['field_id'], user_id=int(user_id)).first()
        if not field:
            return jsonify({'error': 'Field not found or not owned by you'}), 404
        service_request.field_id = data['field_id']
        
    if 'service_type' in data:
        service_request.service_type = data['service_type']
    if 'scheduled_date' in data:
        service_request.scheduled_date = datetime.strptime(data['scheduled_date'], '%Y-%m-%d').date()
    if 'notes' in data:
        service_request.notes = data['notes']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Service request updated successfully',
        'service_request': service_request.to_dict()
    }), 200

@farmers_bp.route('/service-requests/<int:request_id>', methods=['DELETE'])
@jwt_required()
def cancel_service_request(request_id):
    user_id = get_jwt_identity()
    # Convert string ID to integer for database query
    user = User.query.get(int(user_id))
    
    if not user or user.role != 'farmer':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    service_request = ServiceRequest.query.filter_by(id=request_id, farmer_id=int(user_id)).first()
    
    if not service_request:
        return jsonify({'error': 'Service request not found'}), 404
    
    # Can only cancel if status is pending
    if service_request.status != 'pending':
        return jsonify({'error': 'Cannot cancel a service request that has been accepted or completed'}), 400
    
    service_request.status = 'cancelled'
    db.session.commit()
    
    return jsonify({
        'message': 'Service request cancelled successfully'
    }), 200

# Find nearby drone operators
@farmers_bp.route('/nearby-operators', methods=['GET'])
@jwt_required()
def find_nearby_operators():
    user_id = get_jwt_identity()
    # Convert string ID to integer for database query
    user = User.query.get(int(user_id))
    
    if not user or user.role != 'farmer':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    # Get query parameters
    lat = request.args.get('latitude', type=float)
    lng = request.args.get('longitude', type=float)
    radius = request.args.get('radius', default=50, type=float)  # Default 50km radius
    
    # If no coordinates provided, return error
    if lat is None or lng is None:
        return jsonify({'error': 'Latitude and longitude are required'}), 400
    
    # Find operators within the radius
    # Using a simplified distance calculation formula
    # In a production app, you would use proper geospatial queries
    # This is a simplified version using Euclidean distance
    operators = User.query.filter_by(role='operator', is_available=True).all()
    
    nearby_operators = []
    for operator in operators:
        if operator.latitude and operator.longitude:
            # Calculate approximate distance (simplified for demo)
            # In a real app, use proper haversine formula or PostGIS
            distance = ((operator.latitude - lat) ** 2 + 
                        (operator.longitude - lng) ** 2) ** 0.5 * 111  # Rough conversion to km
            
            if distance <= radius and distance <= operator.service_radius:
                operator_data = operator.to_dict()
                operator_data['distance'] = round(distance, 2)
                nearby_operators.append(operator_data)
    
    # Sort by distance
    nearby_operators.sort(key=lambda x: x['distance'])
    
    return jsonify({
        'operators': nearby_operators
    }), 200

# Get operator details by ID
@farmers_bp.route('/operators/<int:operator_id>', methods=['GET'])
@jwt_required()
def get_operator(operator_id):
    user_id = get_jwt_identity()
    # Convert string ID to integer for database query
    user = User.query.get(int(user_id))
    
    if not user or user.role != 'farmer':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    # Get the operator
    operator = User.query.filter_by(id=operator_id, role='operator').first()
    
    if not operator:
        return jsonify({'error': 'Operator not found'}), 404
    
    return jsonify({
        'operator': operator.to_dict()
    }), 200

# Update farmer's location
@farmers_bp.route('/update-location', methods=['POST'])
@jwt_required()
def update_location():
    user_id = get_jwt_identity()
    # Convert string ID to integer for database query
    user = User.query.get(int(user_id))
    
    if not user or user.role != 'farmer':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    data = request.get_json()
    
    if 'latitude' not in data or 'longitude' not in data:
        return jsonify({'error': 'Latitude and longitude are required'}), 400
    
    user.latitude = data['latitude']
    user.longitude = data['longitude']
    db.session.commit()
    
    return jsonify({
        'message': 'Location updated successfully',
        'user': user.to_dict()
    }), 200

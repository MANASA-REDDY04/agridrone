import os
import sys
import sqlite3

# Add the parent directory to the path so we can import from the backend package
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from backend.app import db
from backend.models.user import User
from backend.models.field import Field
from backend.models.service_request import ServiceRequest

def recreate_database():
    """Recreate the database from scratch with the current schema"""
    
    # Get the database path
    db_path = 'agridrone.db'
    
    # Remove the database if it exists
    if os.path.exists(db_path):
        print(f"Removing existing database at {db_path}")
        os.remove(db_path)
    
    # Create all tables
    print("Creating database tables...")
    db.create_all()
    
    # Create sample data
    print("Adding sample data...")
    
    # Admin user
    admin = User(
        email='admin@agridrone.com',
        password='admin123',
        first_name='Admin',
        last_name='User',
        role='admin'
    )
    db.session.add(admin)
    
    # Sample farmer
    farmer = User(
        email='farmer@example.com',
        password='farmer123',
        first_name='John',
        last_name='Farmer',
        phone='555-123-4567',
        role='farmer'
    )
    db.session.add(farmer)
    
    # Sample operators
    operators = [
        {
            'email': 'operator@example.com',
            'password': 'operator123',
            'first_name': 'Jane',
            'last_name': 'Operator',
            'phone': '555-987-6543',
            'role': 'operator',
            'latitude': 40.7128,
            'longitude': -74.0060,
            'service_radius': 50.0,
            'hourly_rate': 75.0,
            'service_details': 'Experienced drone operator specializing in pesticide spraying and field mapping. Using DJI Agras T30 drone with 30L spray tank.'
        },
        {
            'email': 'operator2@example.com',
            'password': 'operator123',
            'first_name': 'Bob',
            'last_name': 'Drone',
            'phone': '555-111-2222',
            'role': 'operator',
            'latitude': 40.7200,
            'longitude': -74.0100,
            'service_radius': 30.0,
            'hourly_rate': 65.0,
            'service_details': 'Specialized in precision agriculture with 5 years of experience. Using DJI Phantom 4 RTK for mapping and DJI Agras T10 for spraying.'
        },
        {
            'email': 'operator3@example.com',
            'password': 'operator123',
            'first_name': 'Sarah',
            'last_name': 'Flyer',
            'phone': '555-333-4444',
            'role': 'operator',
            'latitude': 40.7300,
            'longitude': -74.0200,
            'service_radius': 40.0,
            'hourly_rate': 85.0,
            'service_details': 'Certified drone pilot with agricultural background. Specializing in fertilizer application and crop monitoring.'
        }
    ]
    
    for op_data in operators:
        operator = User(
            email=op_data['email'],
            password=op_data['password'],
            first_name=op_data['first_name'],
            last_name=op_data['last_name'],
            phone=op_data['phone'],
            role=op_data['role'],
            latitude=op_data['latitude'],
            longitude=op_data['longitude'],
            service_radius=op_data['service_radius'],
            hourly_rate=op_data['hourly_rate'],
            service_details=op_data['service_details']
        )
        db.session.add(operator)
    
    # Sample fields for the farmer
    fields = [
        {
            'name': 'North Field',
            'description': 'Main corn field',
            'area': 25.5,
            'coordinates': '40.7128,-74.0060',
            'crop_type': 'Corn'
        },
        {
            'name': 'South Field',
            'description': 'Soybean field',
            'area': 18.2,
            'coordinates': '40.7100,-74.0050',
            'crop_type': 'Soybean'
        }
    ]
    
    for field_data in fields:
        field = Field(
            name=field_data['name'],
            description=field_data['description'],
            area=field_data['area'],
            coordinates=field_data['coordinates'],
            crop_type=field_data['crop_type'],
            user_id=farmer.id
        )
        db.session.add(field)
    
    # Commit all changes
    db.session.commit()
    
    print("Database recreated successfully!")

if __name__ == "__main__":
    recreate_database()

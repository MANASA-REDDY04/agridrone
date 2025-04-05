from ..app import db
from ..models.user import User

def init_db():
    """Initialize the database with some sample data"""
    # Create tables
    db.create_all()
    
    # Check if admin user exists
    admin = User.query.filter_by(email='admin@agridrone.com').first()
    if not admin:
        # Create admin user
        admin = User(
            email='admin@agridrone.com',
            password='admin123',  # The User model will hash this
            first_name='Admin',
            last_name='User',
            role='admin'
        )
        db.session.add(admin)
    
    # Add sample farmer
    farmer = User.query.filter_by(email='farmer@example.com').first()
    if not farmer:
        farmer = User(
            email='farmer@example.com',
            password='farmer123',
            first_name='John',
            last_name='Farmer',
            phone='555-123-4567',
            role='farmer'
        )
        db.session.add(farmer)
    
    # Add sample operator
    operator = User.query.filter_by(email='operator@example.com').first()
    if not operator:
        operator = User(
            email='operator@example.com',
            password='operator123',
            first_name='Jane',
            last_name='Operator',
            phone='555-987-6543',
            role='operator',
            latitude=40.7128,  # New York coordinates as example
            longitude=-74.0060,
            service_radius=50.0,
            hourly_rate=75.0,
            service_details='Experienced drone operator specializing in pesticide spraying and field mapping. Using DJI Agras T30 drone with 30L spray tank.'
        )
        db.session.add(operator)
    
    # Add a few more sample operators with different locations
    operators = [
        {
            'email': 'operator2@example.com',
            'password': 'operator123',
            'first_name': 'Bob',
            'last_name': 'Drone',
            'phone': '555-111-2222',
            'latitude': 40.7200,  # Slightly different coordinates
            'longitude': -74.0100,
            'service_radius': 30.0,
            'hourly_rate': 60.0,
            'service_details': 'Drone operator with experience in crop monitoring and soil analysis. Using DJI Phantom 4 RTK drone with 24MP camera.'
        },
        {
            'email': 'operator3@example.com',
            'password': 'operator123',
            'first_name': 'Sarah',
            'last_name': 'Flyer',
            'phone': '555-333-4444',
            'latitude': 40.7300,  # Another nearby location
            'longitude': -74.0200,
            'service_radius': 40.0,
            'hourly_rate': 80.0,
            'service_details': 'Certified drone pilot with expertise in aerial photography and videography. Using DJI Inspire 2 drone with Zenmuse X7 camera.'
        }
    ]
    
    for op_data in operators:
        if not User.query.filter_by(email=op_data['email']).first():
            new_operator = User(
                email=op_data['email'],
                password=op_data['password'],
                first_name=op_data['first_name'],
                last_name=op_data['last_name'],
                phone=op_data['phone'],
                role='operator',
                latitude=op_data['latitude'],
                longitude=op_data['longitude'],
                service_radius=op_data['service_radius'],
                hourly_rate=op_data['hourly_rate'],
                service_details=op_data['service_details']
            )
            db.session.add(new_operator)
    
    # Commit changes
    db.session.commit()
    
    print("Database initialized with sample data.")

if __name__ == '__main__':
    init_db()

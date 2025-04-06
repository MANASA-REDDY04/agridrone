from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///agridrone.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Configure CORS to allow requests from frontend
CORS(app, 
     resources={r"/*": {"origins": "*"}}, 
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Import routes
from .routes.auth import auth_bp
from .routes.farmers import farmers_bp
from .routes.operators import operators_bp
from .routes.admin import admin_bp
from .routes.weather import weather_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(farmers_bp, url_prefix='/api/farmers')
app.register_blueprint(operators_bp, url_prefix='/api/operators')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(weather_bp, url_prefix='/api/weather')

# Root route
# Root route
@app.route('/')
def index():
    return jsonify({
        'message': 'Welcome to Agridrone API',
        'status': 'online'
    })


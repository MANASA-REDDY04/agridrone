import requests
import json

BASE_URL = "http://localhost:8000"

def test_root_endpoint():
    """Test the root endpoint of the API"""
    response = requests.get(f"{BASE_URL}/")
    print(f"Root endpoint status: {response.status_code}")
    print(f"Response: {response.json()}")
    print("-" * 50)

def test_auth_login():
    """Test the authentication login endpoint"""
    url = f"{BASE_URL}/api/auth/login"
    data = {
        "email": "admin@agridrone.com",
        "password": "admin123"
    }
    headers = {"Content-Type": "application/json"}
    
    response = requests.post(url, data=json.dumps(data), headers=headers)
    print(f"Login endpoint status: {response.status_code}")
    print(f"Response: {response.text}")
    print("-" * 50)
    
    return response.json() if response.status_code == 200 else None

def test_farmers_endpoints(token=None):
    """Test the farmers endpoints"""
    headers = {
        "Content-Type": "application/json"
    }
    
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    # Test get fields endpoint
    url = f"{BASE_URL}/api/farmers/fields"
    response = requests.get(url, headers=headers)
    print(f"Get fields endpoint status: {response.status_code}")
    print(f"Response: {response.text}")
    print("-" * 50)

if __name__ == "__main__":
    print("Testing API endpoints...")
    test_root_endpoint()
    
    auth_response = test_auth_login()
    token = auth_response.get("access_token") if auth_response else None
    
    if token:
        print("Authentication successful, testing protected endpoints...")
        test_farmers_endpoints(token)
    else:
        print("Authentication failed, testing endpoints without token...")
        test_farmers_endpoints()

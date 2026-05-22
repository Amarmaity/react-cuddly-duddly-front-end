"""
API Testing Script for JWT Authentication
Run this script to test all authentication endpoints
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000/api/auth"

class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_section(title):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{title.center(60)}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")

def print_response(response, title="Response"):
    print(f"{Colors.CYAN}{title}:{Colors.ENDC}")
    print(f"Status Code: {Colors.YELLOW}{response.status_code}{Colors.ENDC}")
    try:
        data = response.json()
        print(f"Response:\n{json.dumps(data, indent=2)}")
    except:
        print(f"Response:\n{response.text}")
    print()

def test_login():
    print_section("1. User Login Test")
    
    credentials = {
        "username": "customer1",
        "password": "customer123456"
    }
    
    print(f"{Colors.BLUE}Logging in as: {credentials['username']}{Colors.ENDC}")
    response = requests.post(f"{BASE_URL}/login/", json=credentials)
    print_response(response, "Login Response")
    
    if response.status_code == 200:
        data = response.json()
        return data['access'], data['refresh'], data['user']
    return None, None, None

def test_registration():
    print_section("2. User Registration Test")
    
    new_user = {
        "username": f"testuser_{datetime.now().timestamp()}",
        "email": f"test_{datetime.now().timestamp()}@example.com",
        "password": "TestPassword123!",
        "password2": "TestPassword123!",
        "first_name": "Test",
        "last_name": "User",
        "mobile": "+8801234567899",
        "user_type": "customer"
    }
    
    print(f"{Colors.BLUE}Registering new user: {new_user['username']}{Colors.ENDC}")
    response = requests.post(f"{BASE_URL}/register/", json=new_user)
    print_response(response, "Registration Response")
    
    if response.status_code == 201:
        data = response.json()
        return data['access'], data['refresh'], data['user']
    return None, None, None

def test_get_profile(access_token):
    print_section("3. Get Current User Profile")
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    print(f"{Colors.BLUE}Fetching user profile...{Colors.ENDC}")
    response = requests.get(f"{BASE_URL}/profile/me/", headers=headers)
    print_response(response, "Profile Response")
    
    return response.status_code == 200

def test_update_profile(access_token):
    print_section("4. Update User Profile")
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    update_data = {
        "first_name": "UpdatedName",
        "last_name": "UpdatedLast"
    }
    
    print(f"{Colors.BLUE}Updating profile...{Colors.ENDC}")
    response = requests.put(f"{BASE_URL}/profile/update_profile/", 
                           json=update_data, headers=headers)
    print_response(response, "Update Response")
    
    return response.status_code == 200

def test_refresh_token(refresh_token):
    print_section("5. Refresh Access Token")
    
    data = {"refresh": refresh_token}
    
    print(f"{Colors.BLUE}Refreshing access token...{Colors.ENDC}")
    response = requests.post(f"{BASE_URL}/refresh/", json=data)
    print_response(response, "Refresh Response")
    
    if response.status_code == 200:
        return response.json()['access']
    return None

def test_change_password(access_token):
    print_section("6. Change Password")
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    password_data = {
        "old_password": "customer123456",
        "new_password": "NewPassword123!",
        "new_password2": "NewPassword123!"
    }
    
    print(f"{Colors.BLUE}Changing password...{Colors.ENDC}")
    response = requests.post(f"{BASE_URL}/profile/change_password/", 
                            json=password_data, headers=headers)
    print_response(response, "Change Password Response")
    
    return response.status_code == 200

def test_get_users_by_type(access_token, user_type="seller"):
    print_section(f"7. Get Users by Type: {user_type}")
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    print(f"{Colors.BLUE}Fetching all {user_type}s...{Colors.ENDC}")
    response = requests.get(f"{BASE_URL}/profile/get_by_type/?type={user_type}", 
                           headers=headers)
    print_response(response, f"Get {user_type.capitalize()} Response")
    
    return response.status_code == 200

def test_logout(access_token, refresh_token):
    print_section("8. User Logout")
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    logout_data = {"refresh": refresh_token}
    
    print(f"{Colors.BLUE}Logging out...{Colors.ENDC}")
    response = requests.post(f"{BASE_URL}/logout/logout/", 
                            json=logout_data, headers=headers)
    print_response(response, "Logout Response")
    
    return response.status_code == 200

def run_all_tests():
    print(f"{Colors.BOLD}{Colors.GREEN}\n🚀 Starting JWT Authentication API Tests\n{Colors.ENDC}")
    
    # Test Login
    access_token, refresh_token, user = test_login()
    if not access_token:
        print(f"{Colors.RED}Login failed! Stopping tests.{Colors.ENDC}")
        return
    
    print(f"{Colors.GREEN}✓ Login successful for: {user['username']}{Colors.ENDC}")
    
    # Test Get Profile
    if test_get_profile(access_token):
        print(f"{Colors.GREEN}✓ Get profile successful{Colors.ENDC}")
    
    # Test Update Profile
    if test_update_profile(access_token):
        print(f"{Colors.GREEN}✓ Update profile successful{Colors.ENDC}")
    
    # Test Refresh Token
    new_token = test_refresh_token(refresh_token)
    if new_token:
        print(f"{Colors.GREEN}✓ Token refresh successful{Colors.ENDC}")
        access_token = new_token
    
    # Test Get Users by Type (requires admin account)
    print(f"{Colors.YELLOW}Note: Get users by type requires admin access. Skipping for customer account.{Colors.ENDC}")
    
    # Test Registration
    new_access, new_refresh, new_user = test_registration()
    if new_access:
        print(f"{Colors.GREEN}✓ Registration successful for: {new_user['username']}{Colors.ENDC}")
    
    # Test Logout
    if test_logout(access_token, refresh_token):
        print(f"{Colors.GREEN}✓ Logout successful{Colors.ENDC}")
    
    print(f"\n{Colors.BOLD}{Colors.GREEN}✅ All Tests Completed!{Colors.ENDC}\n")

if __name__ == "__main__":
    try:
        run_all_tests()
    except requests.exceptions.ConnectionError:
        print(f"{Colors.RED}❌ Error: Could not connect to server!{Colors.ENDC}")
        print(f"{Colors.YELLOW}Make sure the Django server is running on http://localhost:8000{Colors.ENDC}")
    except Exception as e:
        print(f"{Colors.RED}❌ Error: {str(e)}{Colors.ENDC}")

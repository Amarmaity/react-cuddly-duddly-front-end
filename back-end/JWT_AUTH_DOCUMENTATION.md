# JWT Multi-User Authentication System Documentation

## Overview
This CuddlyDuddly project implements a complete JWT-based multi-user authentication system supporting three user types:
- **Admin**: System administrators with full access
- **Seller**: Merchants who sell products
- **Customer**: End users who purchase products

## Setup & Installation

### 1. Virtual Environment Setup
```bash
cd back-end
.\env\Scripts\activate  # Windows
# or
source env/bin/activate  # Linux/Mac
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Database Setup
```bash
# Reset database (if needed)
python reset_db.py

# Run migrations
python manage.py migrate

# Create test users
python create_test_users.py
```

## API Endpoints

### Authentication Endpoints (Base URL: `http://localhost:8000/api/auth/`)

#### 1. User Registration
**Endpoint**: `POST /api/auth/register/`

Create a new user account for Admin, Seller, or Customer.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "SecurePassword123!",
    "password2": "SecurePassword123!",
    "first_name": "John",
    "last_name": "Doe",
    "mobile": "+8801234567890",
    "user_type": "customer"  // Options: "admin", "seller", "customer"
}
```

**Response (201 Created)**:
```json
{
    "user": {
        "id": 1,
        "username": "newuser",
        "email": "newuser@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "mobile": "+8801234567890",
        "user_type": "customer",
        "is_verified": false,
        "created_at": "2026-03-22T10:30:00Z"
    },
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "message": "Customer registered successfully!"
}
```

---

#### 2. User Login
**Endpoint**: `POST /api/auth/login/`

Authenticate user and receive JWT tokens.

**Request Body**:
```json
{
    "username": "customer1",
    "password": "customer123456"
}
```

**Response (200 OK)**:
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 3,
        "username": "customer1",
        "email": "customer1@cuddlyduddly.com",
        "user_type": "customer",
        "first_name": "Jane",
        "last_name": "Customer",
        "is_verified": false
    }
}
```

---

#### 3. Refresh Token
**Endpoint**: `POST /api/auth/refresh/`

Get a new access token without re-logging in.

**Request Body**:
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200 OK)**:
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

#### 4. Get Current User Profile
**Endpoint**: `GET /api/auth/profile/me/`

Retrieve current authenticated user's profile.

**Request Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Response (200 OK)**:
```json
{
    "id": 3,
    "username": "customer1",
    "email": "customer1@cuddlyduddly.com",
    "first_name": "Jane",
    "last_name": "Customer",
    "mobile": "+8809876543210",
    "user_type": "customer",
    "is_verified": false,
    "created_at": "2026-03-22T10:30:00Z"
}
```

---

#### 5. Update Profile
**Endpoint**: `PUT /api/auth/profile/update_profile/`

Update user profile information.

**Request Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body** (partial update):
```json
{
    "first_name": "Jane",
    "last_name": "CustomerUpdated",
    "mobile": "+8809876543211"
}
```

**Response (200 OK)**:
```json
{
    "id": 3,
    "username": "customer1",
    "email": "customer1@cuddlyduddly.com",
    "first_name": "Jane",
    "last_name": "CustomerUpdated",
    "mobile": "+8809876543211",
    "user_type": "customer",
    "is_verified": false,
    "created_at": "2026-03-22T10:30:00Z"
}
```

---

#### 6. Change Password
**Endpoint**: `POST /api/auth/profile/change_password/`

Change user password.

**Request Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body**:
```json
{
    "old_password": "customer123456",
    "new_password": "NewSecurePassword123!",
    "new_password2": "NewSecurePassword123!"
}
```

**Response (200 OK)**:
```json
{
    "message": "Password changed successfully!"
}
```

---

#### 7. Logout
**Endpoint**: `POST /api/auth/logout/logout/`

Blacklist the refresh token to log out.

**Request Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body**:
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200 OK)**:
```json
{
    "message": "Logged out successfully!"
}
```

---

#### 8. Get Users by Type (Admin Only)
**Endpoint**: `GET /api/auth/profile/get_by_type/?type=seller`

Get all users of a specific type (Admin permission required).

**Request Headers**:
```
Authorization: Bearer <admin_access_token>
Content-Type: application/json
```

**Query Parameters**:
- `type`: "admin", "seller", or "customer"

**Response (200 OK)**:
```json
[
    {
        "id": 2,
        "username": "seller1",
        "email": "seller1@cuddlyduddly.com",
        "first_name": "John",
        "last_name": "Seller",
        "mobile": "+8801234567890",
        "user_type": "seller",
        "is_verified": false,
        "created_at": "2026-03-22T10:30:00Z"
    }
]
```

---

## JWT Token Information

### Access Token
- **Lifetime**: 15 minutes
- **Used for**: Authorizing API requests
- **Included in**: Authorization header

### Refresh Token
- **Lifetime**: 7 days
- **Used for**: Getting new access tokens
- **Never included in**: Authorization header

---

## Authentication Headers

All authenticated endpoints require the following header:

```
Authorization: Bearer <access_token>
```

Example using curl:
```bash
curl -H "Authorization: Bearer your_token_here" http://localhost:8000/api/auth/profile/me/
```

---

## Test Credentials

Pre-created test users for development:

| User Type | Username | Password | Email |
|-----------|----------|----------|-------|
| Admin | admin | admin123456 | admin@cuddlyduddly.com |
| Seller | seller1 | seller123456 | seller1@cuddlyduddly.com |
| Customer | customer1 | customer123456 | customer1@cuddlyduddly.com |

---

## Error Responses

### 400 Bad Request
```json
{
    "field_name": ["Error message here"]
}
```

### 401 Unauthorized
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
    "error": "Permission denied"
}
```

### 404 Not Found
```json
{
    "detail": "Not found."
}
```

---

## Project Structure

```
back-end/
├── Auth/                          # Authentication app
│   ├── models.py                 # CustomUser model with roles
│   ├── views.py                  # Auth views and endpoints
│   ├── serializers.py            # Auth serializers
│   ├── urls.py                   # Auth routes
│   └── migrations/               # Database migrations
│
├── ApiAdmin/                      # Admin app
│   ├── models.py                 # AdminProfile model
│   ├── views.py                  # Admin views
│   ├── serializers.py            # Admin serializers
│   └── urls.py                   # Admin routes
│
├── ApiSeller/                     # Seller app
│   ├── models.py                 # SellerProfile model
│   ├── views.py                  # Seller views
│   ├── serializers.py            # Seller serializers
│   └── urls.py                   # Seller routes
│
├── CuddlyDuddly/                 # Main project settings
│   ├── settings.py               # JWT and auth configuration
│   ├── urls.py                   # Main URL routing
│   └── wsgi.py                   # WSGI configuration
│
├── manage.py                      # Django management
├── reset_db.py                    # Database reset script
└── create_test_users.py          # Test user creation script
```

---

## Key Features

### 1. Role-Based Access Control
- Three user types: Admin, Seller, Customer
- Easy to check user role: `user.is_admin`, `user.is_seller`, `user.is_customer`

### 2. Secure Password Handling
- Passwords are hashed using Django's built-in password validation
- Password validators enforce strong passwords

### 3. Token Rotation
- Refresh tokens can be rotated automatically
- Blacklist support for logout functionality

### 4. Extensible Architecture
- Easy to add more user types by modifying choices in CustomUser model
- Simple to add role-specific permissions

---

## Configuration

### JWT Settings (in settings.py)
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
}
```

### Modify preferences:
- Change `ACCESS_TOKEN_LIFETIME` for shorter/longer token expiry
- Change `REFRESH_TOKEN_LIFETIME` for how long users stay logged in
- Set `ROTATE_REFRESH_TOKENS` to True to issue new refresh tokens on refresh

---

## Next Steps

1. **Connect Frontend**: Update your React/Vue apps to use these endpoints
2. **Add Admin Panel**: Create management views for admins to manage sellers
3. **Add Seller Dashboard**: Create views for sellers to manage products
4. **Add Email Verification**: Implement email verification on registration
5. **Add Social Authentication**: Integrate OAuth providers (Google, Facebook)
6. **Add 2FA**: Implement Two-Factor Authentication for security

---

## Support & Troubleshooting

### Issue: "No module named 'decouple'"
**Solution**: Install python-decouple: `pip install python-decouple`

### Issue: "Authentication credentials were not provided"
**Solution**: Make sure you include the Authorization header with the Bearer token

### Issue: "Token is invalid or expired"
**Solution**: Get a new access token using the refresh token endpoint

---

## License
CuddlyDuddly Project © 2026

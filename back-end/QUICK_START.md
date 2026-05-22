# Quick Start Guide - JWT Authentication System

## 🚀 Getting Started

### Step 1: Activate Virtual Environment
```bash
cd back-end
.\env\Scripts\activate
```

### Step 2: Run the Django Server
```bash
python manage.py runserver
```

The server will start at: `http://localhost:8000`

### Step 3: Test the API
In another terminal (with virtual environment activated):
```bash
python test_api.py
```

---

## 📧 Quick Test - Using cURL

### Login with Customer Account
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "customer1",
    "password": "customer123456"
  }'
```

### Get Your Profile
```bash
curl -X GET http://localhost:8000/api/auth/profile/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

Replace `YOUR_ACCESS_TOKEN_HERE` with the access token from login response.

---

## 🎯 Frontend Integration Example (React/JavaScript)

### 1. Login Function
```javascript
async function login(username, password) {
  const response = await fetch('http://localhost:8000/api/auth/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  
  // Store tokens
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data;
}
```

### 2. Make Authenticated Request
```javascript
async function fetchUserProfile() {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://localhost:8000/api/auth/profile/me/', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
}
```

### 3. Register New User
```javascript
async function register(userData) {
  const response = await fetch('http://localhost:8000/api/auth/register/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      password2: userData.password,
      first_name: userData.firstName,
      last_name: userData.lastName,
      mobile: userData.mobile,
      user_type: 'customer'  // or 'seller', 'admin'
    })
  });
  
  return await response.json();
}
```

### 4. Refresh Token
```javascript
async function refreshAccessToken() {
  const refresh = localStorage.getItem('refresh_token');
  
  const response = await fetch('http://localhost:8000/api/auth/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh })
  });
  
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    return data.access;
  }
}
```

### 5. Logout
```javascript
async function logout() {
  const token = localStorage.getItem('access_token');
  const refresh = localStorage.getItem('refresh_token');
  
  await fetch('http://localhost:8000/api/auth/logout/logout/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refresh })
  });
  
  // Clear local storage
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
}
```

---

## 📋 Available User Accounts for Testing

| Type | Username | Password | Email |
|------|----------|----------|-------|
| 👨‍💼 Admin | `admin` | `admin123456` | admin@cuddlyduddly.com |
| 🏪 Seller | `seller1` | `seller123456` | seller1@cuddlyduddly.com |
| 👥 Customer | `customer1` | `customer123456` | customer1@cuddlyduddly.com |

---

## 🔧 Admin Panel

Access Django admin at: `http://localhost:8000/admin`

**Admin Credentials**: 
- Username: `admin`
- Password: `admin123456`

From the admin panel, you can:
- Manage users and their types
- View user profiles
- Manage Admin profiles
- Manage Seller profiles

---

## 📚 API Documentation

Full API documentation available in: `JWT_AUTH_DOCUMENTATION.md`

Key endpoints:
- `POST /api/auth/login/` - Login
- `POST /api/auth/register/` - Register
- `GET /api/auth/profile/me/` - Get profile
- `PUT /api/auth/profile/update_profile/` - Update profile
- `POST /api/auth/profile/change_password/` - Change password
- `POST /api/auth/refresh/` - Refresh token
- `POST /api/auth/logout/logout/` - Logout

---

## 🛠️ Useful Commands

### Create Migrations
```bash
python manage.py makemigrations
```

### Apply Migrations
```bash
python manage.py migrate
```

### Reset Database
```bash
python reset_db.py
```

### Create Test Users
```bash
python create_test_users.py
```

### Run Tests
```bash
python manage.py test
```

### Shell Access
```bash
python manage.py shell
```

---

## 🐛 Common Issues

### Issue: "ModuleNotFoundError: No module named 'rest_framework'"
**Solution**: Install dependencies:
```bash
pip install -r requirements.txt
```

### Issue: "Cannot connect to database"
**Solution**: Check database credentials in `.env` file and ensure PostgreSQL is running.

### Issue: "Invalid token"
**Solution**: Token may have expired. Get a new one using the refresh endpoint.

### Issue: Port 8000 already in use
**Solution**: Use a different port:
```bash
python manage.py runserver 8001
```

---

## 📞 Support

For detailed API documentation, see: `JWT_AUTH_DOCUMENTATION.md`

For testing the API, use: `test_api.py`

---

## 🎉 What's Next?

1. ✅ Multi-user JWT authentication implemented
2. ✅ Admin, Seller, Customer roles created
3. ⏭️ Add permission checks to Admin and Seller endpoints
4. ⏭️ Create product management for sellers
5. ⏭️ Add order management for customers
6. ⏭️ Implement email verification
7. ⏭️ Add Two-Factor Authentication

---

Happy coding! 🚀

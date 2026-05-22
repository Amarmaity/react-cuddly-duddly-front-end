import os
import django
from decouple import config

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'CuddlyDuddly.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Create superuser
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@cuddlyduddly.com',
        password='admin123456',
        user_type='admin',
        first_name='System',
        last_name='Admin'
    )
    print("✓ Superuser 'admin' created successfully!")
else:
    print("✓ Superuser 'admin' already exists!")

# Create test seller
if not User.objects.filter(username='seller1').exists():
    seller_user = User.objects.create_user(
        username='seller1',
        email='seller1@cuddlyduddly.com',
        password='seller123456',
        user_type='seller',
        first_name='John',
        last_name='Seller',
        mobile='+8801234567890'
    )
    print("✓ Seller 'seller1' created successfully!")
else:
    print("✓ Seller 'seller1' already exists!")

# Create test customer
if not User.objects.filter(username='customer1').exists():
    customer_user = User.objects.create_user(
        username='customer1',
        email='customer1@cuddlyduddly.com',
        password='customer123456',
        user_type='customer',
        first_name='Jane',
        last_name='Customer',
        mobile='+8809876543210'
    )
    print("✓ Customer 'customer1' created successfully!")
else:
    print("✓ Customer 'customer1' already exists!")

print("\n--- Test Credentials ---")
print("Admin: username='admin', password='admin123456'")
print("Seller: username='seller1', password='seller123456'")
print("Customer: username='customer1', password='customer123456'")

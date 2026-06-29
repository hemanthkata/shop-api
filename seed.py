import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop_api.settings')
django.setup()

from products.models import Category, Product

def seed():
    # Create Categories
    electronics, _ = Category.objects.get_or_create(name='Electronics', description='Gadgets and devices')
    apparel, _ = Category.objects.get_or_create(name='Apparel', description='Clothing and accessories')

    # Create Products
    products_data = [
        {
            'category': electronics,
            'name': 'Wireless Noise-Cancelling Headphones',
            'description': 'Premium over-ear headphones with industry-leading noise cancellation and 30-hour battery life.',
            'price': 299.99,
            'stock': 50,
        },
        {
            'category': electronics,
            'name': 'Smartwatch Series X',
            'description': 'Advanced health tracking, beautiful OLED display, and always-on fitness metrics.',
            'price': 399.00,
            'stock': 120,
        },
        {
            'category': apparel,
            'name': 'Minimalist Cotton T-Shirt',
            'description': 'Ultra-soft 100% organic cotton t-shirt for everyday comfort and style.',
            'price': 25.00,
            'stock': 300,
        },
        {
            'category': apparel,
            'name': 'Classic Denim Jacket',
            'description': 'Timeless design with durable stitching and a relaxed fit.',
            'price': 89.99,
            'stock': 40,
        }
    ]

    for data in products_data:
        Product.objects.get_or_create(name=data['name'], defaults=data)
    
    print("Database seeded with mock products successfully!")

if __name__ == '__main__':
    seed()

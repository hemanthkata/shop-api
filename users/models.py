from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # Add any custom fields here if needed in the future
    # e.g., phone_number, address, etc.
    
    def __str__(self):
        return self.username

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _ 

# Create your models here.
ROLE_CHOICES = (("admin", "Admin"), ("user", "User"))
class User(AbstractUser):
    role = models.CharField(_("Role"), max_length=50, choices=ROLE_CHOICES,default='role')

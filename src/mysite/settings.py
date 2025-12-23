from pathlib import Path
from datetime import timedelta
import os
from dotenv import load_dotenv
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-$!_w7l&8v6nty_rzx==3e^24+2(v@l940+wl8_^@(=#**#p@2^'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # thirdparty
    'rest_framework',
    'rest_framework_simplejwt',
    "corsheaders",
    # myapps
    'users'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'mysite.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'mysite.wsgi.application'


# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/6.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

#---------------------
# Internationalization
#---------------------

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

#--------------------------------------
# Static files (CSS, JavaScript, Images)
# ---------------------------------------

STATIC_URL = 'static/'

"""
Authentication and API Configuration
Includes custom user model, password reset timeout, JWT settings, and CORS.
"""

# -----------------------------
# Authentication Settings
# -----------------------------
# Use custom user model
AUTH_USER_MODEL = 'users.User'

# Password reset token expiration (in seconds)
PASSWORD_RESET_TIMEOUT = 3600  # 1 hour

# -----------------------------
# Django REST Framework (DRF)
# -----------------------------
REST_FRAMEWORK = {
    # Default authentication using JWT
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

# -----------------------------
# Simple JWT Configuration
# -----------------------------
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(minutes=60),
    "ROTATE_REFRESH_TOKENS": True,
    "TOKEN_OBTAIN_SERIALIZER": "users.serializers.MyTokenObtainPairSerializer",
}

# -----------------------------
# Cross-Origin Resource Sharing (CORS)
# -----------------------------
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

"""
Email Configuration
Handles sending emails and related settings for the application.
"""
# Frontend URL for constructing links in emails
FRONT_END_URL = os.getenv('FRONT_END_URL')

# Email backend configuration
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

# SMTP server settings
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587  # TLS: 587, SSL: 465
EMAIL_HOST_USER = os.getenv('HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('HOST_PASSWORD')

# Security settings
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False

# Default sender email
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
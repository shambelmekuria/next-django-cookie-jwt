from django.urls import path
from .views import *
urlpatterns = [
    path('me/', get_user, name='get-account'),
    path('create/', create_user, name='create-account'),
    path("update/", update_user, name="update-account"),
    path("delete/", delete_user, name="delete-account"),
    path("test-password-change/", test_passoword_change, name="test-password-change"),
    path('password-reset/',password_reset_request,name="password-reset"),
    path("confirm-password-reset/",confirm_password_reset, name="confirm-password-reset/")
]
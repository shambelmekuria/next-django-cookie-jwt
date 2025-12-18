from django.urls import path
from .views import get_user, create_user,delete_user,update_user,test_passoword_change,password_reset_request
urlpatterns = [
    path('me/', get_user, name='get-account'),
    path('create/', create_user, name='create-account'),
    path("update/", update_user, name="update-account"),
    path("delete/", delete_user, name="delete-account"),
    path("test-password-change/", test_passoword_change, name="test-password-change"),
    path('password-reset/',password_reset_request,name="password-reset")
]
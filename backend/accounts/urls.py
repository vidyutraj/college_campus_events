from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'profiles', views.StudentProfileViewSet, basename='studentprofile')

urlpatterns = [
    path('api/auth/', include(router.urls)),
    path('api/auth/register/', views.student_register, name='student-register'),
    path('api/auth/login/', views.user_login, name='user-login'),
    path('api/auth/logout/', views.user_logout, name='user-logout'),
    path('api/auth/current-user/', views.current_user, name='current-user'),
    path('api/auth/check/', views.check_auth, name='check-auth'),
]


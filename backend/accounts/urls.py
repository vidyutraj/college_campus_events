from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'profiles', views.StudentProfileViewSet, basename='studentprofile')

urlpatterns = [
    path('auth/', include(router.urls)),
    path('auth/register/', views.student_register, name='student-register'),
    path('auth/login/', views.user_login, name='user-login'),
    path('auth/logout/', views.user_logout, name='user-logout'),
    path('auth/check/', views.check_auth, name='check-auth'),
    path('profiles/<str:pk>/', views.StudentProfileViewSet.as_view({'get': 'retrieve'}), name='studentprofile-detail-by-username'),
]


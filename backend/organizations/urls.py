from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'organizations', views.OrganizationViewSet, basename='organization')

urlpatterns = [
    path('', include(router.urls)),
    path('organizations/<str:pk>/', views.OrganizationViewSet.as_view({'get': 'retrieve'}), name='organization-detail-by-slug'),
]


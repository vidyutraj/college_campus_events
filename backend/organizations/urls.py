from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'organizations', views.OrganizationViewSet, basename='organization')

urlpatterns = [
    # Put specific routes BEFORE the router to avoid conflicts
    path('api/organizations/register/', views.register_organization, name='register-organization'),
    path('api/organizations/my-organizations/', views.my_organizations, name='my-organizations'),
    path('api/organizations/my-memberships/', views.my_organization_memberships, name='my-memberships'),
    # Router comes last so specific routes are matched first
    path('api/', include(router.urls)),
]


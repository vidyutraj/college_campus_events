from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'organizations', views.OrganizationViewSet, basename='organization')
router.register(r'meetings', views.OrganizationMeetingViewSet, basename='organizationmeeting')
router.register(r'meeting-recurrences', views.MeetingRecurrenceViewSet, basename='meetingrecurrence')
router.register(r'meeting-exceptions', views.MeetingExceptionViewSet, basename='meetingexception')
router.register(r'meeting-overrides', views.MeetingOccurrenceOverrideViewSet, basename='meetingoverride')

urlpatterns = [
    path('api/', include(router.urls)),
]

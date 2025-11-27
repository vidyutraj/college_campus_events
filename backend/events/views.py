from rest_framework import viewsets, filters, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone

from organizations.models import Organization
from .models import Event, EventCategory, RSVP
from .serializers import EventSerializer, EventCategorySerializer, RSVPSerializer


class EventCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for event categories"""
    queryset = EventCategory.objects.all()
    serializer_class = EventCategorySerializer


class EventViewSet(viewsets.ModelViewSet):
    """ViewSet for events"""
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'modality', 'has_free_food', 'has_free_swag', 'host_organization']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['start_datetime', 'created_at']
    ordering = ['-start_datetime']

    def get_queryset(self):
        # For detail view (retrieve), allow fetching any event regardless of status
        if self.action == 'retrieve' or (self.action == 'pending_approval' and self.request.user.is_staff):
            return Event.objects.all()
        
        # For list view, apply filters for published and approved events
        queryset = Event.objects.filter(status='published', is_approved=True)
        
        # Filter by date range if provided
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        
        if start_date:
            queryset = queryset.filter(start_datetime__gte=start_date)
        if end_date:
            queryset = queryset.filter(end_datetime__lte=end_date)
        
        # Only show upcoming events by default (can be overridden)
        if self.request.query_params.get('include_past', 'false').lower() != 'true':
            queryset = queryset.filter(start_datetime__gte=timezone.now())
        
        return queryset

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def pending_approval(self, request):
        """
        List all pending events for admin approval.
        """
        queryset = self.filter_queryset(self.get_queryset()).filter(is_approved=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        host_user = None
        if self.request.user.is_authenticated:
            host_user = self.request.user
        
        # Get host_organization from validated data if present
        host_organization_id = self.request.data.get('host_organization')
        if host_organization_id:
            # If host_organization_id is provided, fetch the Organization instance
            try:
                organization_instance = Organization.objects.get(id=host_organization_id)
                serializer.save(host_user=host_user, host_organization=organization_instance)
            except Organization.DoesNotExist:
                # Handle case where organization ID is invalid
                raise serializer.ValidationError({"host_organization": "Organization with this ID does not exist."})
        else:
            # Otherwise, save without host_organization, relying on other defaults/logic
            serializer.save(host_user=host_user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def rsvp(self, request, pk=None):
        """RSVP to an event"""
        event = self.get_object()
        rsvp, created = RSVP.objects.get_or_create(
            event=event,
            user=request.user
        )
        if created:
            return Response({'message': 'RSVP successful'}, status=status.HTTP_201_CREATED)
        return Response({'message': 'Already RSVPed'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'], permission_classes=[IsAuthenticated])
    def cancel_rsvp(self, request, pk=None):
        """Cancel RSVP to an event"""
        event = self.get_object()
        try:
            rsvp = RSVP.objects.get(event=event, user=request.user)
            rsvp.delete()
            return Response({'message': 'RSVP cancelled'}, status=status.HTTP_200_OK)
        except RSVP.DoesNotExist:
            return Response({'error': 'No RSVP found'}, status=status.HTTP_404_NOT_FOUND)

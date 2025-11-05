from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Event, EventCategory, RSVP
from .serializers import EventSerializer, EventCategorySerializer, RSVPSerializer


class EventCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for event categories"""
    queryset = EventCategory.objects.all()
    serializer_class = EventCategorySerializer


class EventViewSet(viewsets.ModelViewSet):
    """ViewSet for events"""
    queryset = Event.objects.filter(status='published', is_approved=True)
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'modality', 'has_free_food', 'has_free_swag', 'host_organization']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['start_datetime', 'created_at']
    ordering = ['-start_datetime']

    def get_queryset(self):
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

    def perform_create(self, serializer):
        serializer.save(host_user=self.request.user)

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

from rest_framework import viewsets, permissions
from .models import (
    Organization,
    OrganizationMember,
    OrganizationMeeting,
    MeetingRecurrence,
    MeetingException,
    MeetingOccurrenceOverride
)
from .serializers import (
    OrganizationSerializer,
    OrganizationMeetingSerializer,
    MeetingRecurrenceSerializer,
    MeetingExceptionSerializer,
    MeetingOccurrenceOverrideSerializer
)

class OrganizationViewSet(viewsets.ModelViewSet):
    """ViewSet for organizations"""
    queryset = Organization.objects.filter(is_verified=True)
    serializer_class = OrganizationSerializer

    def perform_create(self, serializer):
        """
        Register a new organization for the authenticated user.
        """
        user = self.request.user

        # Extract payload
        org_name = self.request.data.get('name')
        org_description = self.request.data.get('description')

        # Validate required field
        if not org_name:
            raise serializer.ValidationError({"name": "Organization name is required."})

        # Check for duplicate
        if Organization.objects.filter(name=org_name).exists():
            raise serializer.ValidationError({"name": "An organization with this name already exists."})

        # Save organization instance
        organization = serializer.save(
            name=org_name,
            description=org_description,
            created_by=user
        )

        # Create organization member as leader
        OrganizationMember.objects.create(
            user=user,
            organization=organization,
            is_board_member=True,
            is_leader=True,
            role="President"
        )

class OrganizationMeetingViewSet(viewsets.ModelViewSet):
    queryset = OrganizationMeeting.objects.all()
    serializer_class = OrganizationMeetingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Create the base meeting
        meeting = serializer.save()

        # Check if recurrence data exists in request
        recurrence_data = self.request.data
        recurrence = None

        if recurrence_data.get("frequency"):
            MeetingRecurrence.objects.create(
                meeting=meeting,
                frequency=recurrence_data.get("frequency"),
                interval=recurrence_data.get("interval", 1),
                byweekday=recurrence_data.get("byweekday", []),
                count=recurrence_data.get("count"),
                until=recurrence_data.get("until"),
            )
        
        # Handle exceptions (linked to recurrence)
        if recurrence:
            for date_str in recurrence_data.get("exceptions", []):
                if date_str:
                    MeetingException.objects.create(
                        recurrence=recurrence,
                        date=date_str,
                    )

            # Handle overrides (linked to recurrence)
            for override in recurrence_data.get("overrides", []):
                if override.get("original_date"):
                    overridden_start = None
                    overridden_end = None
                    if override.get("overridden_start_time"):
                        overridden_start = f"{override['overridden_date']} {override['overridden_start_time']}"
                    if override.get("overridden_end_time"):
                        overridden_end = f"{override['overridden_date']} {override['overridden_end_time']}"

                    MeetingOccurrenceOverride.objects.create(
                        recurrence=recurrence,
                        original_date=override["original_date"],
                        overridden_start=overridden_start,
                        overridden_end=overridden_end,
                        overridden_location=override.get("overridden_location", ""),
                        overridden_room=override.get("overridden_room", "")
                    )


class MeetingRecurrenceViewSet(viewsets.ModelViewSet):
    queryset = MeetingRecurrence.objects.all()
    serializer_class = MeetingRecurrenceSerializer
    permission_classes = [permissions.IsAuthenticated]


class MeetingExceptionViewSet(viewsets.ModelViewSet):
    queryset = MeetingException.objects.all()
    serializer_class = MeetingExceptionSerializer
    permission_classes = [permissions.IsAuthenticated]


class MeetingOccurrenceOverrideViewSet(viewsets.ModelViewSet):
    queryset = MeetingOccurrenceOverride.objects.all()
    serializer_class = MeetingOccurrenceOverrideSerializer
    permission_classes = [permissions.IsAuthenticated]

from rest_framework import viewsets
from .models import Organization, OrganizationMember
from .serializers import OrganizationSerializer


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

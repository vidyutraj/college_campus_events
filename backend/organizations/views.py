from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Organization, OrganizationMember
from .serializers import OrganizationSerializer
from django.utils.text import slugify


class OrganizationViewSet(viewsets.ModelViewSet):
    """ViewSet for organizations"""
    queryset = Organization.objects.filter(is_verified=True)
    serializer_class = OrganizationSerializer

    def retrieve(self, request, pk=None):
        if not pk.isdigit():
            # treat pk as organization slug
            try:
                org = Organization.objects.get(slug=pk)
            except Organization.DoesNotExist:
                return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
            serializer = self.get_serializer(org, context={'request': request})
            return Response(serializer.data)

        return super().retrieve(request, pk)

    def perform_create(self, serializer):
        user = self.request.user

        org_name = self.request.data.get('name')
        org_description = self.request.data.get('description')

        if not org_name:
            raise serializer.ValidationError({"name": "Organization name is required."})

        if Organization.objects.filter(name=org_name).exists():
            raise serializer.ValidationError({"name": "An organization with this name already exists."})

        # Generate base slug
        base_slug = slugify(org_name)
        slug = base_slug
        counter = 1

        # Ensure slug uniqueness
        while Organization.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1

        # Create organization with unique slug
        organization = serializer.save(
            name=org_name,
            slug=slug,
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

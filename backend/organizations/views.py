from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Organization, OrganizationMember
from django.contrib.auth import login
from .serializers import (
    OrganizationSerializer,
    OrganizationMemberSerializer
)
from accounts.serializers import LoginSerializer, UserSerializer
from django.contrib.auth.models import User


class OrganizationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for organizations"""
    queryset = Organization.objects.filter(is_verified=True)
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.AllowAny]


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_organization(request):
    """
    Allows authenticated users to register an organization.
    """
    user = request.user

    # At this point, user is authenticated
    org_name = request.data.get('organization_name')
    org_description = request.data.get('organization_description')
    if not org_name:
        return Response({'error': 'Organization name is required.'}, status=status.HTTP_400_BAD_REQUEST)

    # Prevent duplicate organizations or duplicate leaders
    if Organization.objects.filter(name=org_name).exists():
        return Response({'error': 'An organization with this name already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    # Create organization and profile
    organization = Organization.objects.create(
            name=org_name,
            description=org_description,
            created_by=user
    )
    OrganizationMember.objects.create(
        user=user,
        organization=organization,
        is_board_member=True,
        is_leader=True,
        role="President"
    )

    return Response({
        'message': 'Organization registered successfully.',
        'organization': {
            'id': organization.id,
            'name': organization.name,
        },
        'user': UserSerializer(user).data,
    }, status=status.HTTP_201_CREATED)



@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_organizations(request):
    """Get organizations created by the current user"""
    organizations = Organization.objects.filter(created_by=request.user)
    serializer = OrganizationSerializer(organizations, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_organization_memberships(request):
    """Get organizations the user is a member of"""
    memberships = OrganizationMember.objects.filter(user=request.user)
    serializer = OrganizationMemberSerializer(memberships, many=True)
    return Response(serializer.data)

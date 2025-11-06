from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.sessions.models import Session
from .models import Organization, OrganizationMember
from .serializers import (
    OrganizationSerializer, OrganizationRegistrationSerializer,
    OrganizationMemberSerializer
)
from accounts.serializers import UserSerializer # Import UserSerializer for response


class OrganizationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for organizations"""
    queryset = Organization.objects.filter(is_verified=True)
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.AllowAny]


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_organization(request):
    """Register a new organization and its creating user"""
    serializer = OrganizationRegistrationSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        organization = serializer.save()
        
        # The user is created within the serializer's create method
        # We need to retrieve the user associated with the organization
        user = organization.created_by
        
        return Response({
            'message': 'Organization and user registered successfully! You can now sign in with your user credentials.',
            'organization': OrganizationSerializer(organization).data,
            'user': UserSerializer(user).data # Return user data for immediate login if desired
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

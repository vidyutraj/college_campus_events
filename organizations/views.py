from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.sessions.models import Session
from .models import Organization, OrganizationMember
from .serializers import (
    OrganizationSerializer, OrganizationRegistrationSerializer,
    OrganizationMemberSerializer, OrganizationLoginSerializer
)


class OrganizationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for organizations"""
    queryset = Organization.objects.filter(is_verified=True)
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.AllowAny]


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_organization(request):
    """Register a new organization (public - no authentication required)"""
    serializer = OrganizationRegistrationSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        organization = serializer.save()
        
        return Response({
            'message': 'Organization registered successfully! You can now sign in using the organization credentials.',
            'organization': OrganizationSerializer(organization).data,
            'username': organization.username
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


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def organization_login(request):
    """Login using organization credentials"""
    serializer = OrganizationLoginSerializer(data=request.data)
    
    if serializer.is_valid():
        organization = serializer.validated_data['organization']
        
        # Store organization ID in session
        request.session['organization_id'] = organization.id
        request.session['organization_name'] = organization.name
        request.session.save()
        
        # Get any user associated with this organization (for compatibility)
        # Typically the creator or a leader
        user = None
        if organization.created_by:
            user = organization.created_by
        
        return Response({
            'message': 'Login successful',
            'organization': OrganizationSerializer(organization).data,
            'user': user.username if user else None,
            'user_type': 'organization_leader'
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def organization_logout(request):
    """Logout from organization account"""
    if 'organization_id' in request.session:
        del request.session['organization_id']
    if 'organization_name' in request.session:
        del request.session['organization_name']
    request.session.save()
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def check_organization_auth(request):
    """Check if user is logged in as an organization"""
    organization_id = request.session.get('organization_id')
    
    if organization_id:
        try:
            organization = Organization.objects.get(id=organization_id)
            return Response({
                'is_authenticated': True,
                'organization': OrganizationSerializer(organization).data,
                'user_type': 'organization_leader'
            })
        except Organization.DoesNotExist:
            # Clear invalid session
            if 'organization_id' in request.session:
                del request.session['organization_id']
            if 'organization_name' in request.session:
                del request.session['organization_name']
            request.session.save()
    
    return Response({
        'is_authenticated': False
    })

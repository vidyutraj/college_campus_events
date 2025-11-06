from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from accounts.models import OrganizationLeaderProfile
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
    Unauthenticated users must log in first (using username/password).
    """
    user = request.user

    # If not authenticated, authenticate manually
    if not user.is_authenticated:
        username = request.data.get('user_username')
        password = request.data.get('user_password')

        if not username or not password:
            return Response(
                {'error': 'Username and password required for unauthenticated users.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Reuse your LoginSerializer logic
        serializer = LoginSerializer(data={'username': username, 'password': password})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
        else:
            user_email = request.data.get('user_email')
            user_first_name = request.data.get('user_first_name', '')
            user_last_name = request.data.get('user_last_name', '')
        
            # Create the User
            user = User.objects.create_user(
                username=username,
                email=user_email,
                password=password,
                first_name=user_first_name,
                last_name=user_last_name
            )

    # At this point, user is authenticated
    org_name = request.data.get('organization_name')
    org_description = request.data.get('organization_description')
    if not org_name:
        return Response({'error': 'Organization name is required.'}, status=status.HTTP_400_BAD_REQUEST)

    # Prevent duplicate organizations or duplicate leaders
    if hasattr(user, 'org_leader_profile'):
        return Response({'error': 'User already linked to an organization.'}, status=status.HTTP_400_BAD_REQUEST)

    # Create organization and profile
    organization = Organization.objects.create(
            name=org_name,
            description=org_description,
            created_by=user
    )
    OrganizationLeaderProfile.objects.create(
        user=user,
        organization=organization,
        is_board_member=True # The creator is automatically a board member
    )

    return Response({
        'message': 'Organization registered successfully.',
        'organization': {
            'id': organization.id,
            'name': organization.name,
        },
        'user': UserSerializer(user).data,
        'user_type': 'organization_leader',
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

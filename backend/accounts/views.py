from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import login, logout
from .models import StudentProfile
from .serializers import (
    UserSerializer, StudentProfileSerializer, StudentRegistrationSerializer,
    LoginSerializer
)
from organizations.serializers import OrganizationSerializer


class StudentProfileViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for student profiles"""
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def student_register(request):
    """Student registration endpoint"""
    serializer = StudentRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        login(request, user)
        return Response({
            'message': 'Registration successful',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def user_login(request):
    """User login endpoint"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        
        organizations_leader = []
        organizations_board_member = []
        organizations_member = []
        organizations_unverified = []

        if hasattr(user, 'organization_memberships'):
            memberships = user.organization_memberships.all()

            for membership in memberships:
                org = membership.organization
                org_data = OrganizationSerializer(org).data

                if not org.is_verified:
                    organizations_unverified.append(org_data)
                    continue

                if membership.is_leader:
                    organizations_leader.append(org_data)
                
                if membership.is_board_member:
                    organizations_board_member.append(org_data)
                
                organizations_member.append(org_data)
                
        return Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data,
            'organizations': {
                'leader': organizations_leader,
                'board_member': organizations_board_member,
                'member': organizations_member,
                'unverified': organizations_unverified,
            }
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def user_logout(request):
    """User logout endpoint"""
    logout(request)
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def check_auth(request):
    """Check if user is authenticated"""
    if request.user.is_authenticated:

        organizations_leader = []
        organizations_board_member = []
        organizations_member = []
        organizations_unverified = []

        if hasattr(request.user, 'organization_memberships'):
            memberships = request.user.organization_memberships.all()

            for membership in memberships:
                org = membership.organization
                org_data = OrganizationSerializer(org).data

                if not org.is_verified:
                    organizations_unverified.append(org_data)
                    continue

                if membership.is_leader:
                    organizations_leader.append(org_data)
                
                if membership.is_board_member:
                    organizations_board_member.append(org_data)
                
                organizations_member.append(org_data)

        return Response({
            'is_authenticated': True,
            'user': UserSerializer(request.user).data,
            'organizations': {
                'leader': organizations_leader,
                'board_member': organizations_board_member,
                'member': organizations_member,
                'unverified': organizations_unverified,
            }
        })
    return Response({
        'is_authenticated': False
    })

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from .models import StudentProfile
from .serializers import (
    UserSerializer, StudentProfileSerializer, StudentRegistrationSerializer,
    LoginSerializer
)
from organizations.models import Organization
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
        
        # Check user type
        organization_data = []
        if hasattr(user, 'organization_memberships'):
            leader_memberships = user.organization_memberships.filter(is_leader=True)
            if leader_memberships.exists():
                for membership in leader_memberships:
                    organization_data.append(OrganizationSerializer(membership.organization).data)
        
        return Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data,
            'organizations': organization_data
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def user_logout(request):
    """User logout endpoint"""
    logout(request)
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    """Get current authenticated user"""
    organization_data = []
    if hasattr(request.user, 'organization_memberships'):
        leader_memberships = request.user.organization_memberships.filter(is_leader=True)
        if leader_memberships.exists():
            for membership in leader_memberships:
                organization_data.append(OrganizationSerializer(membership.organization).data)
    
    return Response({
        'user': UserSerializer(request.user).data,
        'organizations': organization_data, # Changed to 'organizations'
        'is_authenticated': True
    })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def check_auth(request):
    """Check if user is authenticated"""
    if request.user.is_authenticated:
        organization_data = []
        if hasattr(request.user, 'organization_memberships'):
            leader_memberships = request.user.organization_memberships.filter(is_leader=True)
            if leader_memberships.exists():
                for membership in leader_memberships:
                    organization_data.append(OrganizationSerializer(membership.organization).data)
        
        return Response({
            'is_authenticated': True,
            'user': UserSerializer(request.user).data,
            'organizations': organization_data # Changed to 'organizations'
        })
    return Response({
        'is_authenticated': False
    })

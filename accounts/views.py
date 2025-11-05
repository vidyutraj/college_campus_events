from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from .models import StudentProfile, OrganizationLeaderProfile
from .serializers import (
    UserSerializer, StudentProfileSerializer, StudentRegistrationSerializer,
    LoginSerializer, OrganizationLeaderProfileSerializer
)


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
        user_type = 'student'
        if hasattr(user, 'org_leader_profile'):
            user_type = 'organization_leader'
        elif hasattr(user, 'site_admin_profile'):
            user_type = 'site_admin'
        
        return Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data,
            'user_type': user_type
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
    user_type = 'student'
    if hasattr(request.user, 'org_leader_profile'):
        user_type = 'organization_leader'
    elif hasattr(request.user, 'site_admin_profile'):
        user_type = 'site_admin'
    
    return Response({
        'user': UserSerializer(request.user).data,
        'user_type': user_type,
        'is_authenticated': True
    })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def check_auth(request):
    """Check if user is authenticated"""
    if request.user.is_authenticated:
        user_type = 'student'
        if hasattr(request.user, 'org_leader_profile'):
            user_type = 'organization_leader'
        elif hasattr(request.user, 'site_admin_profile'):
            user_type = 'site_admin'
        
        return Response({
            'is_authenticated': True,
            'user': UserSerializer(request.user).data,
            'user_type': user_type
        })
    return Response({
        'is_authenticated': False
    })

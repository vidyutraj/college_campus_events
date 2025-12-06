from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import login, logout
from django.contrib.auth.models import User

from .models import StudentProfile
from .serializers import (
    UserSerializer, StudentProfileSerializer, 
    StudentRegistrationSerializer, LoginSerializer
)
from .utils import get_user_organizations, get_user_profile_data


class StudentProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def retrieve(self, request, pk=None):
        if not pk.isdigit():  
            # treat pk as username
            try:
                profile = StudentProfile.objects.get(user__username=pk)
            except StudentProfile.DoesNotExist:
                return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)

        return super().retrieve(request, pk)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def student_register(request):
    serializer = StudentRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        login(request, user)
        return Response({
            'message': 'Registration successful',
            'user': UserSerializer(user).data,
            'profile': get_user_profile_data(user, request)
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def user_login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)

        return Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data,
            'organizations': get_user_organizations(user, request),
            'profile': get_user_profile_data(user, request)
        })

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def user_logout(request):
    logout(request)
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def check_auth(request):
    if request.user.is_authenticated:
        return Response({
            'is_authenticated': True,
            'user': UserSerializer(request.user).data,
            'organizations': get_user_organizations(request.user, request),
            'profile': get_user_profile_data(request.user, request)
        })

    return Response({'is_authenticated': False})

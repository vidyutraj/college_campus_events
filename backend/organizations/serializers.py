from rest_framework import serializers
from .models import Organization, OrganizationMember
from accounts.models import OrganizationLeaderProfile


class OrganizationSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)
    members_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Organization
        fields = ['id', 'name', 'description', 'created_by', 'is_verified', 'created_at', 'updated_at', 'members_count', 'username']
        read_only_fields = ['is_verified', 'created_at', 'updated_at', 'created_by']
    
    def get_members_count(self, obj):
        return obj.members.count()


class OrganizationRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for registering a new organization"""
    description = serializers.CharField(required=False, allow_blank=True)
    username = serializers.CharField(required=True, min_length=3, max_length=150, help_text="Organization login username")
    password = serializers.CharField(write_only=True, required=True, min_length=8, help_text="Organization login password")
    password_confirm = serializers.CharField(write_only=True, required=True, min_length=8, help_text="Confirm organization password")
    
    class Meta:
        model = Organization
        fields = ['name', 'description', 'username', 'password', 'password_confirm']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        
        # Check if username is already taken
        if Organization.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "This username is already taken."})
        
        return attrs
    
    def create(self, validated_data):
        # Extract password fields
        password = validated_data.pop('password')
        password_confirm = validated_data.pop('password_confirm')
        username = validated_data.pop('username')
        
        # Create the organization (no user needed - organizations are independent)
        organization = Organization.objects.create(
            name=validated_data['name'],
            description=validated_data.get('description', ''),
            username=username
        )
        
        # Set organization password
        organization.set_password(password)
        
        # Note: created_by is optional now, but we can set it if user is authenticated
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            organization.created_by = request.user
            organization.save()
        
        return organization


class OrganizationLoginSerializer(serializers.Serializer):
    """Serializer for organization login"""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            try:
                organization = Organization.objects.get(username=username)
                if not organization.check_password(password):
                    raise serializers.ValidationError('Invalid credentials.')
                if not organization.is_verified:
                    raise serializers.ValidationError('Organization is not yet verified. Please wait for admin approval.')
                attrs['organization'] = organization
            except Organization.DoesNotExist:
                raise serializers.ValidationError('Invalid credentials.')
        else:
            raise serializers.ValidationError('Must include "username" and "password".')
        
        return attrs


class OrganizationMemberSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    organization = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = OrganizationMember
        fields = ['id', 'user', 'organization', 'is_board_member', 'is_leader', 'joined_at']
        read_only_fields = ['id', 'joined_at']

from rest_framework import serializers
from .models import Organization, OrganizationMember
from accounts.models import OrganizationLeaderProfile


class OrganizationSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)
    members_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Organization
        fields = ['id', 'name', 'description', 'created_by', 'is_verified', 'created_at', 'updated_at', 'members_count']
        read_only_fields = ['is_verified', 'created_at', 'updated_at', 'created_by']
    
    def get_members_count(self, obj):
        return obj.members.count()


from django.contrib.auth.models import User
from accounts.models import OrganizationLeaderProfile

class OrganizationRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for registering a new organization and its creating user"""
    description = serializers.CharField(required=False, allow_blank=True)
    
    # User fields for the organization creator
    user_username = serializers.CharField(write_only=True, required=True, min_length=3, max_length=150)
    user_email = serializers.EmailField(write_only=True, required=True)
    user_password = serializers.CharField(write_only=True, required=True, min_length=8)
    user_password_confirm = serializers.CharField(write_only=True, required=True, min_length=8)
    user_first_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    user_last_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = Organization
        fields = [
            'name', 'description',
            'user_username', 'user_email', 'user_password', 'user_password_confirm',
            'user_first_name', 'user_last_name'
        ]
    
    def validate(self, attrs):
        if attrs['user_password'] != attrs['user_password_confirm']:
            raise serializers.ValidationError({"user_password_confirm": "Passwords do not match."})
        
        if User.objects.filter(username=attrs['user_username']).exists():
            raise serializers.ValidationError({"user_username": "This username is already taken."})
        
        if User.objects.filter(email=attrs['user_email']).exists():
            raise serializers.ValidationError({"user_email": "This email is already registered."})
            
        return attrs
    
    def create(self, validated_data):
        # Extract user fields
        user_username = validated_data.pop('user_username')
        user_email = validated_data.pop('user_email')
        user_password = validated_data.pop('user_password')
        user_password_confirm = validated_data.pop('user_password_confirm') # Not needed after validation
        user_first_name = validated_data.pop('user_first_name', '')
        user_last_name = validated_data.pop('user_last_name', '')
        
        # Create the User
        user = User.objects.create_user(
            username=user_username,
            email=user_email,
            password=user_password,
            first_name=user_first_name,
            last_name=user_last_name
        )
        
        # Create the Organization, linking it to the newly created user
        organization = Organization.objects.create(
            name=validated_data['name'],
            description=validated_data.get('description', ''),
            created_by=user # Link the organization to the user who created it
        )
        
        # Create an OrganizationLeaderProfile for the user
        OrganizationLeaderProfile.objects.create(
            user=user,
            organization=organization,
            is_board_member=True # The creator is automatically a board member
        )
        
        return organization


class OrganizationMemberSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    organization = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = OrganizationMember
        fields = ['id', 'user', 'organization', 'is_board_member', 'is_leader', 'joined_at']
        read_only_fields = ['id', 'joined_at']

from rest_framework import serializers
from events.serializers import EventSerializer
from .models import Organization, OrganizationMember
from accounts.models import StudentProfile

class OrganizationSerializer(serializers.ModelSerializer):
    members_count = serializers.SerializerMethodField()
    events = EventSerializer(many=True, read_only=True)
    members = serializers.SerializerMethodField()
    
    class Meta:
        model = Organization
        fields = [
            'id', 'name', 'slug', 'description', 'website', 'email', 'instagram', 
            'linkedin', 'slack', 'discord', 'logo', 'created_by', 'is_verified',
            'created_at', 'updated_at', 'members_count', 'members', 'events'
        ]
        read_only_fields = ['is_verified', 'created_at', 'updated_at', 'created_by']
    
    def get_members_count(self, obj):
        return obj.members.count()
    
    def get_members(self, obj):
        members = obj.members.select_related("user").all()
        return OrganizationMemberSerializer(
            members, 
            many=True, 
            context=self.context  # <-- important
        ).data

class MinimalOrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'slug', 'description', 'logo', 'is_verified']

class OrganizationMemberSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    organization = MinimalOrganizationSerializer(read_only=True)

    user_username = serializers.SerializerMethodField()
    user_full_name = serializers.SerializerMethodField()
    user_profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = OrganizationMember
        fields = [
            'id',
            'user',
            'user_username',
            'user_full_name',
            'user_profile_picture',
            'organization',
            'is_board_member',
            'is_leader',
            'role',
            'joined_at'
        ]
        read_only_fields = ['id', 'joined_at']

    def get_user_username(self, obj):
        return obj.user.username

    def get_user_profile_picture(self, obj):
        request = self.context.get("request")
        profile = getattr(obj.user, "student_profile", None)
        if profile and profile.profile_picture:
            relative_url = profile.profile_picture.url
            return request.build_absolute_uri(relative_url) if request else relative_url
        return ""

    def get_user_full_name(self, obj):
        first = obj.user.first_name or ""
        last = obj.user.last_name or ""
        full = f"{first} {last}".strip()
        return full if full else obj.user.username
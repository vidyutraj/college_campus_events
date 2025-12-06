from rest_framework import serializers
from events.serializers import EventSerializer
from .models import Organization, OrganizationMember

class OrganizationSerializer(serializers.ModelSerializer):
    members_count = serializers.SerializerMethodField()
    events = EventSerializer(many=True, read_only=True)
    
    class Meta:
        model = Organization
        fields = ['id', 'name', 'slug', 'description', 'website', 'email', 'instagram', 'linkedin', 'slack', 'discord', 'logo', 'created_by', 'is_verified', 'created_at', 'updated_at', 'members_count', 'events']
        read_only_fields = ['is_verified', 'created_at', 'updated_at', 'created_by']
    
    def get_members_count(self, obj):
        return obj.members.count()

class OrganizationMemberSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    organization = OrganizationSerializer(read_only=True)
    
    class Meta:
        model = OrganizationMember
        fields = ['id', 'user', 'organization', 'is_board_member', 'is_leader', 'role', 'joined_at']
        read_only_fields = ['id', 'joined_at']

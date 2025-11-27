from rest_framework import serializers
from .models import Organization, OrganizationMember

class OrganizationSerializer(serializers.ModelSerializer):
    members_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Organization
        fields = ['id', 'name', 'description', 'created_by', 'is_verified', 'created_at', 'updated_at', 'members_count']
        read_only_fields = ['is_verified', 'created_at', 'updated_at', 'created_by']
    
    def get_members_count(self, obj):
        return obj.members.count()

class OrganizationMemberSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    organization = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = OrganizationMember
        fields = ['id', 'user', 'organization', 'is_board_member', 'is_leader', 'joined_at']
        read_only_fields = ['id', 'joined_at']

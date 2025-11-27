from rest_framework import serializers
from .models import (
    Organization,
    OrganizationMember,
    OrganizationMeeting,
    MeetingRecurrence,
    MeetingException,
    MeetingOccurrenceOverride
)

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

# -------------------------
# Meeting Serializers
# -------------------------
class MeetingRecurrenceSerializer(serializers.ModelSerializer):
    meeting_id = serializers.PrimaryKeyRelatedField(
        queryset=OrganizationMeeting.objects.all(),
        source="meeting",
        write_only=True
    )

    class Meta:
        model = MeetingRecurrence
        fields = [
            'id', 'meeting', 'meeting_id', 'frequency', 'interval',
            'byweekday', 'count', 'until'
        ]
        read_only_fields = ['meeting']


class MeetingExceptionSerializer(serializers.ModelSerializer):
    recurrence_id = serializers.PrimaryKeyRelatedField(
        queryset=MeetingRecurrence.objects.all(),
        source="recurrence",
        write_only=True
    )

    class Meta:
        model = MeetingException
        fields = ['id', 'recurrence', 'recurrence_id', 'date', 'note']
        read_only_fields = ['recurrence']


class MeetingOccurrenceOverrideSerializer(serializers.ModelSerializer):
    recurrence_id = serializers.PrimaryKeyRelatedField(
        queryset=MeetingRecurrence.objects.all(),
        source="recurrence",
        write_only=True
    )

    class Meta:
        model = MeetingOccurrenceOverride
        fields = [
            'id', 'recurrence', 'recurrence_id', 'original_date',
            'overridden_start', 'overridden_end',
            'overridden_location', 'overridden_room'
        ]
        read_only_fields = ['recurrence']


class OrganizationMeetingSerializer(serializers.ModelSerializer):
    # This field handles the incoming organization ID for creating/updating meetings
    organization = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(),
        write_only=True
    )
    # This field is for displaying the organization's name in read operations
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    recurrence = MeetingRecurrenceSerializer(read_only=True)

    class Meta:
        model = OrganizationMeeting
        fields = [
            'id', 'organization', 'organization_name', 'title', 'description',
            'location', 'room', 'start_date', 'start_time', 'end_time',
            'created_at', 'updated_at', 'recurrence'
        ]

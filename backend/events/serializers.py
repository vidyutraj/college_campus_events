from rest_framework import serializers
from .models import Event, EventCategory, RSVP
from organizations.models import Organization
from django.contrib.auth.models import User


class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategory
        fields = ['id', 'name', 'description']


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'description']


class EventSerializer(serializers.ModelSerializer):
    category = EventCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=EventCategory.objects.all(),
        source='category',
        write_only=True,
        required=False,
        allow_null=True
    )
    host_organization = OrganizationSerializer(read_only=True)
    host_organization_id = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(),
        source='host_organization',
        write_only=True,
        required=False,
        allow_null=True
    )
    host_user = serializers.StringRelatedField(read_only=True)
    rsvp_count = serializers.SerializerMethodField()
    user_has_rsvp = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'location', 'room', 'latitude', 'longitude',
            'start_datetime', 'end_datetime', 'modality', 'has_free_food',
            'has_free_swag', 'other_perks', 'category', 'category_id',
            'subcategory', 'host_organization', 'host_organization_id',
            'host_user', 'employers_in_attendance', 'status', 'is_approved',
            'created_at', 'updated_at', 'rsvp_count', 'user_has_rsvp'
        ]
        read_only_fields = ['created_at', 'updated_at', 'host_user']

    def get_rsvp_count(self, obj):
        return obj.rsvps.count()

    def get_user_has_rsvp(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return RSVP.objects.filter(event=obj, user=request.user).exists()
        return False


class RSVPSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)

    class Meta:
        model = RSVP
        fields = ['id', 'event', 'event_title', 'user', 'rsvp_at', 'attended']
        read_only_fields = ['user', 'rsvp_at']


from rest_framework import serializers
from .models import Event, EventCategory, RSVP
from organizations.models import Organization
from django.contrib.auth.models import User


class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategory
        fields = ['id', 'name', 'description']


class MinimalUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'is_staff']


class MinimalOrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'slug', 'description', 'logo', 'is_verified']


class EventSerializer(serializers.ModelSerializer):
    category = EventCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=EventCategory.objects.all(),
        source='category',
        write_only=True,
        required=False,
        allow_null=True
    )
    host_organization = MinimalOrganizationSerializer(read_only=True)
    host_organization_id = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(),
        source='host_organization',
        write_only=True,
        required=False,
        allow_null=True
    )
    host_user = serializers.StringRelatedField(read_only=True)
    
    # Changed field
    rsvp_users = serializers.SerializerMethodField()
    user_has_rsvp = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'location', 'room', 'latitude', 'longitude',
            'start_datetime', 'end_datetime', 'modality', 'has_free_food',
            'has_free_swag', 'other_perks', 'category', 'category_id',
            'subcategory', 'host_organization', 'host_organization_id',
            'host_user', 'employers_in_attendance', 'status', 'is_approved',
            'created_at', 'updated_at', 'rsvp_users', 'user_has_rsvp'
        ]
        read_only_fields = ['created_at', 'updated_at', 'host_user']

    def get_rsvp_users(self, obj):
        """
        Return a list of usernames of users who have RSVPed for this event.
        """
        return [MinimalUserSerializer(rsvp.user).data for rsvp in obj.rsvps.all()]

    def get_user_has_rsvp(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return RSVP.objects.filter(event=obj, user=request.user).exists()
        return False


class RSVPSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    event = EventSerializer(read_only=True)

    class Meta:
        model = RSVP
        fields = ['id', 'event', 'user', 'rsvp_at', 'attended']
        read_only_fields = ['user', 'rsvp_at']


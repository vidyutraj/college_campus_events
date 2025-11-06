from django.contrib import admin
from .models import Event, EventCategory, RSVP


@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'host_organization', 'start_datetime', 'modality', 'status', 'is_approved']
    list_filter = ['status', 'is_approved', 'modality', 'category', 'has_free_food', 'has_free_swag']
    search_fields = ['title', 'description', 'location']
    date_hierarchy = 'start_datetime'
    readonly_fields = ['created_at', 'updated_at']


@admin.register(RSVP)
class RSVPAdmin(admin.ModelAdmin):
    list_display = ['user', 'event', 'rsvp_at', 'attended']
    list_filter = ['attended', 'rsvp_at']
    search_fields = ['user__username', 'event__title']
    date_hierarchy = 'rsvp_at'

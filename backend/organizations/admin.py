from django.contrib import admin
from .models import (
    Organization,
    OrganizationMember,
    OrganizationMeeting,
    MeetingRecurrence,
    MeetingException,
    MeetingOccurrenceOverride
)

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_by', 'is_verified', 'created_at']
    list_filter = ['is_verified', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['is_verified']  # Allow quick editing from list view
    fieldsets = (
        ('Organization Information', {
            'fields': ('name', 'description', 'created_by')
        }),
        ('Verification Status', {
            'fields': ('is_verified', 'created_at', 'updated_at')
        }),
    )
    
    actions = ['verify_organizations', 'unverify_organizations']
    
    def verify_organizations(self, request, queryset):
        """Verify selected organizations"""
        updated = queryset.update(is_verified=True)
        self.message_user(request, f'{updated} organization(s) verified successfully.')
    verify_organizations.short_description = "Verify selected organizations"
    
    def unverify_organizations(self, request, queryset):
        """Unverify selected organizations"""
        updated = queryset.update(is_verified=False)
        self.message_user(request, f'{updated} organization(s) unverified.')
    unverify_organizations.short_description = "Unverify selected organizations"

@admin.register(OrganizationMember)
class OrganizationMemberAdmin(admin.ModelAdmin):
    list_display = ['user', 'organization', 'is_board_member', 'is_leader', 'joined_at']
    list_filter = ['is_board_member', 'is_leader', 'joined_at']
    search_fields = ['user__username', 'organization__name']

@admin.register(OrganizationMeeting)
class OrganizationMeetingAdmin(admin.ModelAdmin):
    list_display = ['title', 'organization', 'start_date']
    list_filter = ['organization', 'start_date']
    search_fields = ['title', 'description', 'location']
    date_hierarchy = 'start_date'


@admin.register(MeetingRecurrence)
class MeetingRecurrenceAdmin(admin.ModelAdmin):
    list_display = ['meeting', 'frequency', 'interval', 'count', 'until']
    list_filter = ['frequency']
    search_fields = ['meeting__title']


@admin.register(MeetingException)
class MeetingExceptionAdmin(admin.ModelAdmin):
    list_display = ['recurrence', 'date', 'note']
    list_filter = ['date']
    search_fields = ['recurrence__meeting__title']


@admin.register(MeetingOccurrenceOverride)
class MeetingOccurrenceOverrideAdmin(admin.ModelAdmin):
    list_display = ['recurrence', 'original_date', 'overridden_start', 'overridden_end']
    list_filter = ['original_date']
    search_fields = ['recurrence__meeting__title']

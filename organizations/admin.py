from django.contrib import admin
from .models import Organization, OrganizationMember


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ['name', 'username', 'created_by', 'is_verified', 'created_at']
    list_filter = ['is_verified', 'created_at']
    search_fields = ['name', 'description', 'username']
    readonly_fields = ['password_hash', 'created_at', 'updated_at']
    list_editable = ['is_verified']  # Allow quick editing from list view
    fieldsets = (
        ('Organization Information', {
            'fields': ('name', 'description', 'username')
        }),
        ('Verification Status', {
            'fields': ('is_verified', 'created_by', 'created_at', 'updated_at')
        }),
        ('Security', {
            'fields': ('password_hash',),
            'classes': ('collapse',)
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

from django.contrib import admin
from .models import StudentProfile, OrganizationLeaderProfile, SiteAdminProfile


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'created_at']
    search_fields = ['user__username', 'name']


@admin.register(OrganizationLeaderProfile)
class OrganizationLeaderProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'organization', 'is_board_member', 'created_at']
    list_filter = ['is_board_member']
    search_fields = ['user__username', 'organization__name']


@admin.register(SiteAdminProfile)
class SiteAdminProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at']
    search_fields = ['user__username']

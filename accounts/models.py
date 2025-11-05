from django.contrib.auth.models import User
from django.db import models


class StudentProfile(models.Model):
    """Profile for student users"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    name = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - Student Profile"


class OrganizationLeaderProfile(models.Model):
    """Profile for organization leaders"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='org_leader_profile')
    organization = models.ForeignKey('organizations.Organization', on_delete=models.CASCADE, related_name='leaders', null=True, blank=True)
    is_board_member = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - Organization Leader"


class SiteAdminProfile(models.Model):
    """Profile for site administrators"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='site_admin_profile')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - Site Admin"

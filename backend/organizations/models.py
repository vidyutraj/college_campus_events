from django.contrib.auth.models import User
from django.db import models

class Organization(models.Model):
    """Student organization/club"""
    name = models.CharField(max_length=255, unique=True)
    slug = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)
    email = models.EmailField(blank=True)
    instagram = models.CharField(max_length=255, blank=True)
    linkedin = models.CharField(max_length=255, blank=True)
    slack = models.URLField(blank=True)
    discord = models.URLField(blank=True)
    logo = models.ImageField(upload_to="org_logos/", blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='created_organizations', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_verified = models.BooleanField(default=False)  # For site admin verification
    
    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class OrganizationMember(models.Model):
    """Members of an organization"""
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organization_memberships')
    is_board_member = models.BooleanField(default=False)
    is_leader = models.BooleanField(default=False)
    role = models.CharField(max_length=255, blank=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['organization', 'user']
        ordering = ['-is_leader', '-is_board_member', 'joined_at']

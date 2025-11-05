from django.contrib.auth.models import User
from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class Organization(models.Model):
    """Student organization/club"""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='created_organizations', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_verified = models.BooleanField(default=False)  # For site admin verification
    
    # Organization credentials
    username = models.CharField(max_length=150, unique=True, null=True, blank=True, help_text="Organization login username")
    password_hash = models.CharField(max_length=128, null=True, blank=True, help_text="Hashed organization password")
    
    def set_password(self, raw_password):
        """Set the organization password"""
        self.password_hash = make_password(raw_password)
        self.save(update_fields=['password_hash'])
    
    def check_password(self, raw_password):
        """Check if the provided password is correct"""
        if not self.password_hash:
            return False
        return check_password(raw_password, self.password_hash)
    
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
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['organization', 'user']
        ordering = ['-is_leader', '-is_board_member', 'joined_at']

from django.contrib.auth.models import User
from django.db import models


class StudentProfile(models.Model):
    """Profile for student users"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    description = models.TextField(blank=True)
    profile_picture = models.ImageField(
        upload_to='profile_pictures/', 
        blank=True, 
        null=True
    )
    pronouns = models.CharField(
        max_length=20,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Student Profile"
        verbose_name_plural = "Student Profiles"

    def __str__(self):
        return f"{self.user.username}'s Profile"

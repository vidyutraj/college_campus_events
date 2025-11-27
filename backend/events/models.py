from django.contrib.auth.models import User
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class EventCategory(models.Model):
    """Event categories (social, academic, professional, etc.)"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Event Categories"
        ordering = ['name']


class Event(models.Model):
    """Campus event"""
    MODALITY_CHOICES = [
        ('in-person', 'In-Person'),
        ('online', 'Online'),
        ('hybrid', 'Hybrid'),
    ]

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('cancelled', 'Cancelled'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    room = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.DecimalField(max_digits=18, decimal_places=14, null=True, blank=True)
    longitude = models.DecimalField(max_digits=18, decimal_places=14, null=True, blank=True)
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    modality = models.CharField(max_length=20, choices=MODALITY_CHOICES, default='in-person')
    
    # Perks
    has_free_food = models.BooleanField(default=False)
    has_free_swag = models.BooleanField(default=False)
    other_perks = models.TextField(blank=True)
    
    # Categories
    category = models.ForeignKey(EventCategory, on_delete=models.SET_NULL, null=True, related_name='events')
    subcategory = models.CharField(max_length=100, blank=True)
    
    # Hosting
    host_organization = models.ForeignKey('organizations.Organization', on_delete=models.SET_NULL, null=True, blank=True, related_name='events')
    host_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='hosted_events')
    
    # Employers/Companies
    employers_in_attendance = models.TextField(blank=True, help_text="List of employers/companies attending")
    
    # Management
    administrators = models.ManyToManyField(User, related_name='administered_events', blank=True)
    
    # Status and moderation
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    is_approved = models.BooleanField(default=False)  # For site admin approval
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['start_datetime']


class RSVP(models.Model):
    """RSVP for an event"""
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='rsvps')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rsvps')
    rsvp_at = models.DateTimeField(auto_now_add=True)
    attended = models.BooleanField(default=False)

    class Meta:
        unique_together = ['event', 'user']
        ordering = ['-rsvp_at']

    def __str__(self):
        return f"{self.user.username} - {self.event.title}"

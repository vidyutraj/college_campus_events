from django.contrib.auth.models import User
from django.db import models

class Organization(models.Model):
    """Student organization/club"""
    name = models.CharField(max_length=255, unique=True)
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

# -------------------------
# Organization Meeting (Base)
# -------------------------
class OrganizationMeeting(models.Model):
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="meetings"
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=200)
    room = models.CharField(max_length=100, blank=True, null=True)
    start_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.organization.name})"

    class Meta:
        ordering = ["start_date"]


# -------------------------
# Meeting Recurrence Rule
# -------------------------
class MeetingRecurrence(models.Model):
    FREQUENCY_CHOICES = [
        ("DAILY", "Daily"),
        ("WEEKLY", "Weekly"),
        ("MONTHLY", "Monthly"),
        ("YEARLY", "Yearly"),
    ]

    meeting = models.OneToOneField(
        OrganizationMeeting,
        on_delete=models.CASCADE,
        related_name="recurrence"
    )
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    interval = models.PositiveIntegerField(default=1)
    byweekday = models.JSONField(blank=True, default=list)
    count = models.PositiveIntegerField(null=True, blank=True)
    until = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Recurrence for {self.meeting.title}"


# -------------------------
# Meeting Exception Dates
# -------------------------
class MeetingException(models.Model):
    recurrence = models.ForeignKey(
        MeetingRecurrence,
        on_delete=models.CASCADE,
        related_name="exceptions"
    )
    date = models.DateField()
    note = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Exception on {self.date} for {self.recurrence.meeting.title}"


# -------------------------
# Meeting Occurrence Overrides
# -------------------------
class MeetingOccurrenceOverride(models.Model):
    recurrence = models.ForeignKey(
        MeetingRecurrence,
        on_delete=models.CASCADE,
        related_name="overrides"
    )
    original_date = models.DateField()
    overridden_start = models.DateTimeField(null=True, blank=True)
    overridden_end = models.DateTimeField(null=True, blank=True)
    overridden_location = models.CharField(max_length=200, blank=True)
    overridden_room = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Override for {self.recurrence.meeting.title} on {self.original_date}"

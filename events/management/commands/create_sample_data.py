from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from events.models import EventCategory, Event
from organizations.models import Organization


class Command(BaseCommand):
    help = 'Creates sample data for testing'

    def handle(self, *args, **options):
        # Create admin user
        admin, created = User.objects.get_or_create(
            username='admin',
            defaults={'email': 'admin@example.com', 'is_staff': True}
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(self.style.SUCCESS('Created admin user (username: admin, password: admin123)'))
        else:
            self.stdout.write(self.style.WARNING('Admin user already exists'))

        # Create categories
        cat1, _ = EventCategory.objects.get_or_create(
            name='Social',
            defaults={'description': 'Social events and gatherings'}
        )
        cat2, _ = EventCategory.objects.get_or_create(
            name='Academic',
            defaults={'description': 'Academic talks and seminars'}
        )
        cat3, _ = EventCategory.objects.get_or_create(
            name='Professional',
            defaults={'description': 'Professional development events'}
        )
        self.stdout.write(self.style.SUCCESS('Created event categories'))

        # Create organizations
        org1, _ = Organization.objects.get_or_create(
            name='Computer Science Club',
            defaults={'created_by': admin, 'is_verified': True}
        )
        org2, _ = Organization.objects.get_or_create(
            name='Student Government',
            defaults={'created_by': admin, 'is_verified': True}
        )
        self.stdout.write(self.style.SUCCESS('Created organizations'))

        # Create events
        now = timezone.now()
        
        event1, created = Event.objects.get_or_create(
            title='Welcome Back Social',
            defaults={
                'description': 'Join us for a fun evening of food, games, and networking!',
                'location': 'Student Center',
                'start_datetime': now + timedelta(days=2),
                'end_datetime': now + timedelta(days=2, hours=3),
                'modality': 'in-person',
                'has_free_food': True,
                'has_free_swag': True,
                'category': cat1,
                'host_organization': org1,
                'host_user': admin,
                'status': 'published',
                'is_approved': True
            }
        )
        
        event2, created = Event.objects.get_or_create(
            title='Tech Talk: AI in 2024',
            defaults={
                'description': 'Learn about the latest developments in artificial intelligence',
                'location': 'Engineering Building Room 101',
                'start_datetime': now + timedelta(days=5),
                'end_datetime': now + timedelta(days=5, hours=2),
                'modality': 'in-person',
                'has_free_food': True,
                'category': cat2,
                'host_organization': org1,
                'host_user': admin,
                'status': 'published',
                'is_approved': True
            }
        )
        
        event3, created = Event.objects.get_or_create(
            title='Career Fair 2024',
            defaults={
                'description': 'Meet with top employers and explore career opportunities',
                'location': 'Convention Center',
                'start_datetime': now + timedelta(days=10),
                'end_datetime': now + timedelta(days=10, hours=6),
                'modality': 'in-person',
                'has_free_swag': True,
                'category': cat3,
                'employers_in_attendance': 'Google, Microsoft, Amazon, Meta',
                'host_organization': org2,
                'host_user': admin,
                'status': 'published',
                'is_approved': True
            }
        )

        self.stdout.write(self.style.SUCCESS('Created sample events'))
        self.stdout.write(self.style.SUCCESS('\nSample data created successfully!'))
        self.stdout.write(self.style.SUCCESS('\nYou can now:'))
        self.stdout.write(self.style.SUCCESS('1. Start Django server: python manage.py runserver'))
        self.stdout.write(self.style.SUCCESS('2. Start React frontend: cd frontend && npm start'))
        self.stdout.write(self.style.SUCCESS('3. Visit http://localhost:3000 to see the dashboard'))


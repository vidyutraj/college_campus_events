from .serializers import StudentProfileSerializer
from .models import StudentProfile

def get_user_organizations(user, request):
    """Return categorized organization memberships for a user."""
    organizations_leader = []
    organizations_board_member = []
    organizations_member = []

    if hasattr(user, 'organization_memberships'):
        from organizations.serializers import OrganizationSerializer
        
        for membership in user.organization_memberships.all():
            org = membership.organization
            org_data = OrganizationSerializer(org, context={'request': request}).data

            if membership.is_leader:
                organizations_leader.append(org_data)
            if membership.is_board_member:
                organizations_board_member.append(org_data)

            organizations_member.append(org_data)

    return {
        'leader': organizations_leader,
        'board_member': organizations_board_member,
        'member': organizations_member,
    }

def get_user_profile_data(user, request=None):
    try:
        profile = StudentProfile.objects.get(user=user)
        return StudentProfileSerializer(profile, context={'request': request}).data
    except StudentProfile.DoesNotExist:
        return None

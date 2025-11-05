from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods


@require_http_methods(["GET"])
@ensure_csrf_cookie
def get_csrf_token(request):
    """Get CSRF token for frontend"""
    from django.middleware.csrf import get_token
    token = get_token(request)
    return JsonResponse({'csrftoken': token})


"""
URL configuration for campus_events project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from .views import get_csrf_token
from django.views.generic import TemplateView, RedirectView

urlpatterns = [
    path('admin', RedirectView.as_view(url='/admin/')),
    path('admin/', admin.site.urls),
    path('api/csrf-token/', get_csrf_token, name='csrf-token'),
    path('api/', include('accounts.urls')),
    path('api/', include('organizations.urls')),
    path('api/', include('events.urls')),
    re_path(r'^(?:.*)/?$', TemplateView.as_view(template_name='index.html')),
]

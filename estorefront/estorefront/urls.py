"""
URL configuration for estorefront project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
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
from django.urls import path

from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import include

from django.views.static import serve # Test to see if I can serve

from items.views import home, ItemToOptionsHandler, ItemListView, ItemDetailsView, EditItemDetailsView, CmsItemListView, CmsItemDetailsView, CMSItemUploadView, TestItemCMSView

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('items/', ItemListView.as_view(), name='items'),
    path('item/<int:item_id>', ItemDetailsView.as_view(), name='item'),
    path('cms_item/options', ItemToOptionsHandler.run, name='item_options'),
    # Nope
    path('cms_items/', CmsItemListView.as_view(), name='cms_items'),
    path('cms_item/<int:item_id>', EditItemDetailsView.as_view(), name='cms_item'),
    path('accounts/', include('django.contrib.auth.urls'))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) \
  + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) # Remove for production

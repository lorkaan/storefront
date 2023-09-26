from django.urls import path

import views

app_name = "items"
urlpatterns = [
    path("store", views.ItemListView.as_view(template_name="listeditem.html")),
    path("cms", views.ItemListView.as_view(template_name="cms_listeditem.html")),
    path("store/<int:item_id>", views.store_item, name="itemdetails")
]
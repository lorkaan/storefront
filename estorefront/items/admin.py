from django.contrib import admin

# Register your models here.
from .models import Item, Option, OptionValue, ItemOptionValue, ItemOptionValueImage

admin.site.register(Item)
admin.site.register(Option)
admin.site.register(OptionValue)
admin.site.register(ItemOptionValue)
admin.site.register(ItemOptionValueImage)
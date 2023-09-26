from django.shortcuts import render
from django.views import generic

from django.http import Http404

from .models import Item, Option, OptionValue, ItemOptionValue, ItemOptionValueImage
from utils.utils import merge_dictionary_list

# Create your views here.

class ItemListView(generic.ListView):
    model = Item
    template_name = "listeditem.html"

"""
A detailed look at a single item given by an id
"""
def store_item(request, item_id):
    try:
        item = Item.objects.filter(id=item_id).values("name", "description").get()
    except Item.DoesNotExist:
        raise Http404("Item does not exist")

    try:
        custom_options = list(ItemOptionValue.objects.filter(item__id=item_id).order_by("option__name").values("id", "option__name", "optionvalue__value", "available", "defaultoption"))
    except ItemOptionValue.DoesNotExist:
        raise Http404("Item has no options")
    name = None
    options_dict = {}
    cur_dict = {}
    for custom_dict in custom_options:
        if custom_dict["option__name"] != name:
            name = custom_dict["option__name"]
            options_dict[name] = []
        cur_dict = custom_dict.copy()
        try:
            pic_queryset = ItemOptionValueImage.objects.filter(itemoptionvalue__id=custom_dict['id'])
        except ItemOptionValueImage.DoesNotExist:
            pic_queryset = []
        cur_dict["pics"] = pic_queryset
        options_dict[name].append(cur_dict)

    return render(request, "itemdetails.html", {"item": item, "options": options_dict})

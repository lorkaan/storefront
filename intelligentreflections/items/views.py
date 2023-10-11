from django.shortcuts import render
from django.views import generic, View

from django.http import Http404, JsonResponse

from .models import Item, Option, OptionValue, ItemOptionValue, ItemOptionValueImage
from utils.utils import merge_dictionary_list

from .forms import ItemEditForm, ItemOptionValueForm

# Create your views here.

class ItemListView(generic.ListView):
    model = Item
    template_name = "listeditem.html"

class CmsItemListView(ItemListView):
    template_name = "cms_listeditem.html"

class ItemDetailsView(View):
    template_name = "itemdetails.html"

    def get(self, request, item_id):
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

        return render(request, self.__class__.template_name, {"item": item, "options": options_dict})


class CmsItemDetailsView(ItemDetailsView):
    template_name = "cms_itemdetails.html"

class CMSItemUploadView(View):
    template_name = "update_item.html"

    def post(self, request, **kwargs):
        data = request.POST
        print(data)
        return render(request, self.__class__.template_name, data)

class ItemDetailsData:
    template_name = "test_cms.html"

    def post(self, request, **kwargs):
        data = request.POST
        return JsonResponse(data)

def test_itemoptionvalue_form(request):

    form = ItemOptionValueForm()
    return render(request, "test/test_itemoptionvalue_form.html", {"form": form})

class TestItemCMSView(View):

    template_name = "test/test__itemoptionvalue_form.html"

    def post(self, request, item_id):
        try:
            item = Item.objects.filter(id=item_id).values("name", "description", "price").get()
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
            options_dict[name].append(cur_dict)

        return JsonResponse({"item": item, "option_forms": options_dict})

    def get(self, request, item_id):
        # Just passing the id to the javascript to do the actual post and form handling
        return render(request, self.__class__.template_name, {"item_id": item_id})

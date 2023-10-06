from django import forms
from .models import Item, Option, OptionValue, ItemOptionValue, ItemOptionValueImage

"""
class CustomOptionsField(forms.MultiValueField):
    def __init__(self, **kwargs):
        # fields needs to be initiated
        pass

    def compress(self, data_list):
        return ":".join(data_list)

class EditItemForm(forms.Form):
    name = forms.CharField(min_length=1, required=True, label="Name")
    description = forms.CharField(label="Description")

class DisplayItemForm(forms.Form):
    name = forms.CharField(min_length=1, required=True, label="Name")
    description = forms.CharField(label="Description")

class CustomOptionForm(forms.Form):
    options = forms.ModelChoiceField(queryset=ItemOptionValueImage.objects.none())
"""

class ItemEditForm(forms.ModelForm):
    class Meta:
        model = Item
        fields = ["id", "name", "description", "price"]
        widgets = {
            'name': forms.TextInput()
        }


class ItemOptionValueForm(forms.ModelForm):
    class Meta:
        model = ItemOptionValue
        fields = ["id", "item", "option", "optionvalue", "available", "defaultoption", "pricechange"]
from django.db import models

pics_directory = "images/"

# Create your models here.

""" 
This represents an Item in the Store.

"""
class Item(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField(unique=True)
    description = models.TextField(default="")
    price = models.PositiveIntegerField(default=0)


"""
This defines all possible options available

Universal Set
"""
class Option(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField(unique=True)

""" 
This defines the various values for multi-choice items

If a value is not specified (Boolean choices) then there
should be no entry in this model.
"""
class OptionValue(models.Model):
    id = models.AutoField(primary_key=True)
    value = models.TextField(unique=True)

""" 
This links Options and their values to actual Items

Null optionvalue ForeignKey means that there is multiple choice for 
that option and it is instead a boolean choice or checkbox
"""
class ItemOptionValue(models.Model):
    # Neccessary only for linking multiple images to a single row (aka item/option/value tuple)
    id = models.AutoField(primary_key=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    option = models.ForeignKey(Option, on_delete=models.CASCADE)

    # Null Values here mean that the Option is a boolean 
    optionvalue = models.ForeignKey(OptionValue, on_delete=models.CASCADE, blank=True, null=True)
    
    # Simple Boolean field for determining if that option is available or not
    available = models.BooleanField(default=True, null=False)
    defaultoption = models.BooleanField(default=False, null=False)

    pricechange = models.IntegerField(default=0, null=False)

    class Meta:
        unique_together = ("item", "option", "optionvalue")

""" 
This table handles Pictures for a given Item/Option/Value tuple.

Necessary as a single tuple could have multiple Images
"""
class ItemOptionValueImage(models.Model):
    itemoptionvalue = models.ForeignKey(ItemOptionValue, on_delete=models.CASCADE)

    # This indicates the picture to use for the unique item/option/value tuple
    # Pictures are technically optional, but practically necessary
    photo = models.ImageField(upload_to=pics_directory, blank=True, null=True)

    class Meta:
        unique_together = ("itemoptionvalue", "photo")


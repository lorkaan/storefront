# storefront
A custom Storefront along with the Content Management System. 
Made using Django and vanilla JavaScript.

The idea is provide an e-store system for companies to display services or products that has a simple Content Management System employees can use to update the e-store without requiring technical expertise.

Buyers are able to browse items for sale, customize desired items based on a few options (colour, size, etc.) and send an order to a seller. (Payment system and stock tracking is not currently in scope)

Sellers are able to use a provided Content Management System for creating entries for items to sell. They are able to set up arbitrary customization options for these items. Additionally, these entries are able to be edited after creation to make customization options unavailable

# Frameworks
This project does not use any JavaScript frameworks so I can explore/experiment with JavaScript implementations of Mixins and to give me full control over the User Interface and server communication.

# In Development
Not ready for deployment yet. Still being developed and tested. Currently shifting some of the User Interface builders to a set custom React-like JavaScript objects in order to explore Mixins and enable arbitrary sets of customizable options in the Content Management system. 

# Required 
Pipenv
Python 3.9

All subsequent commands listed are assumed to run from the cloned repo

# Setup

```
pipenv shell
pip install
```

This will create a virtual environment and download the required packages

# Run
`pipenv shell` if not already done to change your terminal into the virtual evnironment created during setup

`python manage.py runserver` will start the django server on a test environment

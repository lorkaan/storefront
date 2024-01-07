# Generated by Django 4.2.5 on 2023-09-22 20:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Material',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.TextField()),
                ('in_stock', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='ItemMaterial',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='items.item')),
                ('material', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='items.material')),
            ],
        ),
    ]
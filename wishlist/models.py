# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

from ezi.views import model_crud_api_view_factory

from main.models import TeamMember

class Wishlist(models.Model):
    """
    Model that represents a list of items for a given category or event needed
    or desired by the Cru team. This contains a list of ItemRequests.

    Attributes:
        created_by          The TeamMember that created this wishlist.

        name                The name of this wishlist. This can be used by the
                            user for identifying a wishlist.

        purpose             Why this wishlist was created. This may contain what
                            event the equipment is for.

        date_started        When this wishlist was created.

        active              Whether or not this wishlist still needs to be
                            fulfilled.

        date_inactive       If this wishlist was activated, this is the last
                            date that it was deactivated.

        date_complete       If this wishlist was completed, this is the date
                            that it was completed.

        comments            Any extra information that the creator of this
                            wishlist wants other team members to know about this
                            wishlist.

        permenant           Whether or not this wishlist is a root wishlist that
                            should never be deleted
    """
    @classmethod
    def crud_api_view(cls): return model_crud_api_view_factory(cls)

    created_by = models.ForeignKey(TeamMember, null=True, blank=True)
    name = models.CharField(max_length=20)
    purpose = models.CharField(max_length=100)
    date_started = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)
    date_inactive = models.DateTimeField(null=True, blank=True)
    date_complete = models.DateTimeField(null=True, blank=True)
    comments = models.TextField(null=True, blank=True)
    permenant = models.BooleanField(default=False)

    def json(self):
        return {
            "created_by": str(self.created_by),
            "name": self.name,
            "purpose": self.purpose,
            "date_started": self.date_started,
            "active": self.active,
            "date_inactive": self.date_inactive,
            "date_complete": self.date_complete,
            "comments": self.comments,
            "permenant": self.permenant
        }

    def __str__(self):
        return "{this.name} <- {this.created_by.full_name}".format(this=self)


class ItemRequest(models.Model):
    """
    Model that represents a specific item that is needed or wanted by a member
    of the Cru team.

    Attributes:
        belongs_to              The wishlist that this item request corresponds
                                to.

        requested_by            The TeamMember that requested this item.

        name                    The name of this item. This can be used by the
                                user for identifying an item.

        description             Description of the item. This includes things
                                like color, specific brands and other things.

        notes                   Extra notes supplied by the team member
                                requesting this item.

        online_order_links      A comma separated list of links to web pages
                                that this item can be bought on.

        quantity                The number of these items that are needed or
                                wanted.

        priority                A decimal designating how much this item is
                                needed. The decimal part of this number
                                represents a sub-priority. It's more refined.

        date_requested          When this item was requested.

        needed                  Whether or not Cru actually needs this item.
    """
    ONLINE_ORDER_LINKS_DELIMITER = "|,|"

    belongs_to = models.ForeignKey(Wishlist)
    requested_by = models.ForeignKey(TeamMember)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=100)
    notes = models.TextField(null=True, blank=True)
    online_order_links = models.TextField(null=True, blank=True)
    quantity = models.PositiveIntegerField()
    priority = models.DecimalField(max_digits=2, decimal_places=1)
    date_requested = models.DateTimeField(auto_now_add=True)
    needed = models.BooleanField(default=True)

    @property
    def order_links_list(self):
        """
        Splits the delimited string value of online_order_links into a list of
        links. The value for online_order_links is expected to be a string that
        has one or more http links separated by the value of the delimiter,
        ONLINE_ORDER_LINKS_DELIMITER.

        This property returns the fields value, parsed into a list of just the
        http links.
        """
        links = []
        if self.online_order_links:
            for link in self.online_order_links.split(self.ONLINE_ORDER_LINKS_DELIMITER):
                links.append(link)
        return links

    def __str__(self):
        return "{this.name} in wishlist: {this.belongs_to.name}".format(this=self)


class ItemRecord(models.Model):
    """
    Model that represents an action taken for a specific ItemRequest. This can
    represent the action of buying the item or other decisions about the item.

    Attributes:
        reported_by     The TeamMember that took this action.

        is_for          The ItemRequest that this record is for.

        item_type       The type of action that was taken in this record. This
                        can be things such as buying it or deciding it's not
                        needed.

        comments        Extra notes supplied by the team member that reported
                        this record.

        cost            The amount of money that this item was bought for if it
                        was bought.
    """
    # The different types of records that a given item can represent. These are
    # the options used in the field item_type.
    RECORD_TYPES = (
        ("un", "Unnecessary"),
        ("bt", "Bought"),
        ("ah", "Already Have")
    )

    RECORD_TYPES_DICT = dict(RECORD_TYPES)

    reported_by = models.ForeignKey(TeamMember)
    is_for = models.ForeignKey(ItemRequest)
    item_type = models.CharField(max_length=2, choices=RECORD_TYPES)
    comments = models.TextField(null=True, blank=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    date_reported = models.DateTimeField(auto_now_add=True)

    @property
    def nice_item_type(self):
        """Returns the english version of the item type."""
        return self.RECORD_TYPES_DICT[self.item_type]

    @property
    def message(self):
        """
        Returns the message to be displayed for this record. Depending on what
        type of record it is, the message will be in a different format.
        """
        if self.item_type == "un":
            return "marked this as not needed"
        elif self.item_type == "bt":
            return "bought this for ${:,.2f}".format(self.cost)
        else:
            return "says we aleady have this"

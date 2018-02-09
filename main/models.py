# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth.models import User, Group
from django.db import models

# The names of groups that represent different roles that a TeamMember can
# fulfill.
#
# The format of the tuple for each role is as follows:
#     index:
#         0 - Identifying group name (the name of the group that represents this
#         role)
#         1 - English name that describes this role.
MEMBER_ROLES = {
    "STUDENT": ("cru | role | Student leader", "Student Leader"),
    "STAFF": ("cru | role | Staff member", "Staff Member"),
}

class TeamMember(User):
    """
    A proxy model for the Django User model This provides methods that handel
    logic having to do with roles and permissions.
    """

    class Meta:
        proxy = True

    @property
    def role(self):
        """
        Returns the role that this TeamMember fulfills. The Group object that
        represents this team members role is returned.

        If both roles are represent, the STAFF role is returned.
        """
        if self.groups.filter(name=MEMBER_ROLES["STAFF"][0]).exists():
            return self.groups.get(name=MEMBER_ROLES["STAFF"][0])
        elif self.groups.filter(name=MEMBER_ROLES["STUDENT"][0]).exists():
            return self.groups.get(name=MEMBER_ROLES["STUDENT"][0])
        else:
            return None

    @property
    def role_name(self):
        """
        Returns the role that this TeamMember fulfills. The name of the role in
        an English string is returned that can be displayed and read by a user.

        If both roles are represent, the STAFF role is returned.
        """
        if self.groups.filter(name=MEMBER_ROLES["STAFF"][0]).exists():
            return MEMBER_ROLES["STAFF"][1]
        elif self.groups.filter(name=MEMBER_ROLES["STUDENT"][0]).exists():
            return MEMBER_ROLES["STUDENT"][1]
        else:
            return None

    @role.setter
    def role(self, role):
        """
        Adds the given role to this TeamMember by adding the corresponding group
        to the users group sets.

        Parameters:
            role - A string that is one of the keys in MEMBER_ROLES. This will
            be used to get the group name from MEMBER_ROLES to get the group.
        """
        groups = Group.objects.filter(name__contains="| role |")
        if role is None: self.groups.remove(*groups); return
        if not role in MEMBER_ROLES.keys():
            raise ValueError("No role with identifyer '{0}' found. Must be one of ['{1}'].".format(
                            str(role), "', '".join(MEMBER_ROLES.keys())))
        else:
            self.groups.add(Group.objects.get(name=MEMBER_ROLES[role][0]))

    @property
    def is_cru_student(self):
        """Determines whether or not the user is a student leader in Cru."""
        return self.groups.filter(name=MEMBER_ROLES["STUDENT"][0]).exists()

    @property
    def is_cru_staff(self):
        """Determines whether or not the user is a staff member in Cru."""
        return self.groups.filter(name=MEMBER_ROLES["STAFF"][0]).exists()

    @property
    def full_name(self):
        return "{} {}".format(self.first_name, self.last_name)

from django.core.management import call_command
from django.core.urlresolvers import reverse
from django.db import models
from django.test import TestCase, Client
from django.test.utils import override_settings
from django.utils.dateparse import parse_date

class DocumentationTestCase(TestCase):

    def setUp(self):
        self.client = Client()

    def tearDown(self):
        self.client = None

    def test_site_statement_200_response(self):
        """Ensures that the site_statement page returns a status code of 200."""
        url = reverse("main:site_statement")
        response = self.client.get(url, {})
        self.assertEqual(response.status_code, 200)

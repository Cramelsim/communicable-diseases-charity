from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import User
from diseases.models import Area, Disease


class DonationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('amina', 'a@x.org', 'pw-S3cure!')
        self.other = User.objects.create_user('joe', 'j@x.org', 'pw-S3cure!')
        self.admin = User.objects.create_user('boss', 'b@x.org', 'pw-S3cure!', role='admin')
        self.area = Area.objects.create(name='Kisumu', country='Kenya', latitude=0, longitude=34)
        self.disease = Disease.objects.create(name='Malaria', description='x')

    def donate(self, **extra):
        return self.client.post('/api/donations/', {'area': self.area.id, 'amount': '25.00', **extra})

    def test_login_required(self):
        self.assertEqual(self.donate().status_code, 401)

    def test_create_donation(self):
        self.client.force_authenticate(self.user)
        res = self.donate(disease=self.disease.id, message='Stay strong')
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data['status'], 'completed')
        self.assertEqual(res.data['donor_name'], 'amina')

    def test_rejects_small_amount(self):
        self.client.force_authenticate(self.user)
        self.assertEqual(self.donate(amount='0.50').status_code, 400)

    def test_users_only_see_their_own(self):
        self.client.force_authenticate(self.user)
        self.donate()
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.get('/api/donations/').data['count'], 0)
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.get('/api/donations/').data['count'], 1)

    def test_anonymous_hides_name_and_totals_are_public(self):
        self.client.force_authenticate(self.user)
        self.assertEqual(self.donate(anonymous=True).data['donor_name'], 'Anonymous')
        self.client.force_authenticate(None)
        res = self.client.get('/api/donations/totals/')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(float(res.data[0]['total']), 25.0)

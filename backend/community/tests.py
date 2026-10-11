from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import User
from diseases.models import Area, Disease, DiseaseAreaStat


class HelpReviewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('amina', 'a@x.org', 'pw-S3cure!')
        self.other = User.objects.create_user('joe', 'j@x.org', 'pw-S3cure!')
        self.disease = Disease.objects.create(name='Malaria', description='x')
        self.area = Area.objects.create(name='Kisumu', country='Kenya', latitude=0, longitude=34)
        self.unrelated = Area.objects.create(name='Lagos', country='Nigeria', latitude=6, longitude=3)
        DiseaseAreaStat.objects.create(disease=self.disease, area=self.area, cases=10)
        self.payload = {'disease': self.disease.id, 'area': self.area.id, 'comment': 'I can distribute nets.', 'rating': 5}

    def test_anonymous_cannot_post_but_can_read(self):
        self.assertEqual(self.client.post('/api/reviews/', self.payload).status_code, 401)
        self.assertEqual(self.client.get('/api/reviews/').status_code, 200)

    def test_create_assigns_current_user(self):
        self.client.force_authenticate(self.user)
        res = self.client.post('/api/reviews/', self.payload)
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data['username'], 'amina')

    def test_rejects_disease_not_present_in_area(self):
        self.client.force_authenticate(self.user)
        res = self.client.post('/api/reviews/', {**self.payload, 'area': self.unrelated.id})
        self.assertEqual(res.status_code, 400)

    def test_rejects_invalid_rating(self):
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.post('/api/reviews/', {**self.payload, 'rating': 9}).status_code, 400)

    def test_only_owner_can_edit(self):
        self.client.force_authenticate(self.user)
        pk = self.client.post('/api/reviews/', self.payload).data['id']
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.patch(f'/api/reviews/{pk}/', {'comment': 'hacked'}).status_code, 403)

    def test_filter_by_area(self):
        self.client.force_authenticate(self.user)
        self.client.post('/api/reviews/', self.payload)
        res = self.client.get(f'/api/reviews/?area={self.unrelated.id}')
        self.assertEqual(res.data['count'], 0)

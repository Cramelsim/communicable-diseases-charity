from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import User

from .models import Area, Disease, DiseaseAreaStat


class DiseaseApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user('boss', 'b@x.org', 'pw-S3cure!', role='admin')
        self.user = User.objects.create_user('amina', 'a@x.org', 'pw-S3cure!')
        self.malaria = Disease.objects.create(name='Malaria', description='Mosquito-borne')
        self.cholera = Disease.objects.create(name='Cholera', description='Water-borne')
        self.kisumu = Area.objects.create(name='Kisumu', country='Kenya', latitude=-0.09, longitude=34.76, population=500000)
        self.turkana = Area.objects.create(name='Turkana', country='Kenya', latitude=3.1, longitude=35.6, population=900000)
        DiseaseAreaStat.objects.create(disease=self.malaria, area=self.kisumu, cases=1000, deaths=10, recovered=900)
        DiseaseAreaStat.objects.create(disease=self.malaria, area=self.turkana, cases=500)
        DiseaseAreaStat.objects.create(disease=self.cholera, area=self.turkana, cases=200)

    def test_anyone_can_list_diseases_ordered_by_prevalence(self):
        res = self.client.get('/api/diseases/')
        self.assertEqual(res.status_code, 200)
        names = [d['name'] for d in res.data['results']]
        self.assertEqual(names, ['Malaria', 'Cholera'])
        self.assertEqual(res.data['results'][0]['total_cases'], 1500)

    def test_disease_detail_lists_affected_areas(self):
        res = self.client.get(f'/api/diseases/{self.malaria.id}/')
        self.assertEqual(len(res.data['areas']), 2)

    def test_areas_ordered_by_most_affected(self):
        res = self.client.get('/api/areas/')
        self.assertEqual(res.data['results'][0]['name'], 'Kisumu')

    def test_area_detail_lists_diseases(self):
        res = self.client.get(f'/api/areas/{self.turkana.id}/')
        self.assertEqual({d['disease_name'] for d in res.data['diseases']}, {'Malaria', 'Cholera'})

    def test_regular_user_cannot_write(self):
        self.client.force_authenticate(self.user)
        res = self.client.post('/api/diseases/', {'name': 'TB', 'description': 'x'})
        self.assertEqual(res.status_code, 403)

    def test_anonymous_cannot_write(self):
        self.assertEqual(self.client.post('/api/areas/', {}).status_code, 401)

    def test_admin_disease_crud(self):
        self.client.force_authenticate(self.admin)
        res = self.client.post('/api/diseases/', {'name': 'TB', 'description': 'Lung infection'})
        self.assertEqual(res.status_code, 201)
        pk = res.data['id']
        self.assertEqual(self.client.patch(f'/api/diseases/{pk}/', {'severity': 'high'}).status_code, 200)
        self.assertEqual(self.client.delete(f'/api/diseases/{pk}/').status_code, 204)

    def test_admin_area_crud(self):
        self.client.force_authenticate(self.admin)
        res = self.client.post('/api/areas/', {
            'name': 'Mombasa', 'country': 'Kenya', 'latitude': '-4.04', 'longitude': '39.66', 'population': 1200000,
        })
        self.assertEqual(res.status_code, 201)
        pk = res.data['id']
        self.assertEqual(self.client.patch(f'/api/areas/{pk}/', {'population': 1300000}).status_code, 200)
        self.assertEqual(self.client.delete(f'/api/areas/{pk}/').status_code, 204)

    def test_stat_rejects_deaths_exceeding_cases(self):
        self.client.force_authenticate(self.admin)
        res = self.client.post('/api/stats/', {
            'disease': self.cholera.id, 'area': self.kisumu.id, 'cases': 5, 'deaths': 10,
        })
        self.assertEqual(res.status_code, 400)

    def test_map_data_and_disease_filter(self):
        res = self.client.get('/api/map/')
        self.assertEqual(res.data[0]['name'], 'Kisumu, Kenya')
        self.assertEqual(res.data[0]['intensity'], 1.0)
        res = self.client.get(f'/api/map/?disease={self.cholera.id}')
        self.assertEqual([m['name'] for m in res.data], ['Turkana, Kenya'])

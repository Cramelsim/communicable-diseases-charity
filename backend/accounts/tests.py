from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from .models import User


class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_creates_regular_user_even_if_role_sent(self):
        res = self.client.post(reverse('register'), {
            'username': 'amina', 'email': 'a@x.org', 'password': 'S3cure-pass!', 'role': 'admin',
        })
        self.assertEqual(res.status_code, 201)
        self.assertEqual(User.objects.get(username='amina').role, 'user')

    def test_login_returns_tokens_and_user(self):
        User.objects.create_user('amina', 'a@x.org', 'S3cure-pass!')
        res = self.client.post(reverse('login'), {'username': 'amina', 'password': 'S3cure-pass!'})
        self.assertEqual(res.status_code, 200)
        self.assertIn('access', res.data)
        self.assertEqual(res.data['user']['username'], 'amina')

    def test_me_requires_auth(self):
        self.assertEqual(self.client.get(reverse('me')).status_code, 401)


class AdminUserTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user('boss', 'b@x.org', 'S3cure-pass!', role='admin')
        self.user = User.objects.create_user('amina', 'a@x.org', 'S3cure-pass!')
        self.client = APIClient()

    def test_regular_user_cannot_list_users(self):
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.get('/api/users/').status_code, 403)

    def test_admin_can_create_user_and_change_role(self):
        self.client.force_authenticate(self.admin)
        res = self.client.post('/api/users/', {
            'username': 'new', 'email': 'n@x.org', 'password': 'S3cure-pass!', 'role': 'admin',
        })
        self.assertEqual(res.status_code, 201)
        res = self.client.patch(f'/api/users/{self.user.id}/', {'role': 'admin'})
        self.assertEqual(res.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.role, 'admin')

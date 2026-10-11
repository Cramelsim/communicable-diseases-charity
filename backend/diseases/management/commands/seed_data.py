from django.core.management.base import BaseCommand

from accounts.models import User
from diseases.models import Area, Disease, DiseaseAreaStat

DISEASES = [
    ('Malaria', 'high', 'Parasitic infection spread by Anopheles mosquitoes.',
     'Fever, chills, headache, sweating, fatigue.', 'Bites from infected female Anopheles mosquitoes.',
     'Insecticide-treated nets, indoor spraying, preventive medication, draining standing water.',
     'Artemisinin-based combination therapy.'),
    ('Tuberculosis', 'high', 'Bacterial infection that mainly affects the lungs.',
     'Persistent cough, weight loss, night sweats, fever.', 'Airborne droplets from people with active TB.',
     'BCG vaccination, early diagnosis, ventilation, completing treatment.', 'Months-long multi-drug antibiotic course.'),
    ('Cholera', 'critical', 'Acute diarrhoeal infection caused by Vibrio cholerae.',
     'Severe watery diarrhoea, vomiting, dehydration.', 'Contaminated water or food.',
     'Safe water, sanitation, handwashing, oral cholera vaccine.', 'Oral rehydration solution; antibiotics in severe cases.'),
    ('HIV/AIDS', 'high', 'Virus that attacks the immune system.',
     'Flu-like illness early on; opportunistic infections later.', 'Unprotected sex, shared needles, mother-to-child.',
     'Condoms, PrEP, testing, safe blood supply.', 'Lifelong antiretroviral therapy.'),
    ('Measles', 'moderate', 'Highly contagious viral disease.',
     'Fever, rash, cough, runny nose, red eyes.', 'Airborne and contact with infected secretions.',
     'Two-dose MMR/measles vaccination.', 'Supportive care and vitamin A.'),
]

AREAS = [
    ('Kisumu', 'Kenya', 0.0917, 34.7680, 610000), ('Turkana', 'Kenya', 3.1190, 35.5970, 926000),
    ('Kampala', 'Uganda', 0.3476, 32.5825, 1680000), ('Kinshasa', 'DR Congo', -4.4419, 15.2663, 14300000),
    ('Lagos', 'Nigeria', 6.5244, 3.3792, 15400000), ('Dhaka', 'Bangladesh', 23.8103, 90.4125, 10200000),
]

# (disease, area, cases, deaths, recovered)
STATS = [
    ('Malaria', 'Kisumu', 52000, 410, 50000), ('Malaria', 'Kampala', 38000, 300, 36500),
    ('Malaria', 'Kinshasa', 91000, 1200, 86000), ('Malaria', 'Lagos', 120000, 1900, 114000),
    ('Tuberculosis', 'Kinshasa', 24000, 2100, 15000), ('Tuberculosis', 'Dhaka', 31000, 2600, 21000),
    ('Cholera', 'Turkana', 4800, 90, 4600), ('Cholera', 'Kinshasa', 9100, 260, 8700),
    ('Cholera', 'Dhaka', 12500, 150, 12200), ('HIV/AIDS', 'Kisumu', 41000, 900, 0),
    ('HIV/AIDS', 'Kampala', 56000, 1100, 0), ('Measles', 'Turkana', 2300, 40, 2200),
    ('Measles', 'Lagos', 7400, 120, 7100),
]


class Command(BaseCommand):
    help = 'Load sample diseases, areas and statistics, plus an admin account.'

    def handle(self, *args, **options):
        diseases = {}
        for name, sev, desc, symptoms, transmission, prevention, treatment in DISEASES:
            diseases[name], _ = Disease.objects.update_or_create(name=name, defaults=dict(
                severity=sev, description=desc, symptoms=symptoms,
                transmission=transmission, prevention=prevention, treatment=treatment))
        areas = {}
        for name, country, lat, lng, pop in AREAS:
            areas[name], _ = Area.objects.update_or_create(name=name, country=country, defaults=dict(
                latitude=lat, longitude=lng, population=pop,
                description=f'{name} is a high-priority area for communicable disease response.'))
        for d, a, cases, deaths, recovered in STATS:
            DiseaseAreaStat.objects.update_or_create(
                disease=diseases[d], area=areas[a],
                defaults=dict(cases=cases, deaths=deaths, recovered=recovered))
        if not User.objects.filter(username='admin').exists():
            User.objects.create_user('admin', 'admin@example.org', 'admin12345', role='admin')
            self.stdout.write('Created admin user: admin / admin12345 (change this!)')
        self.stdout.write(self.style.SUCCESS('Sample data loaded.'))

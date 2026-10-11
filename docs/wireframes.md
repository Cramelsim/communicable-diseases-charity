# Wireframes (mobile-first)

Low-fidelity layouts to recreate in Figma. Frame size: 375×812 (mobile), then 1024 wide (desktop).
Primary green `#0B6E4F`, 44px minimum touch targets, one-column layouts on mobile.

## 1. Login / Sign up
```
┌─────────────────────┐
│ 🩺 Health Aid    ☰  │
├─────────────────────┤
│ Log in              │
│ [ Username        ] │
│ [ Password        ] │
│ [    Log in       ] │
│ New here? Sign up   │
└─────────────────────┘
```

## 2. Diseases list (home)
```
┌─────────────────────┐
│ 🩺 Health Aid    ☰  │
│ Most prevalent      │
│ diseases            │
│ [ Search…         ] │
│ ┌─────────────────┐ │
│ │ #1 Malaria  HIGH│ │
│ │ 301,000 cases   │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ #2 Cholera CRIT │ │
│ └─────────────────┘ │
└─────────────────────┘
```

## 3. Disease detail
Title + severity badge → description → Symptoms / How it spreads / Prevention / Treatment →
"Most affected areas" cards (links to area) → **View on map** button.

## 4. Areas list and Area detail
List ranked by total cases. Detail: description, population, per-disease stats cards,
**View on map** + **Donate** buttons, then "How would you like to help?" form and community ideas.

## 5. Map analysis
```
┌─────────────────────┐
│ Disease impact map  │
│ [ Filter: disease ▾]│
│ ┌─────────────────┐ │
│ │   ●      ◉      │ │  circle size/colour = case count
│ │      ●          │ │
│ └─────────────────┘ │
│ Area | Cases | /100k│
└─────────────────────┘
```

## 6. Donate
Area select → optional disease → preset chips ($5 $10 $25 $50) → amount → message →
anonymous checkbox → **Donate**; below, "Your donations" history.

## 7. Admin
Nav items: Manage diseases / areas / users. Each screen: **Add** button, inline form card,
list rows with **Edit** / **Delete**. Users screen includes a role select (user / admin).

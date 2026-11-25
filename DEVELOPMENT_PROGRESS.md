# AI-Based Child Growth & Nutrition Monitoring System for Rural Healthcare
## Frontend Development Progress & Architectural Documentation

### Project Summary
- **Project Name:** AI-Based Child Growth & Nutrition Monitoring System for Rural Healthcare
- **Domain:** Rural Public Healthcare, POSHAN Abhiyaan, Anganwadi Frontline Worker Assistance, Paediatric Malnutrition Triage
- **Context:** Design Thinking & Innovation Final-Year College Project Demonstration
- **Theme:** Clean, modern healthcare light theme (`#245B49`, `#A8D8C5`, `#DDEBB1`, `#F7F9F7`, `#FFFFFF`)
- **Technology Stack:** React 18, JavaScript, Bootstrap 5, Lucide React, Chart.js / React-Chartjs-2, React Router DOM v6, Canvas Confetti, LocalStorage persistence

---

### Implementation Status Matrix

| Module / Screen | Route | Status | Key Features Completed |
| :--- | :--- | :--- | :--- |
| **Authentication & Role Switcher** | `/login` | Completed | Light theme branding, show/hide password, remember me, 1-click demo profiles (Anganwadi, Doctor, Supervisor), forgot password OTP flow |
| **App Layout & Navigation** | App Shell | Completed | Responsive collapsible sidebar, top navigation bar with active breadcrumbs, unread alert badges, live date, global search |
| **Executive Dashboard** | `/dashboard` | Completed | Real-time KPIs (Total Screened, SAM count, MAM count, Stunted, Normal), Chart.js Doughnut nutrition distribution, Bar chart village coverage, critical SAM alert banner |
| **Child Registration** | `/register` | Completed | Demographic fields, maternal profile, auto-calculated age, MUAC tape with visual marker, bilateral pitting edema switch, real-time AI WHO Z-Score calculator preview, celebration confetti |
| **Growth Measurement** | `/measurement` | Completed | Longitudinal visit logger, automated WAZ / HAZ / WHZ recalculation, growth velocity indicator (weight gain vs faltering alert), appetite test, clinical diagnosis box |
| **Nutritional Assessment** | `/assessment` | Completed | 24-hour Infant and Young Child Feeding (IYCF) recall, Dietary Diversity Score (out of 4 food groups), physical signs checklist (pallor, hair changes, dermatosis, diarrhea), AI deficiency detector |
| **WHO Growth Monitoring** | `/monitoring` | Completed | Interactive Chart.js WHO percentiles (Median, -2SD MAM, -3SD SAM) for Weight-for-Age (Underweight) & Height-for-Age (Stunting), child trajectory dots, printable growth curve |
| **Alerts & Reminders** | `/alerts` | Completed | Triage center categorized by SAM Critical, MAM Warning, and Vaccine Reminders; 1-click resolve, SMS dispatch simulation to mother/ASHA, emergency NRC referral trigger |
| **Nutrition Guidance** | `/guidance` | Completed | Indigenous, high-energy rural food recipes (Amrutham poshan laddu, moringa khichdi, chana sattu, sweet potato mash), clinical dos & don'ts, age-specific time-of-day rural feeding schedules |
| **Child History & Log** | `/history` | Completed | Longitudinal milestone timeline, interactive child selector, UIP immunization tracker checklist, editable observations, delete modal |
| **Health Cards & Reports** | `/reports` | Completed | Official POSHAN Anganwadi Monthly Progress Report (MPR), printable Mother & Child Protection (MCP) card with signature blocks, emergency NRC referral slip, CSV export |
| **System Settings** | `/settings` | Completed | Anganwadi Center profile settings, simulated rural offline synchronization engine with LocalStorage cache, 1-click factory demo data restore, multi-language indicator |

---

### How to Run the Application

```bash
# 1. Install dependencies (already installed)
npm install

# 2. Run the Vite development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

### Future Backend Integration Architecture
The codebase is structured with clear separation between state context (`ChildDataContext`, `AuthContext`) and presentation components. When transitioning to a Python Flask / FastAPI backend with MySQL:
1. Replace `localStorage` calls in `src/context/ChildDataContext.jsx` and `src/context/AuthContext.jsx` with standard `fetch()` or `axios` API calls.
2. Standard REST endpoints can be mapped directly to:
   - `POST /api/auth/login`
   - `GET /api/children`
   - `POST /api/children`
   - `POST /api/children/:id/measurements`
   - `GET /api/alerts`
   - `PUT /api/alerts/:id/resolve`

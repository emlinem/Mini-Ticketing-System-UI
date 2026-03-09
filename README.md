# Mini Ticketing System UI

A lightweight support ticket management dashboard built with Next.js, TypeScript, and Tailwind CSS.  
The application allows users to create, manage, and track support tickets through a clean dashboard interface.

This project was developed as part of a frontend coding assignment.

---

## Features

### Ticket Management
- Create tickets with detailed information:
  - Title
  - Description
  - Priority
  - Status
  - Category
  - Assignee
  - Attachments
- View tickets in a dashboard list
- Update ticket status (Open, In Progress, Closed)
- Delete tickets

### Ticket Details
- View individual ticket details
- Add and remove comments
- Upload attachments
- Download attachments
- Delete attachments

### Dashboard
- Ticket statistics overview:
  - Total tickets
  - Open tickets
  - Tickets in progress
  - Closed tickets
- Search tickets
- Filter tickets
- Sort tickets

### Data Persistence
- Ticket data is stored in localStorage so information remains available after refreshing the page.

---

## Tech Stack

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Tailwind CSS**
- React hooks:
  - `useState`
  - `useEffect`
  - `useMemo`

---

## Project Structure

```
app/
  page.tsx                 → Main ticket dashboard
  tickets/[id]/page.tsx    → Individual ticket details page

components/
  Modal.tsx
  TicketForm.tsx
  TicketList.tsx
  StatusBadge.tsx
  StatCard.tsx

hooks/
  useTickets.ts            → Ticket state management + localStorage persistence

types/
  ticket.ts                → TypeScript interfaces and types

utils/
  colorMappings.ts
  formatters.ts
  fileHandling.ts
```

---

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the application:

```
http://localhost:3000
```

---

## Scripts

```
npm run dev     → Run development server
npm run build   → Build for production
npm start       → Run production build
npm run lint    → Run linter
```

---

## Possible Improvements

With additional development time, the following features could be added:

- Backend API with database persistence
- Authentication and user roles
- Real-time updates
- Advanced filtering and ticket assignment
- Automated testing (unit and integration)

---

## Design Approach

The interface was first designed in Figma before implementation.

The goal was to create a simple dashboard-style UI inspired by modern support tools. The design focuses on:

- Clear visual hierarchy
- Card-based layout
- Reusable components
- Consistent styling
- Simple ticket management workflows

<img width="1062" height="756" alt="image" src="https://github.com/user-attachments/assets/e3afd902-e22b-4e5c-812c-926ab316c444" />
<img width="1066" height="758" alt="image" src="https://github.com/user-attachments/assets/459377df-b355-4242-b66d-92aefa67f36f" />
<img width="376" height="548" alt="image" src="https://github.com/user-attachments/assets/6ffa4f69-8638-4ebe-84a5-690d15c21c37" />


---

## Preview

<img width="2680" height="1286" alt="image" src="https://github.com/user-attachments/assets/cddccfa9-11d0-4489-9e6a-d12980371698" />

# Early Bird 🐦

_Early Bird_ is a productivity app that helps you wake up on time, build strong habits, and track your morning streak with QR code verification.

> **⚠️ Note:**  
> This project is a **work in progress** and not yet feature complete.  
> Functionality, user interface, and APIs are subject to change.  
> **Not ready for production use.**

---

## Features

- **Wake-Up Streak Tracker:** Visualize your consistency with a streak calendar (inspired by GitHub’s contribution graph)
- **QR Code Verification:** Scan your personal QR code each morning to log your wake-up
- **Custom Wake Time:** Set and adjust your target wake-up time
- **Mobile-Friendly Dashboard:** Responsive and touch-optimized
- **Positive Reinforcement:** Gamified feedback and encouragement
- **Secure Authentication:** Password verification required on scan

---

## Getting Started

1. **Clone the repo:**

   ```bash
   git clone https://github.com/your-username/early-bird.git
   cd early-bird
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   - Copy `.env.example` to `.env.local`
   - Fill in credentials for your database, authentication, and any 3rd-party services

4. **Run the app locally:**

   ```bash
   npm run dev
   ```

5. **Open in your browser:**  
   [http://localhost:3000](http://localhost:3000)

---

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router, Server Components)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL](https://www.postgresql.org/)
- [NextAuth.js](https://next-auth.js.org/) (authentication)

## Folder Structure

/app # Next.js app directory (pages, layouts, API routes)
/db # Database schema and configuration
/components # UI components
/lib # Utilities and helpers
/public # Static assets (images, QR code, etc)

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Notice

This repository is for personal use and development only.

---

**Made by Kevin S. Lee**

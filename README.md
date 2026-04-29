# Insighta Labs+ Web Portal 🌐

The dedicated web interface for the Insighta Labs+ Demographic Intelligence platform. This project operates as a secure client portal built to visualize complex demographic query data.

## 🌟 Features

- **Strict Server-Side Rendering** – Data is fetched directly on the Next.js server to shield tokens from client execution [TRD].
- **HTTP-Only Cookies** – Prevents Cross-Site Scripting (XSS) attacks by keeping session tokens outside of JavaScript reach [TRD].
- **State Management Protection** – Enforces strict SameSite handling to prevent CSRF vectors [TRD].
- **Short-Lived Sessions** – Native access barriers matching the short expiration windows of the API [TRD].

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Session Tooling**: `cookie`
- **Asset Library**: Lucide React

## 🚀 Installation & Local Setup

Deploy the web portal directly on your development machine [TRD]:

```bash
# 1. Clone the repository
git clone https://github.com
cd insighta-web

# 2. Install required extensions
npm install

# 3. Create your environment parameters
touch .env.local
```

Populate your `.env.local` with the reference point pointing to your live infrastructure:

```
NEXT_PUBLIC_BACKEND_URL="https://vercel.app"
```

Then trigger the execution engine:

```bash
npm run dev
```

## 🔐 Security Parameters & Flow

1. **Gateway** – The user lands on the standard login terminal mapped at `/` [TRD].
2. **Authorization** – Clicking the anchor handles absolute redirect paths directly to the GitHub OAuth trigger at the backend [TRD].
3. **Execution** – Upon successful return, generated access vectors are sealed by the Next.js backend into strict cookies before passing view properties onto the `/dashboard` route [TRD].

## 📄 License

MIT

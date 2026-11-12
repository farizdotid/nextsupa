// Dummy data for the dashboard in demo mode. Replace with real queries later.

export const demoStats = [
  { label: "Total users", value: "1,284", change: "+12%" },
  { label: "Active today", value: "342", change: "+4%" },
  { label: "Revenue", value: "$8,920", change: "+18%" },
  { label: "Open tickets", value: "17", change: "-9%" },
];

export const demoActivity = [
  { id: 1, user: "Aisyah Putri", action: "Signed up", time: "2 minutes ago" },
  { id: 2, user: "Budi Santoso", action: "Upgraded to Pro", time: "1 hour ago" },
  { id: 3, user: "Citra Dewi", action: "Updated profile", time: "3 hours ago" },
  { id: 4, user: "Dimas Pratama", action: "Created a project", time: "Yesterday" },
  { id: 5, user: "Eka Lestari", action: "Cancelled subscription", time: "2 days ago" },
];

export const demoTodos = [
  { id: 1, title: "Connect a real Supabase project", done: false },
  { id: 2, title: "Generate database types", done: false },
  { id: 3, title: "Customize the landing page", done: true },
  { id: 4, title: "Deploy to Vercel", done: false },
];

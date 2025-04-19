// app/not-found.tsx
"use client"

export default function NotFound() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="underline text-primary hover:text-primary/80">
        Return to Home
      </a>
    </div>
  )
}
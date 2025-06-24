// src/components/Footer.tsx

export function Footer() {
  return (
    <footer className="w-full py-4 bg-surface border-t border-muted text-center text-text-light text-sm mt-4">
      MIT License © {new Date().getFullYear()} Early Bird.
    </footer>
  );
}

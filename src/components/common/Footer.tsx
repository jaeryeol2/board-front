import AppLink from '../base/AppLink';

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-500 border-t border-gray-200">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-between">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} MyCompany. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm font-medium">
            <AppLink
              href="/privacy"
              className="transition-colors hover:text-gray-700"
            >
              Privacy Policy
            </AppLink>
            <AppLink
              href="/terms"
              className="transition-colors hover:text-gray-700"
            >
              Terms of Service
            </AppLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

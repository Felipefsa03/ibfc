import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-gray-200/70 py-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <p>
                Created by Felipe from{' '}
                <Link
                    href="https://www.linkedin.com/in/luis-felipe-304a96228/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                    LinkedIn
                </Link>
            </p>
        </footer>
    );
}

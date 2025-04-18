'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "../../../../locales/client";
import Link from "next/link";

export default function UnauthorizedPage() {
  const t = useI18n();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-10 max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          {t('Unauthorized.title')}
        </h1>
        <p className="text-gray-700 mb-2">
          {t('Unauthorized.message')}
        </p>
        <p className="text-gray-700 mb-6">
          {t('Unauthorized.redirect')}
        </p>
        <Link
          href="/" 
          className="text-blue-500 hover:underline transition-colors"
        >
          {t('Unauthorized.manualReturn')}
        </Link>
      </div>
    </div>
  );
}
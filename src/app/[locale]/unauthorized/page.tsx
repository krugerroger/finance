'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
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
        <h1 className="text-3xl font-bold text-red-600 mb-4">Accès refusé</h1>
        <p className="text-gray-700 mb-6">
          Vous serez redirigé vers l’accueil dans quelques secondes...
        </p>
        <a href="/" className="text-blue-500 hover:underline">
          Retour manuel
        </a>
      </div>
    </div>
  );
}

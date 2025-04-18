import React from "react";
import Link from "next/link";

export default async function CustomerFooter() {

    return (
        <footer className="bg-gray-900 text-white py-4 text-xs">
            <div className=" px-4 flex justify-around items-center">
                <div>
                    <Link href="#">Questions fréquentes</Link>
                </div>
                <div>
                    <Link href="#">Contactez-nous</Link>
                </div>
                <div>
                    <Link href="#">Mention Légale</Link>
                </div>
                <div>
                    © {new Date().getFullYear()} Finance. Tous droits réservés.
                </div>
            </div>
        </footer>
    )
}
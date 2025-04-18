//@ts-check
"use client"

import React from "react"

export default function Rib() {
  return (
    <>
            <div className="">
                <div>
                    <div className="mb-4 flex justify-between">
                        <h1 className="text-xl font-bold">Relevé d'identité bancaire</h1>  
                    </div>
                    <div className="space-y-4">
                        <p className="text-red-700">
                            Il est important de noter que les informations bancaires ci-dessous sont fournies exclusivement dans le but de faciliter les transferts de fonds vers votre compte. Ces informations sont confidentielles et doivent être traitées avec le plus grand soin.
                        </p>
                        <div className="grid grid-cols-5 text-sm">
                            <div className="border py-4">Nom de la banque</div>
                            <div className="border py-4">Numéro de compte</div>
                            <div className="border py-4">Clé RIB</div>
                            <div className="border py-4">Iban</div>
                            <div className="border py-4">Code Swift/Bic</div>
                        </div>
                        <p className="text-gray-500">
                        En utilisant ces informations, vous pouvez procéder à des transferts de fonds depuis un compte bancaire tiers vers votre compte. Veuillez vous assurer de les communiquer uniquement à des sources de confiance et de prendre toutes les mesures nécessaires pour protéger la confidentialité de ces informations.
                        </p>
                        <p className="text-gray-500">
                        Lorsque vous effectuez un transfert de fonds, assurez-vous de bien suivre les instructions fournies par le système ou l'institution financière à partir de laquelle vous effectuez le transfert. Vérifiez soigneusement les détails du bénéficiaire, y compris le nom et les informations de compte, pour éviter toute erreur de transfert.
                        </p>
                        <p className="text-gray-500">
                        Nous vous recommandons également de conserver une trace de toutes les transactions effectuées et de vérifier régulièrement votre compte pour vous assurer que les fonds ont été crédités correctement.
                        </p>
                        <p>
                        Veuillez noter que nous ne sommes pas responsables des erreurs de transfert ou de toute utilisation abusive de vos informations bancaires. Il est de votre responsabilité de protéger vos informations personnelles et de prendre les précautions nécessaires pour assurer la sécurité de vos transactions.
                        </p>
                        <p className="text-gray-500">
                        Si vous avez des questions ou des préoccupations concernant l'utilisation de ces informations bancaires ou si vous remarquez une activité suspecte sur votre compte, veuillez nous contacter immédiatement. Notre équipe est là pour vous aider et veiller à la sécurité de votre compte.
                        </p>
                        <p className="text-gray-500">
                        Nous vous remercions de votre confiance et nous nous engageons à garantir la sécurité et la confidentialité de vos informations bancaires.
                        </p>
                    </div>
                </div>
            </div>
    </>
  )
}
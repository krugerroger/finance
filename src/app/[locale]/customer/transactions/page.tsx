//@ts-check
"use client"

import React from "react"
import Link from "next/link"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"
import { useUser } from "@/app/context/UserContext"

export default function Transactions() {
    const {user} = useUser();
  return (
    <>
            <div className="">
                <div>
                    <div className="mb-4 flex justify-between">
                        <h1 className="text-xl font-bold">Liste des comptes de réception de fonds.</h1>  
                        <Link href="/customer/recipient/add" className="block flex gap-1 items-center text-sm text-green-700 font-semibold hover:text-green-900"><Plus className="w-5"/>Ajouter un bénéficiaire</Link>
                    </div>
                    <div>
                                      <Table>
                                          <TableCaption>Vos différentes opérations</TableCaption>
                                          <TableHeader>
                                              <TableRow>
                                              <TableHead>#</TableHead>
                                              <TableHead>Libéllé</TableHead>
                                              <TableHead>Crédit/Débit</TableHead>
                                              <TableHead className="text-right">Temps</TableHead>
                                              </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                              <TableRow>
                                              <TableCell className="font-medium">{user?.numero_compte}</TableCell>
                                              <TableCell>Ouverture de compte</TableCell>
                                              <TableCell>Crédit</TableCell>
                                              <TableCell className="text-right">{user?.created_at ? 
                                                new Date(user.created_at).toLocaleString('fr-FR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }) 
                                                : 'N/A'}
                                                </TableCell>
                                              </TableRow>
                                          </TableBody>
                                      </Table>
                        <div className="flex mx-auto mt-5 w-1/2 justify-center">
                        </div>
                    </div>
                </div>
            </div>
    </>
  )
}
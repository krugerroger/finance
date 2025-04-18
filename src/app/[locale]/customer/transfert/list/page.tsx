//@ts-check
"use client"

import React from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CircleCheck, Info } from "lucide-react"

export default function ListTransfert() {
  return (
    <>
            <div className="">
                <div>
                    <div className="mb-4 flex justify-between">
                        <h1 className="text-xl font-bold">Historique des demandes de retrait</h1>  
                    </div>
                    <div>
                        <Table>
                            <TableCaption>Historique des demandes de retrait</TableCaption>
                            <TableHeader>
                                <TableRow>
                                <TableHead><CircleCheck/></TableHead>
                                <TableHead>Le Montant</TableHead>
                                <TableHead><Info/></TableHead>
                                <TableHead className="">Bénéficiaires</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                <TableCell className="font-medium"></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell className="text-right"></TableCell>
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
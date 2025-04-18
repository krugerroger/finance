//@ts-check
"use client"

import React from "react"
import Link from "next/link"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, CircleCheck, Info, Plus, User } from "lucide-react"

export default function RecipientList() {
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
                            <TableCaption>Liste des comptes de réception de fonds.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                <TableHead><CircleCheck/></TableHead>
                                <TableHead><Info/></TableHead>
                                <TableHead><User/></TableHead>
                                <TableHead className="text-right"><Calendar/></TableHead>
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
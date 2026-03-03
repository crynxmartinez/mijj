import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const transaction = await prisma.transaction.create({
      data: {
        projectId: body.projectId,
        date: new Date(body.date),
        phase: body.phase,
        category: body.category,
        transactionType: body.transactionType || "EXPENSE",
        reason: body.reason,
        vendorName: body.vendorName,
        amount: body.amount,
        paymentStatus: body.paymentStatus,
        invoiceNumber: body.invoiceNumber,
        imageUrl: body.imageUrl,
        notes: body.notes,
      },
    })

    return NextResponse.json(transaction)
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        project: true,
      },
      orderBy: {
        date: "desc",
      },
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    )
  }
}

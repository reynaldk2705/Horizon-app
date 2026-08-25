import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { transactionCategoryStyles } from "@/constants"
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from "@/lib/utils"

const CategoryBadge = ({ category }: { category: string }) => {
  const categoryStyle =
    transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] ||
    transactionCategoryStyles.default || {
      borderColor: "border-gray-200",
      backgroundColor: "bg-gray-50",
      textColor: "text-gray-700",
      chipBackgroundColor: "bg-gray-400",
    }

  const { borderColor, backgroundColor, textColor, chipBackgroundColor } = categoryStyle

  return (
    <div className={cn("category-badge flex items-center gap-1.5 rounded-full px-2 py-0.5 border", borderColor, backgroundColor)}>
      <div className={cn("size-2 rounded-full", chipBackgroundColor)} />
      <p className={cn("text-[12px] font-medium", textColor)}>{category}</p>
    </div>
  )
}

export const TransactionsTable = ({ transactions = [] }: { transactions?: Transaction[] }) => {
  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Transaction</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2">Date</TableHead>
          <TableHead className="px-2 max-md:hidden">Channel</TableHead>
          <TableHead className="px-2 max-md:hidden">Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions?.map((t: Transaction) => {
          const status = getTransactionStatus(new Date(t.date))
          const amount = formatAmount(t.amount)

          const isDebit = t.amount < 0
          const isCredit = t.amount > 0

          return (
            <TableRow
              key={t.id}
              className={`${
                isDebit || amount[0] === "-" ? "bg-[#FFFBFA]" : "bg-[#F6FEF9]"
              } !hover:bg-none !border-b-DEFAULT`}
            >
              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {removeSpecialCharacters(t.name)}
                  </h1>
                </div>
              </TableCell>

              <TableCell
                className={`pl-2 pr-10 font-semibold ${
                  isDebit || amount[0] === "-" ? "text-[#f04438]" : "text-[#039855]"
                }`}
              >
                {isDebit ? `-${amount.slice(1)}` : isCredit ? `+${amount}` : amount}
              </TableCell>

              <TableCell className="pl-2 pr-10">
                <CategoryBadge category={status} />
              </TableCell>

              <TableCell className="min-w-32 pl-2 pr-10">
                {formatDateTime(new Date(t.date)).dateTime}
              </TableCell>

              <TableCell className="pl-2 pr-10 capitalize min-w-24 max-md:hidden">
                {t.paymentChannel}
              </TableCell>

              <TableCell className="pl-2 pr-10 max-md:hidden">
                <CategoryBadge category={t.category} />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default TransactionsTable
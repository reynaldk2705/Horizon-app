"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { formatAmount } from "@/lib/utils";

export const BankDropdown = ({
  accounts = [],
  setValue,
  otherStyles,
}: BankDropdownProps) => {
  const [selected, setSelected] = useState<Account | null>(
    accounts && accounts.length > 0 ? accounts[0] : null
  );

  const handleBankChange = (id: string) => {
    const account = accounts.find((acc) => acc.appwriteItemId === id);

    setSelected(account || null);
    if (setValue) {
      setValue("senderBank", id);
    }
  };

  return (
    <Select
      defaultValue={selected?.appwriteItemId || ""}
      onValueChange={(value) => handleBankChange(value)}
    >
      <SelectTrigger
        className={`flex w-full bg-white gap-3 md:w-[300px] ${otherStyles}`}
      >
        <Image
          src="/icons/credit-card.svg"
          width={20}
          height={20}
          alt="card"
        />
        <p className="line-clamp-1 w-full text-left">
          {selected?.name || "Select a bank account"}
        </p>
      </SelectTrigger>
      <SelectContent
        className={`w-full bg-white md:w-[300px] ${otherStyles}`}
        align="end"
      >
        <SelectGroup>
          <SelectLabel className="py-2 text-normal text-gray-500">
            Select a bank to transfer funds
          </SelectLabel>
          {accounts?.map((account: Account) => (
            <SelectItem
              key={account.id}
              value={account.appwriteItemId}
              className="cursor-pointer border-t"
            >
              <div className="flex flex-col">
                <p className="text-16 font-medium">{account.name}</p>
                <p className="text-14 font-[#055160]">
                  {formatAmount(account.currentBalance)}
                </p>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default BankDropdown;
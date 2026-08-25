import HeaderBox from '@/components/HeaderBox';
import TransactionsTable from '@/components/TransactionsTable';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { formatAmount } from '@/lib/utils';
import { redirect } from 'next/navigation';
import React from 'react';

interface SearchParamProps {
  searchParams?: {
    id?: string;
    page?: string;
  };
}

const TransactionHistory = async ({ searchParams }: SearchParamProps) => {
  const id = searchParams?.id;
  const page = searchParams?.page;

  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) redirect('/sign-in');

  const accounts = await getAccounts({ userId: loggedIn.$id });

  if (!accounts) return null;

  const accountsData = accounts?.data || [];
  const appwriteItemId = (id && id !== 'undefined' ? id : accountsData[0]?.appwriteItemId) as string;

  const account = appwriteItemId ? await getAccount({ appwriteItemId }) : null;

  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox 
          title="Transaction History"
          subtext="See your bank details and transactions."
        />
      </div>

      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">
              {account?.data?.name || 'Bank Account'}
            </h2>
            <p className="text-14 text-blue-25">
              {account?.data?.officialName || 'Official Name'}
            </p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● {account?.data?.mask || '0000'}
            </p>
          </div>
          
          <div className="transactions-account-balance">
            <p className="text-14">Current Balance</p>
            <p className="text-24 text-center font-bold">
              {formatAmount(account?.data?.currentBalance || 0)}
            </p>
          </div>
        </div>

        <section className="flex w-full flex-col gap-6">
          <TransactionsTable 
            transactions={account?.transactions || []}
          />
        </section>
      </div>
    </div>
  );
};

export default TransactionHistory;
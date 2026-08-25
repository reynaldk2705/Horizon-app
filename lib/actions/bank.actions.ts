'use server';

import { plaidClient } from "@/lib/plaid";
import { parseStringify } from "../utils";
import { getBank, getBanks } from "./user.actions";

export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    const banks = await getBanks({ userId });

    if (!banks || banks.length === 0) return null;

    const accounts = await Promise.all(
      banks.map(async (bank: Bank) => {
        const accountsResponse = await plaidClient.accountsGet({
          access_token: bank.accessToken,
        });

        const accountData = accountsResponse.data.accounts[0];

        return {
          id: accountData.account_id,
          availableBalance: accountData.balances.available,
          currentBalance: accountData.balances.current,
          officialName: accountData.official_name,
          mask: accountData.mask,
          institutionId: bank.institutionId,
          name: accountData.name,
          type: accountData.type,
          subtype: accountData.subtype,
          appwriteItemId: bank.$id,
          shareableId: bank.shareableId,
        };
      })
    );

    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);

    return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
    return null;
  }
};

export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
  try {
    const bank = await getBank({ documentId: appwriteItemId });

    if (!bank) return null;

    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank.accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      .toISOString()
      .split('T')[0];
    const endDate = now.toISOString().split('T')[0];

    const transactionsResponse = await plaidClient.transactionsGet({
      access_token: bank.accessToken,
      start_date: startDate,
      end_date: endDate,
    });

    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available,
      currentBalance: accountData.balances.current,
      officialName: accountData.official_name,
      mask: accountData.mask,
      institutionId: bank.institutionId,
      name: accountData.name,
      type: accountData.type,
      subtype: accountData.subtype,
      appwriteItemId: bank.$id,
      shareableId: bank.shareableId,
    };

    const transactions = transactionsResponse.data.transactions.map((transaction) => ({
      id: transaction.transaction_id,
      name: transaction.name,
      paymentChannel: transaction.payment_channel,
      type: transaction.payment_channel,
      accountId: transaction.account_id,
      amount: transaction.amount,
      pending: transaction.pending,
      category: transaction.category ? transaction.category[0] : "",
      date: transaction.date,
      image: transaction.logo_url,
    }));

    return parseStringify({
      data: account,
      transactions: transactions,
    });
  } catch (error) {
    console.error("An error occurred while getting the account:", error);
    return null;
  }
};

export const getInstitution = async ({
  institutionId,
}: getInstitutionProps) => {
  try {
    const response = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["US"] as any,
    });

    const institution = response.data.institution;

    return parseStringify(institution);
  } catch (error) {
    console.error("An error occurred while getting the institution:", error);
    return null;
  }
};
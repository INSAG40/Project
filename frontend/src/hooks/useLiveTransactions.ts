import { useEffect, useState } from "react";

export interface Transaction {
  id: string;
  date: string;
  from_account: string;
  to_account: string;
  amount: number;
  description: string;
  risk_score: number;
  status: string;
  flags: string[];
}

export function useLiveTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/aml/transactions/");

    ws.onmessage = (event) => {
      const data: Transaction = JSON.parse(event.data);
      setTransactions((prev) => [data, ...prev]); // Add new on top
    };

    ws.onopen = () => console.log("WebSocket connected");
    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close();
  }, []);

  return transactions;
}

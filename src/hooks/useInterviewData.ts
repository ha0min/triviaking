import { Day } from "@/types";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      "X-Access-Key":
        "$2a$10$igl4a0NAkspKdZ0zj8yKd.0q80tqV7TSUvt8IrF0/vtMZKSMvrkT2",
      "X-Bin-Meta": "false",
    },
  });
  if (!res.ok) throw new Error("An error occurred while fetching the data.");
  return res.json();
};

export function useInterviewData() {
  const { data, error, isLoading } = useSWR<Day[]>(
    "https://api.jsonbin.io/v3/b/66eb2120acd3cb34a886f273",
    fetcher
  );

  return { data, error, isLoading };
}

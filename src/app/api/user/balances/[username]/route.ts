import { getProfileBalances } from "@zoralabs/coins-sdk";
import { NextResponse } from "next/server";

interface RouteContext {
  params: {
    username: string;
  };
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { username } = params;

  try {
    const response = await getProfileBalances({ identifier: username });
    const balances =
      response?.data?.profile?.coinBalances?.edges?.map(
        (edge: any) => edge.node
      ) || [];

    return NextResponse.json(balances);
  } catch (error) {
    console.error(`Failed to fetch balances for ${username}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch user balances" },
      { status: 500 }
    );
  }
}

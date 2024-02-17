import { EmptyResponse } from "@mbsm/types";
import { NextRequest, NextResponse } from "next/server";

const createAccount = async (
  req: NextRequest
): Promise<NextResponse<EmptyResponse>> => {
  const body = await req.json();

  

  return NextResponse.json({ success: true as const });
};

export { createAccount as PUT };

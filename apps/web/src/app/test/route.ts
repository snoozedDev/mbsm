import { NextRequest, NextResponse } from "next/server";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export const GET = async (req: NextRequest) => {
  return new NextResponse();
};

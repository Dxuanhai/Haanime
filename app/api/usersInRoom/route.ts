import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);

    const channelId = searchParams.get("channelId");

    if (!channelId) {
      return new NextResponse("channel ID missing", { status: 400 });
    }

    const data = await db.userInRoom.findMany({
      where: {
        channelId: params.channelId,
      },
      include: {
        profile: true,
      },
    });
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.log("[CHANNEL_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

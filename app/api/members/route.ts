import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { serverId } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    const memberExists = await db.member.findFirst({
      where: {
        serverId: serverId,
        profileId: profile.id,
      },
    });

    if (!memberExists) {
      const member = await db.member.create({
        data: {
          profileId: profile.id,
          serverId: serverId,
        },
      });

      return NextResponse.json(member);
    }

    NextResponse.json({});
  } catch (error) {
    console.log("[MEMBER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

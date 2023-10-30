import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { Profile } from "@prisma/client";

export async function PATCH(req: Request) {
  try {
    const data: Profile = await req.json();
    if (!data) return new NextResponse("Profile not found ", { status: 400 });

    const newData = await db.profile.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        bio: data.bio,
        bgUrl: data.bgUrl,
        imageUrl: data.imageUrl,
      },
    });

    return NextResponse.json(newData);
  } catch (error) {
    console.log("[MEMBERS_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

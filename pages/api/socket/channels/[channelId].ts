import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { channelId } = req.query;
    const { profileId }: { profileId: string } = req.body;

    if (!profileId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "channel ID missing" });
    }

    const checkUserInAnotherRoom = await db.userInRoom.findUnique({
      where: {
        profileId,
      },
    });

    if (!checkUserInAnotherRoom) {
      const data = await db.userInRoom.create({
        data: {
          channelId: channelId as string,
          profileId: profileId,
        },
      });

      return res.json(data);
    }

    await db.userInRoom.delete({
      where: {
        profileId: profileId,
      },
    });

    const data = await db.userInRoom.create({
      data: {
        channelId: channelId as string,
        profileId: profileId,
      },
    });

    const dataSocket = await db.userInRoom.findMany({
      include: {
        profile: true,
      },
    });

    if (dataSocket) {
      const channelKey = `channel`;

      res?.socket?.server?.io?.emit(channelKey, dataSocket);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}

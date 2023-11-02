import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { profileId, serverId } = req.query;

    if (!serverId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!profileId) {
      return res.status(401).json({ error: "profile ID missing" });
    }

    const checkUserInAnotherRoom = await db.userInRoom.findUnique({
      where: {
        profileId: profileId as string,
      },
    });

    if (!checkUserInAnotherRoom) {
      return res.status(200).json("user not found");
    }

    await db.userInRoom.delete({
      where: {
        profileId: profileId as string,
      },
    });

    const dataSocket = await db.userInRoom.findMany({
      where: {
        channel: {
          server: {
            id: serverId as string,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    if (dataSocket) {
      const channelKey = `channel`;

      res?.socket?.server?.io?.emit(channelKey, dataSocket);
    }

    return res.status(200).json(dataSocket);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}

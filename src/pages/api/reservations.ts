import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { isBlank } from "@/lib/validate";
import { sendReservationNotification } from "@/lib/mailer";

async function GET(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.substring(7);
  if (!token) {
    res.status(401).json({ msg: "you need to be logged-in" });
    return;
  }

  const userId = (await prisma.session.findUnique({ where: { id: token } }))
    ?.userId;
  if (!userId) {
    res.status(500).json({ msg: "no user found" });
    return;
  }

  const result = await prisma.reservation.findMany({
    where: { userId },
    include: { store: { select: { name: true } } },
  });
  res.status(200).json(result);
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { date, storeId, item } = req.body as {
    date: string;
    storeId: string;
    item: string;
  };
  const token = req.headers.authorization?.substring(7);
  if (!token) {
    res.status(401).json({ msg: "you need to be logged-in" });
    return;
  }
  if (new Date(date.toString()).getTime() < Date.now()) {
    res.status(500).json({ msg: "invalid date" });
    return;
  }

  const session = await prisma.session.findUnique({ where: { id: token } });
  if (!session) {
    res.status(500).json({ msg: "no user found" });
    return;
  }
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    return;
  }

  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) {
    res.status(500).json({ msg: "invalid storeid" });
    return;
  }

  if (isBlank(item) || isBlank(date)) {
    res.status(400).json({ msg: "some of properties is missing" });
    return;
  }

  await prisma.reservation
    .create({
      data: { date: new Date(date), storeId, userId: session.userId, item },
    })
    .then((result) => {
      // 店舗に通知のメールを送る
      sendReservationNotification(user, result, store);
      res.status(200).json(result);
    })
    .catch((err) => res.status(500).json({ msg: err.toString() }));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") GET(req, res);
  else if (req.method == "POST") POST(req, res);
  else {
    res.status(404);
  }
}

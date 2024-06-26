import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { Reservation } from "@prisma/client";

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<Reservation>
) {
  const token = req.headers.authorization?.substring(7);
  if (!token) {
    res.status(401);
    return;
  }

  const userId = (await prisma.session.findUnique({ where: { id: token } }))
    ?.userId;
  if (!userId) {
    res.status(500);
    return;
  }

  const id = req.query.id as string;
  const result = await prisma.reservation.findUnique({ where: { id, userId } });
  res.status(200).json(result as Reservation);
}

export async function PUT(
  req: NextApiRequest,
  res: NextApiResponse<Reservation>
) {
  const token = req.headers.authorization?.substring(7);
  if (!token) {
    res.status(401);
    return;
  }

  const userId = (await prisma.session.findUnique({ where: { id: token } }))
    ?.userId;
  if (!userId) {
    res.status(500);
    return;
  }

  const id = req.query.id as string;
  const { date, storeId, item } = req.body;
  const result = await prisma.reservation.update({
    data: { date, storeId, item },
    where: { id, userId },
  });
  res.status(200).json(result);
}

export async function DELETE(
  req: NextApiRequest,
  res: NextApiResponse<Reservation>
) {
  const token = req.headers.authorization?.substring(7);
  if (!token) {
    res.status(401);
    return;
  }

  const userId = (await prisma.session.findUnique({ where: { id: token } }))
    ?.userId;
  if (!userId) {
    res.status(500);
    return;
  }

  const id = req.query.id as string;
  const result = await prisma.reservation.delete({ where: { id, userId } });
  res.status(200).json(result);
}

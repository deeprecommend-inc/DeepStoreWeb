import { NextApiRequest, NextApiResponse } from "next";

async function POST(req: NextApiRequest, res: NextApiResponse) {

}

export async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "POST") POST(req, res);
}
// pages/api/music/search.ts

import type { NextApiRequest, NextApiResponse } from "next";
import yts from "yt-search";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Invalid query parameter" });
  }

  try {
    const searchResults = await yts(query);

    const videos = (searchResults.videos || [])
      .slice(0, 10) // limit results
      .map((video:any) => ({
        id: video.videoId,
        title: video.title,
        channel: video.author.name,
        thumbnail: video.thumbnail,
      }));

    return res.status(200).json({ tracks: videos });
  } catch (error) {
    console.error("yt-search error:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch videos", tracks: [] });
  }
}

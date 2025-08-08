import type { NextApiRequest, NextApiResponse } from "next";
import yts, { VideoSearchResult } from "yt-search";

interface Track {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
}

const cache: { [key: string]: { timestamp: number; data: Track[] } } = {};
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Invalid query parameter" });
  }

  const key = query.toLowerCase().trim();

  if (key.length < 2) {
    return res.status(400).json({ error: "Query too short" });
  }

  if (cache[key] && Date.now() - cache[key].timestamp < CACHE_TTL) {
    return res.status(200).json({ tracks: cache[key].data });
  }

  try {
    const label = `yt-search-${Date.now()}-${Math.random()}`;
    console.time(label);

    const searchResults = await yts(query);
    console.timeEnd(label);

    const videos: Track[] = ((searchResults as any).videos || [])
      .slice(0, 10)
      .map((video: VideoSearchResult) => ({
        id: video.videoId,
        title: video.title,
        channel: video.author.name,
        thumbnail: video.thumbnail,
      }));

    cache[key] = {
      timestamp: Date.now(),
      data: videos,
    };

    return res.status(200).json({ tracks: videos });
  } catch (error) {
    console.error("yt-search error:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch videos", tracks: [] });
  }
}

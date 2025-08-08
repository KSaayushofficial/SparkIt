import type { NextApiRequest, NextApiResponse } from "next";
import yts, { VideoSearchResult } from "yt-search";

interface Track {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
}

interface ApiResponse {
  tracks: Track[];
  error?: string;
}

const cache: { [key: string]: { timestamp: number; data: Track[] } } = {};
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

function isVideoSearchResult(video: unknown): video is VideoSearchResult {
  if (typeof video !== "object" || video === null) return false;

  const v = video as Record<string, unknown>;
  return (
    typeof v.videoId === "string" &&
    typeof v.title === "string" &&
    typeof v.author === "object" &&
    v.author !== null &&
    typeof (v.author as Record<string, unknown>).name === "string" &&
    // Ensure thumbnail exists and is a string
    typeof v.thumbnail === "string"
  );
}

function getThumbnail(video: VideoSearchResult): string {
  // Provide a fallback thumbnail if none exists
  return video.thumbnail || "https://i.ytimg.com/vi/default.jpg";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({
      tracks: [],
      error: "Invalid query parameter",
    });
  }

  const key = query.toLowerCase().trim();

  if (key.length < 2) {
    return res.status(400).json({
      tracks: [],
      error: "Query too short",
    });
  }

  if (cache[key] && Date.now() - cache[key].timestamp < CACHE_TTL) {
    return res.status(200).json({
      tracks: cache[key].data,
    });
  }

  try {
    const label = `yt-search-${Date.now()}-${Math.random()}`;
    console.time(label);

    const searchResults = await yts(query);

    console.timeEnd(label);

    const validVideos = (searchResults.videos || [])
      .filter(isVideoSearchResult)
      .slice(0, 10)
      .map(
        (video): Track => ({
          id: video.videoId,
          title: video.title,
          channel: video.author.name,
          thumbnail: getThumbnail(video), // Use the safe thumbnail getter
        })
      );

    cache[key] = {
      timestamp: Date.now(),
      data: validVideos,
    };

    return res.status(200).json({
      tracks: validVideos,
    });
  } catch (error) {
    console.error("yt-search error:", error);
    return res.status(500).json({
      tracks: [],
      error: "Failed to fetch videos",
    });
  }
}

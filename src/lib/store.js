import { kv } from '@vercel/kv';

const POST_TTL_SEC = 24 * 60 * 60; // 24 hours in seconds

// In-memory fallback for local development without KV
const localPosts = new Map();

function cleanupLocal() {
  const now = Date.now();
  for (const [id, entry] of localPosts) {
    if (now >= entry.expiresAt) {
      localPosts.delete(id);
    }
  }
}

export async function createPost({ id, name, url, category }) {
  const now = Date.now();
  const post = {
    id,
    name,
    url,
    category,
    likes: 0,
    likedBy: [],
    createdAt: now,
    expiresAt: now + (POST_TTL_SEC * 1000), // Only used locally
  };

  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    // Save to Vercel KV with an expiration mapped to the ID
    await kv.hset(`post:${id}`, post);
    // Add to sorted set to get ordered lists later (score = createdAt)
    await kv.zadd('posts:feed', { score: now, member: id });
    // Tell Redis to forget the hash automatically after 24h
    await kv.expire(`post:${id}`, POST_TTL_SEC);
  } else {
    // Local memory fallback
    cleanupLocal();
    localPosts.set(id, { data: post, expiresAt: post.expiresAt });
  }

  return post;
}

export async function getAllPosts() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    // Retrieve all active post IDs from sorted set, ordered descending
    const postIds = await kv.zrange('posts:feed', 0, -1, { rev: true });
    if (!postIds || postIds.length === 0) return [];
    
    // Fetch hashes for the IDs simultaneously
    const pipeline = kv.pipeline();
    postIds.forEach(id => pipeline.hgetall(`post:${id}`));
    const results = await pipeline.exec();
    
    // Filter out nulls (posts that have naturally expired via TTL)
    const validPosts = results.filter(p => p !== null);
    
    // Maintain the active sorted set by removing expired ones (cleanup phase)
    if (results.length !== validPosts.length) {
      const expiredIds = postIds.filter((_, idx) => results[idx] === null);
      if (expiredIds.length > 0) {
        await kv.zrem('posts:feed', ...expiredIds);
      }
    }
    
    return validPosts;
  } else {
    // Local memory fallback
    cleanupLocal();
    const result = [];
    for (const [, entry] of localPosts) {
      result.push(entry.data);
    }
    result.sort((a, b) => b.createdAt - a.createdAt);
    return result;
  }
}

export async function getPost(id) {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const post = await kv.hgetall(`post:${id}`);
    return post || null;
  } else {
    cleanupLocal();
    const entry = localPosts.get(id);
    return entry ? entry.data : null;
  }
}

export async function likePost(id, visitorId) {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const post = await kv.hgetall(`post:${id}`);
    if (!post) return null; // Post might have expired

    if (!post.likedBy) post.likedBy = [];

    // Check for duplicate like
    if (post.likedBy.includes(visitorId)) {
      return post;
    }

    // Add like
    post.likes += 1;
    post.likedBy.push(visitorId);
    
    // Save state stringified back
    await kv.hset(`post:${id}`, { likes: post.likes, likedBy: post.likedBy });
    
    return post;
  } else {
    cleanupLocal();
    const entry = localPosts.get(id);
    if (!entry) return null;

    if (entry.data.likedBy.includes(visitorId)) {
      return entry.data;
    }

    entry.data.likes += 1;
    entry.data.likedBy.push(visitorId);
    return entry.data;
  }
}

export async function deletePost(id) {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    await kv.del(`post:${id}`);
    await kv.zrem('posts:feed', id);
  } else {
    localPosts.delete(id);
  }
}

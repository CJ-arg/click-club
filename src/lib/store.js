import { createClient } from 'redis';

let redisInstance = null;
async function getRedis() {
  if (!process.env.KV_REDIS_URL) return null;
  
  if (!redisInstance) {
    redisInstance = createClient({ url: process.env.KV_REDIS_URL });
    redisInstance.on('error', (err) => console.error('Redis Client Error', err));
  }

  if (!redisInstance.isOpen) {
    try {
      await redisInstance.connect();
    } catch (e) {
      console.error("Failed to connect to Redis", e);
      return null;
    }
  }
  return redisInstance;
}

const POST_TTL_SEC = 24 * 60 * 60; // 24 hours in seconds

// In-memory fallback for local development without Redis
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

  const db = await getRedis();
  if (db) {
    // Save to Redis (serialize arrays and numbers as strings for Hashes in node-redis)
    const postPayload = {
      id: post.id,
      name: post.name,
      url: post.url,
      category: post.category,
      likes: post.likes.toString(),
      likedBy: JSON.stringify(post.likedBy),
      createdAt: post.createdAt.toString(),
      expiresAt: post.expiresAt.toString(),
    };
    
    await db.hSet(`post:${id}`, postPayload);
    // Add to sorted set to get ordered lists later (score = createdAt)
    // En redis v4 es => zAdd('key', { score: X, value: 'algo' })
    await db.zAdd('posts:feed', [{ score: now, value: id }]);
    // Tell Redis to forget the hash automatically after 24h
    await db.expire(`post:${id}`, POST_TTL_SEC);
  } else {
    // Local memory fallback
    cleanupLocal();
    localPosts.set(id, { data: post, expiresAt: post.expiresAt });
  }

  return post;
}

// Helper para desserializar posts que vienen de Redis
function parsePost(redisPost) {
  if (!redisPost || Object.keys(redisPost).length === 0) return null;
  return {
    ...redisPost,
    likes: parseInt(redisPost.likes || '0', 10),
    likedBy: redisPost.likedBy ? JSON.parse(redisPost.likedBy) : [],
    createdAt: parseInt(redisPost.createdAt, 10),
    expiresAt: parseInt(redisPost.expiresAt, 10),
  };
}

export async function getAllPosts() {
  const db = await getRedis();
  if (db) {
    // Formato de node-redis: zRange('posts:feed', '+inf', '-inf', { BY: 'score', REV: true }) 
    // pero para simple indices: zRange('posts:feed', 0, -1, { REV: true })
    const postIds = await db.zRange('posts:feed', 0, -1, { REV: true });
    
    if (!postIds || postIds.length === 0) return [];
    
    // Fetch hashes for the IDs simultaneously usando promise.all
    const promises = postIds.map(id => db.hGetAll(`post:${id}`));
    const results = await Promise.all(promises);
    
    // Parse objects and Filter out empty ones (posts that have naturally expired via TTL)
    const validPosts = results.map(p => parsePost(p)).filter(p => p !== null);
    
    // Maintain the active sorted set by removing expired ones (cleanup phase)
    if (results.length !== validPosts.length) {
      const expiredIds = postIds.filter((_, idx) => !results[idx] || Object.keys(results[idx]).length === 0);
      if (expiredIds.length > 0) {
        await db.zRem('posts:feed', expiredIds);
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
  const db = await getRedis();
  if (db) {
    const post = await db.hGetAll(`post:${id}`);
    return parsePost(post);
  } else {
    cleanupLocal();
    const entry = localPosts.get(id);
    return entry ? entry.data : null;
  }
}

export async function likePost(id, visitorId) {
  const db = await getRedis();
  if (db) {
    const post = await db.hGetAll(`post:${id}`);
    const parsed = parsePost(post);
    if (!parsed) return null; // Post might have expired

    if (!parsed.likedBy) parsed.likedBy = [];

    // Check for duplicate like
    if (parsed.likedBy.includes(visitorId)) {
      return parsed;
    }

    // Add like
    parsed.likes += 1;
    parsed.likedBy.push(visitorId);
    
    // Save state stringified back
    await db.hSet(`post:${id}`, { 
      likes: parsed.likes.toString(), 
      likedBy: JSON.stringify(parsed.likedBy) 
    });
    
    return parsed;
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
  const db = await getRedis();
  if (db) {
    await db.del(`post:${id}`);
    await db.zRem('posts:feed', id);
  } else {
    localPosts.delete(id);
  }
}

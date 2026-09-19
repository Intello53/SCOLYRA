import Redis from "ioredis";

/**
 * Limiteur de tentatives simple (fenêtre fixe) basé sur Redis.
 * Utilisé pour freiner le brute-force sur /api/register et sur la
 * connexion (voir lib/auth.ts).
 *
 * Comportement si Redis est injoignable : on "fail open" (on laisse
 * passer, en loggant une erreur) plutôt que de bloquer tout le monde
 * si l'infra Redis a un problème — c'est un compromis documenté, pas
 * un oubli. En production, surveiller ces logs.
 */

let redis: Redis | null = null;
function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  redis = new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 1 });
  redis.on("error", (err) => console.error("[rate-limit] Erreur Redis :", err.message));
  return redis;
}

export type RateLimitResult = { allowed: boolean; remaining: number; retryAfterSeconds?: number };

/**
 * @param key Identifiant de la ressource limitée (ex: `login:${email}`, `register:${ip}`)
 * @param limit Nombre de tentatives autorisées par fenêtre
 * @param windowSeconds Durée de la fenêtre en secondes
 */
export async function checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  const client = getRedis();
  if (!client) {
    // Pas de Redis configuré (ex: environnement de test) : on ne limite pas.
    return { allowed: true, remaining: limit };
  }

  try {
    if (client.status === "wait" || client.status === "end") {
      await client.connect().catch(() => {});
    }
    const redisKey = `ratelimit:${key}`;
    const count = await client.incr(redisKey);
    if (count === 1) {
      await client.expire(redisKey, windowSeconds);
    }
    if (count > limit) {
      const ttl = await client.ttl(redisKey);
      return { allowed: false, remaining: 0, retryAfterSeconds: ttl > 0 ? ttl : windowSeconds };
    }
    return { allowed: true, remaining: Math.max(0, limit - count) };
  } catch (err) {
    console.error("[rate-limit] Échec de la vérification, on laisse passer :", err);
    return { allowed: true, remaining: limit };
  }
}

/** Réinitialise le compteur (ex: après une connexion réussie). */
export async function resetRateLimit(key: string): Promise<void> {
  const client = getRedis();
  if (!client) return;
  try {
    await client.del(`ratelimit:${key}`);
  } catch {
    // silencieux — non bloquant
  }
}

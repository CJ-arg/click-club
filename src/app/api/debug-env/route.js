export async function GET() {
  // Solo devolvemos los NOMBRES de las variables (nunca los valores secretos)
  // para entender exactamente qué nombre le puso Vercel a la base de datos.
  const allKeys = Object.keys(process.env);
  const matchedKeys = allKeys.filter(key => 
    key.includes('KV') || 
    key.includes('REDIS') || 
    key.includes('UPSTASH') || 
    key.includes('STORAGE')
  );

  return Response.json({
    message: "Variables de entorno detectadas (solo nombres):",
    keys: matchedKeys,
    hasUrl: !!process.env.KV_REST_API_URL || !!process.env.KV_REDIS_URL || !!process.env.STORAGE_URL,
  });
}

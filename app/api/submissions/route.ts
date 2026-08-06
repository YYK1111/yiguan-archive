import { desc } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "../../../db";
import { submissions } from "../../../db/schema";

const required = ["type","title","garment","content","source","sourceUrl","copyright","contributor"];

export async function GET() {
  try {
    const rows = await getDb().select().from(submissions).orderBy(desc(submissions.createdAt),desc(submissions.id)).limit(50);
    return Response.json({ submissions: rows });
  } catch (error) {
    return Response.json({ submissions: [], error: error instanceof Error ? error.message : "数据库暂不可用" }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    for (const key of required) if (!String(form.get(key) ?? "").trim()) return Response.json({ error:`${key} 为必填项` },{status:400});
    let imageKey: string | null = null;
    const image = form.get("image");
    if (image instanceof File && image.size > 0) {
      if (!image.type.startsWith("image/")) return Response.json({error:"仅支持图片文件"},{status:400});
      if (image.size > 8 * 1024 * 1024) return Response.json({error:"图片不能超过 8MB"},{status:400});
      imageKey = `submissions/${Date.now()}-${crypto.randomUUID()}-${image.name.replace(/[^a-zA-Z0-9._-]/g,"_")}`;
      await env.UPLOADS.put(imageKey, image.stream(), { httpMetadata:{ contentType:image.type } });
    }
    const value = Object.fromEntries(["type","title","garment","content","period","source","institution","sourceUrl","copyright","contributor","notes"].map(k=>[k,String(form.get(k)??"").trim()]));
    const [row] = await getDb().insert(submissions).values({ ...value, imageKey, status:"pending" } as typeof submissions.$inferInsert).returning();
    return Response.json({ submission: row },{status:201});
  } catch (error) {
    return Response.json({error:error instanceof Error?error.message:"提交失败"},{status:500});
  }
}

import { eq, sql } from "drizzle-orm";
import { getDb } from "../../../../db";
import { reviews, submissions } from "../../../../db/schema";

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const {id}=await params; const numeric=Number(id); const body=await request.json() as {status?:string;reviewNote?:string};
    if(!Number.isInteger(numeric)) return Response.json({error:"无效记录号"},{status:400});
    if(!["approved","rejected","disputed"].includes(body.status||"")) return Response.json({error:"无效审核状态"},{status:400});
    const db=getDb();
    const [row]=await db.update(submissions).set({status:body.status!,reviewNote:body.reviewNote||"",updatedAt:sql`CURRENT_TIMESTAMP`}).where(eq(submissions.id,numeric)).returning();
    await db.insert(reviews).values({submissionId:numeric,status:body.status!,note:body.reviewNote||""});
    return Response.json({submission:row});
  }catch(error){return Response.json({error:error instanceof Error?error.message:"审核失败"},{status:500})}
}

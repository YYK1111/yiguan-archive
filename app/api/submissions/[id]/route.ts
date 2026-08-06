type DemoSubmission = { id:number; status:string; reviewNote:string; [key:string]:unknown };
const globalStore = globalThis as typeof globalThis & { yiguanSubmissions?: DemoSubmission[] };

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const body=await request.json() as {status?:string;reviewNote?:string};
  if(!["approved","rejected","disputed"].includes(body.status||"")) {
    return Response.json({error:"无效审核状态"},{status:400});
  }
  const rows=globalStore.yiguanSubmissions ?? [];
  const row=rows.find((item)=>item.id===Number(id));
  if(!row) return Response.json({error:"演示记录不存在或运行实例已刷新"},{status:404});
  row.status=body.status!;
  row.reviewNote=body.reviewNote||"";
  return Response.json({submission:row,storageMode:"demo"});
}

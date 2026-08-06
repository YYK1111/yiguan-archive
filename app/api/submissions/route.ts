type DemoSubmission = {
  id: number;
  type: string;
  title: string;
  garment: string;
  content: string;
  period: string;
  source: string;
  institution: string;
  sourceUrl: string;
  copyright: string;
  contributor: string;
  notes: string;
  status: string;
  reviewNote: string;
  createdAt: string;
};

const globalStore = globalThis as typeof globalThis & { yiguanSubmissions?: DemoSubmission[] };
const submissions = globalStore.yiguanSubmissions ??= [
  {
    id: 1001,
    type: "古画",
    title: "演示投稿：圆领袍图像线索",
    garment: "yuanlingpao",
    content: "这是一条用于展示审核工作流的示范记录，不作为正式历史证据。",
    period: "待校核",
    source: "演示数据",
    institution: "",
    sourceUrl: "https://example.com/demo",
    copyright: "演示占位，不含真实图片",
    contributor: "平台演示",
    notes: "正式上线时需接入持久化数据库与文件存储。",
    status: "pending",
    reviewNote: "",
    createdAt: new Date().toISOString(),
  },
];

const required = ["type","title","garment","content","source","sourceUrl","copyright","contributor"];

export async function GET() {
  return Response.json({ submissions: [...submissions].reverse(), storageMode: "demo" });
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    for (const key of required) {
      if (!String(form.get(key) ?? "").trim()) {
        return Response.json({ error: `${key} 为必填项` }, { status: 400 });
      }
    }
    const image = form.get("image");
    if (image instanceof File && image.size > 8 * 1024 * 1024) {
      return Response.json({ error: "图片不能超过 8MB" }, { status: 400 });
    }
    const value = Object.fromEntries(
      ["type","title","garment","content","period","source","institution","sourceUrl","copyright","contributor","notes"]
        .map((key) => [key, String(form.get(key) ?? "").trim()]),
    ) as Omit<DemoSubmission,"id"|"status"|"reviewNote"|"createdAt">;
    const row: DemoSubmission = {
      ...value,
      id: Date.now(),
      status: "pending",
      reviewNote: "",
      createdAt: new Date().toISOString(),
    };
    submissions.push(row);
    return Response.json({ submission: row, storageMode: "demo" }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "提交失败" }, { status: 500 });
  }
}

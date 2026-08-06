"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Garment = {
  id: string; name: string; alias: string; category: string; period: string;
  summary: string; evidence: number; completeness: "充足" | "待补" | "争议";
  features: string[]; usage: string; material: string; color: string;
};

const garments: Garment[] = [
  { id:"yuanlingpao", name:"圆领袍", alias:"团领袍", category:"服装", period:"北朝—明", summary:"以圆形领口为显著特征的袍服形制，在不同时期的袖型、长度与穿着制度中持续变化。", evidence:8, completeness:"充足", features:["圆领","右衽或缺胯","长袍"], usage:"官服、常服及多种社会场景", material:"绢、罗、锦等", color:"随身份与制度而异" },
  { id:"shenyi", name:"深衣", alias:"深衣制", category:"服装", period:"先秦—汉", summary:"上衣下裳相连、被后世反复阐释的一类服饰制度与形制概念。", evidence:6, completeness:"争议", features:["衣裳相连","交领右衽","长及踝部"], usage:"礼仪与日常语境均有记载", material:"麻、丝织物", color:"依礼制与场合而异" },
  { id:"ru", name:"襦", alias:"短襦", category:"服装", period:"汉—明", summary:"长度较短的上衣，常与裙、裤等搭配，形制随时代持续演变。", evidence:5, completeness:"待补", features:["短上衣","交领或对襟","袖型多样"], usage:"日常穿着", material:"绢、纱、棉麻", color:"多样" },
  { id:"qun", name:"裙", alias:"裳", category:"服装", period:"先秦—清", summary:"围合下体的服装类别，在结构、褶裥、腰位与搭配方式上呈现长期变化。", evidence:9, completeness:"充足", features:["下装","片幅围合","褶裥变化"], usage:"日常、礼仪", material:"纱、罗、绢、锦", color:"多样" },
  { id:"guan", name:"冠", alias:"首服", category:"首服", period:"先秦—明", summary:"与礼制、身份和场合密切相关的首服总称，具体类型繁多。", evidence:12, completeness:"充足", features:["束发","礼制标识","形制多样"], usage:"礼仪、朝会、身份标识", material:"漆纱、皮、玉饰等", color:"多依制度" },
  { id:"futou", name:"幞头", alias:"折上巾", category:"首服", period:"隋唐—宋", summary:"由包裹头部的巾式首服发展而来，脚形与结构在唐宋时期变化明显。", evidence:7, completeness:"待补", features:["巾帕结构","幞脚","内衬骨架"], usage:"官员及士庶穿用", material:"纱、罗", color:"多见黑色记述" },
  { id:"jin", name:"锦", alias:"织锦", category:"材料", period:"先秦—清", summary:"以彩色经纬组织形成纹样的高级丝织物，也是古籍中常见的服饰材料词。", evidence:10, completeness:"充足", features:["多彩纹样","复杂织造","礼赠价值"], usage:"服装、缘饰、礼物", material:"蚕丝", color:"多彩" },
  { id:"fei", name:"绯", alias:"绯色", category:"颜色", period:"汉—明", summary:"偏红的传统色名，在服饰制度和文学记述中具有不同语境。", evidence:4, completeness:"待补", features:["红色系","制度色彩","语义随时变化"], usage:"官服、服饰描写", material:"染色对象多样", color:"绯红" },
  { id:"beizi", name:"褙子", alias:"背子", category:"服装", period:"宋—明", summary:"宋明时期常见的长身外衣，领襟、开衩及穿着群体存在多种形态。", evidence:5, completeness:"待补", features:["直领","对襟","侧衩"], usage:"男女日常与礼仪穿着", material:"绫、罗、纱", color:"多样" },
  { id:"banbi", name:"半臂", alias:"半袖", category:"服装", period:"隋唐", summary:"袖长及肘附近的短袖上衣，常见于隋唐图像与文献讨论。", evidence:4, completeness:"待补", features:["短袖","短身","叠穿"], usage:"日常、侍从等", material:"锦、绢", color:"多样" },
  { id:"dai", name:"带", alias:"腰带", category:"饰物", period:"先秦—清", summary:"用于束衣并承载身份标识与佩挂功能的服饰构件。", evidence:8, completeness:"充足", features:["束腰","带銙","佩挂"], usage:"礼制与日常", material:"革、丝、金玉", color:"多样" },
  { id:"pei", name:"佩", alias:"佩饰", category:"饰物", period:"先秦—清", summary:"佩于身上的玉、香囊与其他装饰物，可兼具礼制、实用和象征功能。", evidence:6, completeness:"争议", features:["悬挂","组合","身份象征"], usage:"礼仪、日常", material:"玉、金属、织物", color:"依材质" },
  { id:"xia", name:"霞帔", alias:"帔", category:"服装", period:"宋—明", summary:"披于肩背的礼仪服饰构件，在女性命服制度中尤受关注。", evidence:5, completeness:"待补", features:["披挂","长条形","纹样等级"], usage:"女性礼服", material:"锦、缎", color:"依品级" },
  { id:"mian", name:"冕", alias:"冕冠", category:"首服", period:"先秦—明", summary:"古代礼制中的重要冠式，与特定礼仪和身份等级相关。", evidence:7, completeness:"充足", features:["延板","旒","礼制等级"], usage:"重大礼仪", material:"木、布、玉珠", color:"玄色为主的制度表述" },
  { id:"luo", name:"罗", alias:"罗织物", category:"材料", period:"汉—清", summary:"绞经组织形成孔眼的丝织物，轻薄透气，常见于服饰记载。", evidence:4, completeness:"待补", features:["绞经","轻薄","孔眼"], usage:"衣料、罩衣", material:"蚕丝", color:"可染多色" },
  { id:"sha", name:"纱", alias:"纱织物", category:"材料", period:"汉—清", summary:"轻薄丝织物的广义类别，具体组织和名称因时代而异。", evidence:4, completeness:"争议", features:["轻薄","透气","组织多样"], usage:"夏服、冠帽", material:"蚕丝", color:"多样" },
  { id:"ku", name:"裤", alias:"绔", category:"服装", period:"先秦—清", summary:"覆盖双腿的下装，结构与外穿、内穿方式随时代和人群变化。", evidence:5, completeness:"待补", features:["分腿","裆部结构","长短变化"], usage:"骑乘、劳动、日常", material:"麻、绢、棉", color:"多样" },
  { id:"pibo", name:"帔帛", alias:"披帛", category:"饰物", period:"隋唐—宋", summary:"披搭肩臂的长条织物，常见于人物画与宗教图像。", evidence:6, completeness:"待补", features:["长条","披搭","飘垂"], usage:"女性服饰、宗教图像", material:"纱、罗、绢", color:"多彩" },
  { id:"xue", name:"靴", alias:"革靴", category:"足服", period:"汉—清", summary:"筒状鞋履类别，与骑乘、军旅和官服制度关系密切。", evidence:5, completeness:"待补", features:["靴筒","革底","便于骑乘"], usage:"军旅、官服、日常", material:"皮革、织物", color:"黑、褐等" },
  { id:"buyao", name:"步摇", alias:"步摇钗", category:"饰物", period:"汉—唐", summary:"随步履而摇曳的首饰类型，文献名称与出土形态需谨慎互证。", evidence:5, completeness:"争议", features:["垂饰","摇曳","金玉装饰"], usage:"女性首饰", material:"金、银、玉石", color:"依材质" },
];

const excerpts = [
  { id:"zhouli", book:"《周礼》", chapter:"礼制相关篇章", note:"演示整理 · 正式引文待版本校核", text:"王之吉服，祀昊天上帝则服大裘而冕，祀五帝亦如之。" },
  { id:"yufu", book:"《旧唐书·舆服志》", chapter:"舆服志", note:"演示整理 · 请以可靠版本复核", text:"其服冠冕衣裳，制度沿革，各有等差；锦袍绯服，因品秩而见。" },
  { id:"mingshi", book:"《明史·舆服志》", chapter:"舆服志", note:"演示性摘要 · 非正式引用", text:"凡冠服之制，上下辨等，袍、带、冠、履，各随其品。" },
];

const evidenceCases = [
  { title:"圆领袍：文字制度与人物图像", question:"圆领袍如何从图像特征回到文献语境？", types:["古籍","历史图像","研究解释"], status:"4条证据待复核", garment:"yuanlingpao" },
  { title:"深衣：形制概念的多重解释", question:"后世所说的“深衣”是否指向同一形制？", types:["古籍","制度解释","争议"], status:"争议开放", garment:"shenyi" },
  { title:"幞头：从巾帕到制度化首服", question:"幞脚与内部结构如何随时期变化？", types:["古画","文物","古籍"], status:"缺实物证据", garment:"futou" },
  { title:"绯色：颜色词与品秩制度", question:"颜色词怎样进入服饰等级叙述？", types:["古籍","颜色","研究解释"], status:"3条待校核", garment:"fei" },
  { title:"步摇：名称、形态与出土物", question:"文学描述与考古器物能否直接对应？", types:["出土文物","古籍","争议"], status:"证据持续补充", garment:"buyao" },
];

const periods = [
  ["先秦","礼制初构","衣裳、冠冕与佩饰进入制度化叙述"],
  ["秦汉","制度承续","深衣、冠服与丝织材料呈现复杂面貌"],
  ["魏晋南北朝","交融转化","多民族交往推动形制与审美变化"],
  ["隋唐","开放汇流","圆领袍、半臂与多样首服形成鲜明图景"],
  ["宋元","制度与日常","幞头、褙子等形制在不同社会场景展开"],
  ["明清","整饬与重构","礼制复古、制度重建与新形制并存"],
];

const nav = [
  ["古籍寻衣","/texts"],["衣冠知识","/garments"],["衣冠流变","/timeline"],
  ["图文互证","/evidence"],["参与共建","/contribute"],
];

function Status({ value }: { value: string }) {
  return <span className={`status ${value.includes("争议") ? "disputed" : value.includes("待") ? "pending" : "approved"}`}>{value}</span>;
}

function Shell({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState(false);
  return <>
    <header className="site-header">
      <Link href="/" className="brand" aria-label="衣冠藏卷首页"><span className="seal">衣</span><span><b>衣冠藏卷</b><small>YIGUAN ARCHIVE</small></span></Link>
      <button className="menu-button" onClick={() => setMenu(!menu)} aria-label="切换导航">目次</button>
      <nav className={menu ? "open" : ""} aria-label="主导航">{nav.map(([label,href])=><Link key={href} href={href}>{label}</Link>)}<Link href="/lab" className="lab-link">AI 实验</Link></nav>
    </header>
    <main>{children}</main>
    <footer><div><b>衣冠藏卷</b><p>让散落在文字与图像中的衣冠线索，被看见、被核查、被共同补全。</p></div><div className="footer-links"><Link href="/about">关于项目</Link><Link href="/contribute">共建规范</Link><Link href="/review">审核演示</Link></div><small>一期演示站 · 部分内容标记为待校核或演示数据</small></footer>
  </>;
}

function Home() {
  const [selected, setSelected] = useState<Garment | null>(garments[0]);
  const terms: Record<string,string> = { "袍":"yuanlingpao", "冠":"guan", "裙":"qun", "锦":"jin", "绯":"fei" };
  const line = "冠者所以饰首也，袍以蔽体，裙裳随制；锦成其文，绯见其色。";
  const nodes = line.split(new RegExp(`(${Object.keys(terms).join("|")})`,"g"));
  return <Shell>
    <section className="hero">
      <div className="hero-copy"><p className="eyebrow">中华古籍服饰文化数字探索平台</p><h1>一卷古籍，<br/><em>藏多少衣冠？</em></h1><p className="lead">从古籍文字中发现服饰，以古画、壁画与文物相互印证，并由研究者与文化爱好者共同补全散落在历史中的衣冠线索。</p><div className="hero-actions"><Link className="primary" href="/texts">开始寻衣 <span>→</span></Link><Link href="/garments">浏览衣冠</Link><Link href="/contribute">参与共建</Link></div></div>
      <div className="reading-demo" aria-label="古籍服饰词发现演示"><div className="folio-meta"><span>卷一 · 示意文本</span><span>点击朱批词语</span></div><div className="classic-line">{nodes.map((n,i)=>terms[n]?<button key={i} onClick={()=>setSelected(garments.find(g=>g.id===terms[n])||null)}>{n}</button>:<span key={i}>{n}</span>)}</div>{selected&&<div className="margin-note"><Status value={selected.completeness}/><small>{selected.category} · {selected.period}</small><h3>{selected.name}</h3><p>{selected.summary}</p><Link href={`/garments/${selected.id}`}>查看完整词条 →</Link></div>}<span className="folio-number">01</span></div>
    </section>
    <section className="method-strip"><span>从一字进入</span><b>古籍原文</b><i>→</i><b>衣冠词条</b><i>→</i><b>多源证据</b><i>→</i><b>公众共建</b></section>
    <section className="section"><div className="section-head"><div><p className="eyebrow">SELECTED GARMENTS</p><h2>从词语，走入一件衣冠</h2></div><Link href="/garments">查看全部 20 个示范词条 →</Link></div><div className="garment-grid featured">{garments.slice(0,6).map((g,i)=><GarmentCard key={g.id} garment={g} index={i}/>)}</div></section>
    <section className="section evidence-home"><div className="section-head"><div><p className="eyebrow">DUAL EVIDENCE</p><h2>一条结论，需要多少证据？</h2></div><p>文字、图像与研究解释各有边界。我们保留来源，也保留疑问。</p></div><div className="case-grid">{evidenceCases.slice(0,3).map((c,i)=><Link href={`/garments/${c.garment}`} className="case-card" key={c.title}><span className="case-no">0{i+1}</span><div>{c.types.map(t=><span className="tag" key={t}>{t}</span>)}</div><h3>{c.title}</h3><p>{c.question}</p><Status value={c.status}/></Link>)}</div></section>
    <section className="contribution-banner"><div><p className="eyebrow">OPEN ARCHIVE</p><h2>这部“衣冠之卷”，尚未写完。</h2><p>当前有 12 条线索等待出处核验，7 个词条缺少图像证据。一次博物馆参观、一页古籍检索，都可能补上重要的一笔。</p></div><Link className="light-button" href="/contribute">提交一条证据 →</Link></section>
  </Shell>;
}

function GarmentCard({garment:g,index=0}:{garment:Garment,index?:number}) {
  return <Link href={`/garments/${g.id}`} className={`garment-card tone-${index%4}`}><div className="card-visual"><span className="big-char">{g.name[0]}</span><span>{g.period}</span></div><div className="card-body"><div><span className="category">{g.category}</span><Status value={g.completeness}/></div><h3>{g.name}<small>{g.alias}</small></h3><p>{g.summary}</p><span className="evidence-count">据 · {g.evidence} 条</span></div></Link>;
}

function Texts() {
  const [book,setBook]=useState(excerpts[0]); const [vertical,setVertical]=useState(false); const [term,setTerm]=useState<Garment|null>(null);
  const hits = ["冠","袍","锦","绯","裳","冕"];
  const render=(text:string)=>text.split(new RegExp(`(${hits.join("|")})`,"g")).map((n,i)=>hits.includes(n)?<button className="text-hit" key={i} onClick={()=>setTerm(garments.find(g=>g.name.includes(n)||g.alias.includes(n))||garments[0])}>{n}</button>:<span key={i}>{n}</span>);
  return <Shell><PageIntro kicker="TEXTUAL DISCOVERY" title="古籍寻衣" desc="不是把古籍搬上屏幕，而是从一句话里，找出一件衣冠通往历史的入口。" />
    <section className="workspace"><aside className="book-list"><h2>典籍目次</h2>{excerpts.map(e=><button className={e.id===book.id?"active":""} onClick={()=>{setBook(e);setTerm(null)}} key={e.id}><b>{e.book}</b><small>{e.chapter}</small></button>)}<div className="legend"><h3>标注图例</h3><span><i className="dot garment"/>服装</span><span><i className="dot head"/>首服</span><span><i className="dot material"/>材料与颜色</span></div></aside>
    <article className="text-reader"><div className="reader-tools"><div><b>{book.book}</b><span>{book.chapter}</span></div><button onClick={()=>setVertical(!vertical)}>{vertical?"横排阅读":"竖排阅读"}</button></div><div className={vertical?"source-text vertical":"source-text"}>{render(book.text)}</div><div className="source-note"><Status value="待校核"/><p>{book.note}。正式发布前应补充版本、卷次、页码或稳定来源链接。</p></div></article>
    <aside className={`knowledge-drawer ${term?"visible":""}`}>{term?<><button className="close" onClick={()=>setTerm(null)}>关闭</button><p className="eyebrow">词条速览</p><h2>{term.name}</h2><p>{term.summary}</p><dl><div><dt>类别</dt><dd>{term.category}</dd></div><div><dt>时间范围</dt><dd>{term.period}</dd></div><div><dt>证据</dt><dd>{term.evidence}条</dd></div></dl><Link className="primary" href={`/garments/${term.id}`}>进入完整词条</Link><Link href="/contribute">补充这条标注 →</Link></>:<div className="drawer-empty"><span>批</span><p>点击原文中带朱线的词语，查看衣冠知识卡。</p></div>}</aside></section>
  </Shell>;
}

function PageIntro({kicker,title,desc,aside}:{kicker:string,title:string,desc:string,aside?:React.ReactNode}) { return <section className="page-intro"><div><p className="eyebrow">{kicker}</p><h1>{title}</h1><p>{desc}</p></div>{aside}</section> }

function Garments() {
  const [query,setQuery]=useState(""); const [category,setCategory]=useState("全部"); const [status,setStatus]=useState("全部");
  const filtered=useMemo(()=>garments.filter(g=>(!query||`${g.name}${g.alias}${g.summary}`.includes(query))&&(category==="全部"||g.category===category)&&(status==="全部"||g.completeness===status)),[query,category,status]);
  return <Shell><PageIntro kicker="GARMENT ARCHIVE" title="衣冠知识" desc="每一个词条都不是终点，而是一组可追溯、可讨论、可继续补充的证据集合。" aside={<div className="metric"><b>20</b><span>示范词条</span><b>126</b><span>证据线索</span></div>}/><section className="archive"><div className="filters"><label>检索衣冠<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="名称、别名或关键词"/></label><label>类别<select value={category} onChange={e=>setCategory(e.target.value)}>{["全部","服装","首服","足服","饰物","材料","颜色"].map(x=><option key={x}>{x}</option>)}</select></label><label>证据状态<select value={status} onChange={e=>setStatus(e.target.value)}>{["全部","充足","待补","争议"].map(x=><option key={x}>{x}</option>)}</select></label><span>找到 {filtered.length} 个词条</span></div><div className="garment-grid">{filtered.map((g,i)=><GarmentCard key={g.id} garment={g} index={i}/>)}</div></section></Shell>;
}

function GarmentDetail({id}:{id:string}) {
  const g=garments.find(x=>x.id===id)||garments[0];
  return <Shell><section className="detail-hero"><div className="detail-char">{g.name[0]}</div><div><div className="crumb"><Link href="/garments">衣冠知识</Link> / {g.category}</div><Status value={g.completeness}/><h1>{g.name}<small>{g.alias}</small></h1><p>{g.summary}</p><div className="detail-actions"><Link className="primary" href="/contribute">补充证据</Link><Link href="/timeline">查看历史流变</Link></div></div><dl className="facts"><div><dt>时间范围</dt><dd>{g.period}</dd></div><div><dt>使用场景</dt><dd>{g.usage}</dd></div><div><dt>常见材料</dt><dd>{g.material}</dd></div><div><dt>颜色记录</dt><dd>{g.color}</dd></div></dl></section>
    <section className="detail-layout"><article><section className="detail-section"><p className="eyebrow">FORM & STRUCTURE</p><h2>形制辨识</h2><div className="feature-row">{g.features.map((f,i)=><span key={f}><b>0{i+1}</b>{f}</span>)}</div><p className="caution">形制特征用于组织线索，不意味着同名服饰在所有时期具有完全一致的结构。</p></section><section className="detail-section"><p className="eyebrow">TEXTUAL EVIDENCE</p><h2>古籍证据</h2><blockquote>“{excerpts[1].text}”<cite>{excerpts[1].book} · {excerpts[1].note}</cite></blockquote><Link href="/texts">返回上下文阅读 →</Link></section><section className="detail-section"><p className="eyebrow">VISUAL EVIDENCE</p><h2>图像与文物线索</h2><div className="visual-evidence"><div className="evidence-placeholder"><span>图</span><small>历史图像位置<br/>来源待补</small></div><div><Status value="待补"/><h3>需要一条来源清晰的图像证据</h3><p>建议补充作品名、创作年代、收藏机构、稳定链接与图像使用条件。</p><Link href="/contribute">我来补充 →</Link></div></div></section></article><aside className="evidence-rail"><h2>证据概况</h2><div className="score-ring"><b>{g.evidence}</b><span>条线索</span></div><ul><li><span>古籍原文</span><b>3</b></li><li><span>历史图像</span><b>2</b></li><li><span>文物资料</span><b>1</b></li><li><span>研究解释</span><b>2</b></li></ul><div className="open-question"><b>待解问题</b><p>不同历史时期中，该名称和实物形态是否存在语义错位？</p></div></aside></section>
  </Shell>;
}

function Timeline(){ const [mode,setMode]=useState("时代"); return <Shell><PageIntro kicker="HISTORICAL FLOW" title="衣冠流变" desc="朝代是时间的刻度，不是服饰变化的断裂线。这里同时记录延续、转化、复古与争议。" aside={<div className="segmented"><button className={mode==="时代"?"active":""} onClick={()=>setMode("时代")}>按时代</button><button className={mode==="服饰"?"active":""} onClick={()=>setMode("服饰")}>按服饰</button></div>}/><section className="timeline">{mode==="时代"?periods.map((p,i)=><article key={p[0]}><div className="time-marker"><span>{String(i+1).padStart(2,"0")}</span></div><div><p className="eyebrow">{i===0?"ORIGIN":i===periods.length-1?"RECONSTRUCTION":"CONTINUITY"}</p><h2>{p[0]}<small>{p[1]}</small></h2><p>{p[2]}</p><div className="timeline-links">{garments.filter((_,n)=>n%6===i).slice(0,3).map(g=><Link href={`/garments/${g.id}`} key={g.id}>{g.name} ↗</Link>)}</div></div><div className="timeline-note">{i===2?"多源交融":i===5?"复古与新制":"延续与变化"}</div></article>):<div className="garment-flow"><h2>圆领袍的长时段线索</h2><p>选择服饰后，沿时间查看名称、形制、使用群体和证据类型的变化。</p>{["北朝：早期图像线索","隋唐：广泛流行与制度化","宋元：形制延续并发生变化","明代：官服与常服语境中的再组织"].map((x,i)=><div key={x}><b>0{i+1}</b><span>{x}</span><Status value={i===0?"待校核":i===3?"争议":"已审核"}/></div>)}</div>}</section></Shell> }

function Evidence(){return <Shell><PageIntro kicker="EVIDENCE DOSSIERS" title="图文互证" desc="精选专题不替代词条，而是围绕一个问题，把不同类型证据放回各自的边界中。"/><section className="dossiers">{evidenceCases.map((c,i)=><article key={c.title}><header><span>案卷 {String(i+1).padStart(2,"0")}</span><Status value={c.status}/></header><div className="dossier-main"><div className="dossier-visual"><span>{["袍","衣","巾","色","摇"][i]}</span></div><div>{c.types.map(t=><span className="tag" key={t}>{t}</span>)}<h2>{c.title}</h2><p>{c.question}</p><div className="evidence-chain"><span>文字记载</span><i>→</i><span>名物解释</span><i>→</i><span>视觉线索</span><i>→</i><span>研究判断</span></div><Link href={`/garments/${c.garment}`}>打开案卷 →</Link></div></div></article>)}</section></Shell>}

type Submission={id?:number;type:string;title:string;garment:string;content:string;period:string;source:string;institution:string;sourceUrl:string;copyright:string;contributor:string;notes:string;status?:string;reviewNote?:string;createdAt?:string};
const initial:Submission={type:"古籍原文",title:"",garment:"",content:"",period:"",source:"",institution:"",sourceUrl:"",copyright:"",contributor:"",notes:""};

function Contribute(){const [form,setForm]=useState(initial);const [file,setFile]=useState<File|null>(null);const [message,setMessage]=useState("");const [busy,setBusy]=useState(false); const set=(k:keyof Submission,v:string)=>setForm({...form,[k]:v});
  async function submit(e:FormEvent){e.preventDefault();setBusy(true);setMessage("");try{const fd=new FormData();Object.entries(form).forEach(([k,v])=>fd.append(k,String(v)));if(file)fd.append("image",file);const res=await fetch("/api/submissions",{method:"POST",body:fd});const data=await res.json();if(!res.ok)throw new Error(data.error||"提交失败");setMessage(`提交成功，记录号 #${data.submission.id}，当前状态：待审核。`);setForm(initial);setFile(null)}catch(err){setMessage(err instanceof Error?err.message:"提交失败，请稍后再试")}finally{setBusy(false)}}
  return <Shell><PageIntro kicker="OPEN ARCHIVE" title="共建衣冠" desc="一次可靠的贡献，不只是一张图片，更是它从哪里来、能说明什么、不能说明什么。"/><section className="contribute-layout"><form className="contribution-form" onSubmit={submit}><div className="form-heading"><span>贡献表 · 一期</span><Status value="提交后待审核"/><h2>补充一条服饰证据</h2><p>带 * 为必填。未经审核的内容不会进入正式知识页面。</p></div><div className="form-grid"><label>证据类型 *<select required value={form.type} onChange={e=>set("type",e.target.value)}>{["古籍原文","古画","壁画","文物","研究文献","现代复原","影视材料"].map(x=><option key={x}>{x}</option>)}</select></label><label>标题 *<input required value={form.title} onChange={e=>set("title",e.target.value)} placeholder="一句话说明这条线索"/></label><label>关联服饰 *<select required value={form.garment} onChange={e=>set("garment",e.target.value)}><option value="">请选择</option>{garments.map(g=><option value={g.id} key={g.id}>{g.name}</option>)}</select></label><label>年代或时间范围<input value={form.period} onChange={e=>set("period",e.target.value)} placeholder="如：唐代中期 / 约8世纪"/></label><label className="wide">原文或证据说明 *<textarea required rows={5} value={form.content} onChange={e=>set("content",e.target.value)} placeholder="请说明它与该服饰的关系，也可指出不确定之处。"/></label><label>作者 / 出处 *<input required value={form.source} onChange={e=>set("source",e.target.value)} placeholder="书名、作品名或文献作者"/></label><label>收藏机构<input value={form.institution} onChange={e=>set("institution",e.target.value)} placeholder="博物馆、图书馆等"/></label><label>来源链接 *<input type="url" required value={form.sourceUrl} onChange={e=>set("sourceUrl",e.target.value)} placeholder="https://"/></label><label>版权 / 使用条件 *<input required value={form.copyright} onChange={e=>set("copyright",e.target.value)} placeholder="如：公共领域、CC BY、仅作链接引用"/></label><label>贡献者署名 *<input required value={form.contributor} onChange={e=>set("contributor",e.target.value)} placeholder="你的公开署名"/></label><label>上传图片<input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)}/><small>图片将保存到对象存储，支持常见图片格式。</small></label><label className="wide">补充说明<textarea rows={3} value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="版本差异、版权备注、疑问等"/></label></div><label className="consent"><input required type="checkbox"/>我确认已如实填写来源，并理解提交内容需要经过人工审核。</label><button className="submit-button" disabled={busy}>{busy?"正在入卷…":"提交证据，等待审核 →"}</button>{message&&<p className="form-message" role="status">{message}</p>}</form><aside className="guideline"><p className="eyebrow">CONTRIBUTION GUIDE</p><h2>什么是一条好证据？</h2><ol><li><b>可追溯</b><span>能回到原书、原藏品页或可靠研究文献。</span></li><li><b>说明边界</b><span>说清它能证明什么，也承认不能证明什么。</span></li><li><b>尊重版权</b><span>公开可浏览不等于可以自由复制使用。</span></li><li><b>允许争议</b><span>不同观点并置，交由来源和论证接受检验。</span></li></ol><div className="needs"><b>本周待补</b><p>幞头 · 缺少可公开使用的实物图像</p><p>绯色 · 需要补充制度原文版本信息</p><p>褙子 · 需要宋元时期对照材料</p></div></aside></section></Shell>}

function Review(){const [items,setItems]=useState<Submission[]>([]);const [loading,setLoading]=useState(true);const [notice,setNotice]=useState("");async function load(){setLoading(true);try{const r=await fetch("/api/submissions");const d=await r.json();setItems(d.submissions||[])}finally{setLoading(false)}}useEffect(()=>{load()},[]);async function act(id:number,status:string){const note=window.prompt("请输入审核意见（可简短说明）：")||"演示审核操作";const r=await fetch(`/api/submissions/${id}`,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({status,reviewNote:note})});if(r.ok){setNotice(`记录 #${id} 已更新为 ${status}`);load()}}
 return <Shell><PageIntro kicker="REVIEW DEMONSTRATION" title="证据审核" desc="比赛流程演示页：这里展示审核逻辑，不代表已经配置生产级账号权限。" aside={<Status value="演示后台"/>}/><section className="review-board"><div className="review-warning">未经审核的内容不会进入正式词条。审核通过后，证据才会沿关联服饰公开展示。</div>{loading?<p>正在展开待审卷宗…</p>:items.length===0?<div className="empty-state"><span>空</span><h2>目前没有投稿记录</h2><p>请先从“参与共建”页面提交一条测试证据。</p><Link href="/contribute">去提交 →</Link></div>:items.map(x=><article className="review-item" key={x.id}><header><b>#{x.id} · {x.type}</b><Status value={x.status||"pending"}/></header><h2>{x.title}</h2><p>{x.content}</p><dl><div><dt>关联服饰</dt><dd>{garments.find(g=>g.id===x.garment)?.name||x.garment}</dd></div><div><dt>来源</dt><dd>{x.source}</dd></div><div><dt>贡献者</dt><dd>{x.contributor}</dd></div><div><dt>版权</dt><dd>{x.copyright}</dd></div></dl>{x.reviewNote&&<p className="review-note">审核意见：{x.reviewNote}</p>}<div className="review-actions"><button onClick={()=>act(x.id!,"approved")}>通过并公开</button><button onClick={()=>act(x.id!,"rejected")}>退回补充</button><button onClick={()=>act(x.id!,"disputed")}>标记争议</button></div></article>)}{notice&&<p className="toast" role="status">{notice}</p>}</section></Shell>}

function Lab(){const [sample,setSample]=useState(0);const results=[["隋唐","68%","宋元 21%"],["秦汉","56%","魏晋南北朝 29%"],["宋元","61%","隋唐 24%"]];return <Shell><PageIntro kicker="EXPERIMENTAL TOOL" title="AI 衣冠辨识实验" desc="模型提供探索线索，不替代文物鉴定、服饰史研究或来源核验。" aside={<Status value="实验性功能"/>}/><section className="lab"><div className="lab-samples"><h2>选择预计算案例</h2>{["圆领袍人物图像","交领长衣图像","幞头与袍服图像"].map((x,i)=><button className={sample===i?"active":""} onClick={()=>setSample(i)} key={x}><span>0{i+1}</span>{x}</button>)}</div><div className="heatmap-demo"><div className="silhouette"><i/><i/><i/></div><span>模型关注区域示意</span></div><div className="lab-result"><p className="eyebrow">TEMPORAL TENDENCY</p><h2>可能的时代范围</h2><strong>{results[sample][0]} <small>{results[sample][1]}</small></strong><div className="probability"><i style={{width:results[sample][1]}}/></div><p>相邻时期倾向：{results[sample][2]}</p><h3>关联知识</h3><div className="recommendations"><Link href="/garments/yuanlingpao">圆领袍</Link><Link href="/garments/futou">幞头</Link><Link href="/garments/dai">带</Link></div><div className="ai-caution">仅用于数字人文探索，不构成文物鉴定或权威断代。AI结果不能未经审核直接进入公共证据库。</div></div></section></Shell>}

function About(){return <Shell><PageIntro kicker="ABOUT THE PROJECT" title="关于衣冠藏卷" desc="平台从少量可靠种子内容出发，让每一条新增线索都保留来源、审核状态与讨论空间。"/><section className="about"><h2>不是建一座封闭的数据库</h2><p>“衣冠藏卷”关注的不只是已经整理好的答案，也关注知识如何被发现、连接、核验和修正。项目组先搭建框架并完成典型案例，研究者与文化爱好者可以持续补充古籍、图像、文物和研究证据。</p><div className="about-grid"><div><b>01</b><h3>来源优先</h3><p>每一条公开证据都应能追溯到原始材料或可靠研究。</p></div><div><b>02</b><h3>审核公开</h3><p>明确区分已审核、待审核、有争议和演示内容。</p></div><div><b>03</b><h3>共同生长</h3><p>用待补清单邀请参与，让内容不足成为开放协作的起点。</p></div></div></section></Shell>}

export function SiteApp({route}:{route:string[]}) {const [first,id]=route;if(!first)return <Home/>;if(first==="texts")return <Texts/>;if(first==="garments"&&id)return <GarmentDetail id={id}/>;if(first==="garments")return <Garments/>;if(first==="timeline")return <Timeline/>;if(first==="evidence")return <Evidence/>;if(first==="contribute")return <Contribute/>;if(first==="review")return <Review/>;if(first==="lab")return <Lab/>;if(first==="about")return <About/>;return <Shell><div className="not-found"><span>佚</span><h1>此页尚未入卷</h1><Link href="/">返回首页</Link></div></Shell>}

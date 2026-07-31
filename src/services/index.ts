const delay=(ms=550)=>new Promise<void>(r=>setTimeout(r,ms));
export const apiClient={baseUrl:import.meta.env.VITE_API_BASE_URL||'https://api.example.com'};
export const mockProjectService={async create<T>(project:T){await delay();return project},async list(){await delay();return import('../data/mockData').then(m=>m.projects)}};
export const mockScriptService={async improve(text:string){await delay();return `${text}\n\n【AI建议】在开场加入一个异常细节，让悬念更早建立。`}};
export const mockAssetService={async extract(){await delay(800);return {characters:4,scenes:4,props:3}}};
export const mockGenerationService={async generate(type:'image'|'video'){await delay(900);return {id:crypto.randomUUID(),type,status:'成功（演示）'}}};
export const mockReverseVideoService={async analyse(){await delay(1000);return {shots:12,style:'低饱和电影感',status:'演示分析完成'}}};

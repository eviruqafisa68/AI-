const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const state = { files: [] };

function showToast(text = "已复制") {
  const toast = $("#toast");
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1600);
}

function switchSection(target) {
  $$(".panel-section").forEach(el => el.classList.toggle("active-section", el.id === target));
  $$(".nav-item").forEach(el => el.classList.toggle("active", el.dataset.target === target));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

$$(".nav-item").forEach(btn => btn.addEventListener("click", () => switchSection(btn.dataset.target)));

function renderFiles() {
  const list = $("#fileList");
  list.innerHTML = state.files.map((file, index) => `
    <div class="file-item">
      <b>${file.name}</b>
      <span>${(file.size / 1024 / 1024).toFixed(2)} MB · <button data-remove="${index}" style="all:unset;color:#ff8768;cursor:pointer">移除</button></span>
    </div>`).join("");
  $$('[data-remove]').forEach(btn => btn.addEventListener('click', () => {
    state.files.splice(Number(btn.dataset.remove), 1);
    renderFiles();
  }));
}

function addFiles(fileList) {
  state.files.push(...[...fileList]);
  renderFiles();
}

$("#fileInput").addEventListener("change", e => addFiles(e.target.files));
const dropzone = $("#dropzone");
["dragenter", "dragover"].forEach(event => dropzone.addEventListener(event, e => {
  e.preventDefault(); dropzone.classList.add("dragover");
}));
["dragleave", "drop"].forEach(event => dropzone.addEventListener(event, e => {
  e.preventDefault(); dropzone.classList.remove("dragover");
}));
dropzone.addEventListener("drop", e => addFiles(e.dataTransfer.files));

$("#clearUrlBtn").addEventListener("click", () => $("#videoUrl").value = "");

$$(".chip").forEach(chip => chip.addEventListener("click", () => chip.classList.toggle("selected")));
$$("input[name='depth']").forEach(radio => radio.addEventListener("change", () => {
  $$(".depth-card").forEach(card => card.classList.toggle("selected-depth", card.querySelector("input").checked));
}));

function getSelected(selector) {
  return $$(selector).filter(el => el.checked || el.classList.contains("selected")).map(el => el.value || el.dataset.value);
}

function buildTaskPrompt() {
  const files = state.files.length ? state.files.map(f => f.name).join("、") : "未上传文件";
  const url = $("#videoUrl").value.trim() || "未提供链接";
  const notes = $("#materialNotes").value.trim() || "无额外说明";
  const focuses = $$("#focusChips .selected").map(el => el.dataset.value).join("、") || "完整拆解";
  const preserves = $$("#preserveOptions input:checked").map(el => el.value).join("、") || "未指定";
  const depth = $("input[name='depth']:checked").value;

  return `${FULL_SYSTEM_PROMPT}\n\n---\n\n# 本次分析任务\n\n请按照以上“AI短视频／短剧镜头拆解与提示词反推专家指令”，分析我提供的视频素材。\n\n## 输入素材\n- 上传文件：${files}\n- 视频链接：${url}\n- 素材补充说明：${notes}\n\n## 本次分析目标\n- 分析重点：${focuses}\n- 生成用途：${$("#usage").value}\n- 目标平台：${$("#platform").value}\n- 输出比例：${$("#ratio").value}\n- 单镜头目标时长：${$("#shotDuration").value}\n- 完整视频目标时长：${$("#totalDuration").value}\n- 重点保留：${preserves}\n- 输出深度：${depth}\n\n## 执行要求\n1. 先判断素材是否足以支撑完整分析。\n2. 如可读取完整视频，先输出镜头时间码目录，再逐镜头展开。\n3. 如只能读取截图或文字，只分析可确认信息，不虚构缺失镜头。\n4. 对复杂长镜头给出拆镜方案。\n5. 最终输出可直接用于AI视频生成工具的中文、英文、精简版、运镜版、表演版、首尾帧和负面提示词。\n\n现在开始分析。`;
}

function generate() {
  const prompt = buildTaskPrompt();
  $("#emptyOutput").classList.add("hidden");
  $("#promptOutput").classList.remove("hidden");
  $("#promptOutput").textContent = prompt;
  $("#promptOutput").scrollTop = 0;
  document.querySelector(".output-card").scrollIntoView({ behavior: "smooth", block: "start" });
}

$("#generateBtn").addEventListener("click", generate);
$("#copyBtn").addEventListener("click", async () => {
  const text = $("#promptOutput").textContent || buildTaskPrompt();
  await navigator.clipboard.writeText(text);
  showToast("任务包已复制");
});
$("#copySystemBtn").addEventListener("click", async () => {
  await navigator.clipboard.writeText(FULL_SYSTEM_PROMPT);
  showToast("总指令已复制");
});
$("#downloadBtn").addEventListener("click", () => {
  const text = $("#promptOutput").textContent || buildTaskPrompt();
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `AI视频反推分析任务_${new Date().toISOString().slice(0,10)}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
});

$("#loadDemoBtn").addEventListener("click", () => {
  $("#videoUrl").value = "https://example.com/reference-video";
  $("#materialNotes").value = "重点分析人物从克制到情绪崩溃的微表情变化，保留冷蓝色夜景、浅景深、缓慢推进和低频氛围音。";
  $("#platform").value = "可灵";
  $("#usage").value = "首尾帧生成";
  $("#ratio").value = "9:16 竖屏";
  generate();
});

const accordion = $("#instructionAccordion");
accordion.innerHTML = SYSTEM_PROMPT_SECTIONS.map((section, index) => `
  <article class="accordion-item ${index === 0 ? 'open' : ''}">
    <button class="accordion-head"><span>${section.title}</span><span>＋</span></button>
    <div class="accordion-body">${section.body}</div>
  </article>`).join("");
$$(".accordion-head").forEach(head => head.addEventListener("click", () => head.parentElement.classList.toggle("open")));

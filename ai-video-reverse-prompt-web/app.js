const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let zoom = 1;
let nodeCount = 4;

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 1800);
}

function selectNode(node) {
  $$(".flow-node").forEach((item) => item.classList.remove("selected"));
  node.classList.add("selected");
  const name = node.dataset.node || $("header b", node).textContent;
  $("#propertyTitle").textContent = name;
  $("#nodeName").value = $("header b", node).textContent;
}

function bindNode(node) {
  node.addEventListener("click", (event) => {
    event.stopPropagation();
    selectNode(node);
  });
  let dragging = false;
  let origin = null;
  node.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    dragging = true;
    origin = { x: event.clientX, y: event.clientY, left: node.offsetLeft, top: node.offsetTop };
    node.setPointerCapture(event.pointerId);
  });
  node.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    node.style.left = `${Math.max(20, origin.left + (event.clientX - origin.x) / zoom)}px`;
    node.style.top = `${Math.max(20, origin.top + (event.clientY - origin.y) / zoom)}px`;
  });
  node.addEventListener("pointerup", () => { dragging = false; });
}

$$(".flow-node").forEach(bindNode);

$("#nodeSearch").addEventListener("input", (event) => {
  const key = event.target.value.trim().toLowerCase();
  $$(".library-node").forEach((node) => {
    node.style.display = node.textContent.toLowerCase().includes(key) ? "flex" : "none";
  });
});

$$(".library-node").forEach((button) => button.addEventListener("click", () => {
  const type = button.dataset.type;
  const node = document.createElement("article");
  node.className = "flow-node new-node";
  node.dataset.node = type;
  node.style.cssText = `left:${260 + nodeCount * 35}px;top:${360 + (nodeCount % 3) * 25}px`;
  node.innerHTML = `<i class="port in"></i><header>${$(".node-symbol", button).outerHTML}<span><b>${type}</b><small>NEW NODE</small></span><button>•••</button></header><div class="node-body stack"><label>状态 <span>待配置</span></label><label>输入 <span>未连接</span></label></div><footer><i class="warning"></i> 请完成配置</footer><i class="port out"></i>`;
  $("#workflowCanvas").append(node);
  nodeCount += 1;
  bindNode(node);
  selectNode(node);
  toast(`已添加「${type}」节点`);
}));

$("#saveNode").addEventListener("click", () => {
  const selected = $(".flow-node.selected");
  if (selected) $("header b", selected).textContent = $("#nodeName").value.trim() || selected.dataset.node;
  toast("节点配置已保存");
});

function setZoom(value) {
  zoom = Math.min(1.4, Math.max(0.6, value));
  $("#workflowCanvas").style.transform = `scale(${zoom})`;
  $("#zoomValue").textContent = `${Math.round(zoom * 100)}%`;
}
$("#zoomIn").addEventListener("click", () => setZoom(zoom + 0.1));
$("#zoomOut").addEventListener("click", () => setZoom(zoom - 0.1));
$("#fitCanvas").addEventListener("click", () => setZoom(0.8));

$("#runWorkflow").addEventListener("click", () => {
  const panel = $("#runPanel");
  panel.classList.add("show");
  const steps = [[25, "正在读取视频输入..."], [50, "正在进行智能镜头拆解..."], [75, "正在生成创意文案..."], [100, "工作流运行完成"]];
  let index = 0;
  clearInterval(window.runTimer);
  const update = () => {
    const [percent, text] = steps[index];
    $("#runPercent").textContent = `${percent}%`;
    $("#runStatus").textContent = text;
    if (percent === 100) { $(".spinner", panel).classList.add("done"); clearInterval(window.runTimer); }
    index = Math.min(index + 1, steps.length - 1);
  };
  update();
  window.runTimer = setInterval(update, 850);
});
$("#closeRun").addEventListener("click", () => $("#runPanel").classList.remove("show"));
$("#newWorkflow").addEventListener("click", () => toast("已创建空白工作流"));
$("#workflowCanvas").addEventListener("click", () => $$(".flow-node").forEach((node) => node.classList.remove("selected")));

document.addEventListener("keydown", (event) => {
  if (event.key !== "Delete" || ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
  const selected = $(".flow-node.selected");
  if (selected) { selected.remove(); toast("节点已删除"); }
});

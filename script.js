class Task {
    constructor(id, text, completed = false) {
      this.id = id;
      this.text = text;
      this.completed = completed;
    }
  }
  
  const $ = (sel) => document.querySelector(sel);
  const input = $("#taskInput");
  const addBtn = $("#addBtn");
  const list = $("#taskList");
  const stats = $("#stats");
  const emptyState = $("#emptyState");
  
  let tasks = [];
  try {
    const raw = localStorage.getItem("tasks:v1");
    if (raw) tasks = JSON.parse(raw).map(t => new Task(t.id, t.text, t.completed));
  } catch (_) {}
  
  function save() {
    localStorage.setItem("tasks:v1", JSON.stringify(tasks));
  }
  
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }
  function escapeHTML(s) {
    return s.replace(/[&<>"']/g, c => ({'&':'&','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c));
  }
  
  function render() {
    if (tasks.length === 0) {
      list.innerHTML = "";
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
      list.innerHTML = tasks.map(t => `
        <li class="task ${t.completed ? 'completed' : ''}" data-id="${t.id}">
          <button class="toggle" role="switch" aria-checked="${t.completed}" title="Toggle complete">${t.completed ? '✓' : ''}</button>
          <span class="text">${escapeHTML(t.text)}</span>
          <button class="delete" title="Delete">✕</button>
        </li>
      `).join("");
    }
    const done = tasks.filter(t => t.completed).length;
    stats.textContent = tasks.length ? `${done}/${tasks.length} completed` : "";
    save();
  }
  
  function addTask() {
    const text = input.value.trim();
    if (!text) return;
    tasks.push(new Task(uid(), text, false));
    input.value = "";
    render();
    input.focus();
  }
  
  function toggleTask(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    t.completed = !t.completed;
    render();
  }
  
  function deleteTask(id) {
    tasks = tasks.filter(x => x.id !== id);
    render();
  }
  
  addBtn.addEventListener("click", addTask);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
  });
  
  list.addEventListener("click", (e) => {
    const item = e.target.closest(".task");
    if (!item) return;
    const id = item.getAttribute("data-id");
  
    if (e.target.classList.contains("delete")) {
      deleteTask(id);
      return;
    }
    if (e.target.classList.contains("toggle") || e.target.classList.contains("text") || e.target === item) {
      toggleTask(id);
    }
  });
  
  render();
  
import { STUDIOS, SUPPORTS } from "./data.js";

const FAVORITES_KEY = "stagelink_favorites_v1";

function getFavorites(){
  try{
    const raw = localStorage.getItem(FAVORITES_KEY);
    if(!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  }catch(_e){ return []; }
}
function setFavorites(ids){ localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids)); }
function toggleFavorite(id){
  const ids = new Set(getFavorites());
  ids.has(id) ? ids.delete(id) : ids.add(id);
  setFavorites(Array.from(ids));
}
function supportSymbol(v){
  if(v === "yes") return {sym:"✓", cls:"dotYes", text:"あり"};
  if(v === "no") return {sym:"×", cls:"dotNo", text:"なし"};
  return {sym:"?", cls:"dotUnk", text:"不明"};
}
function esc(s){
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function sortStudios(list, sortKey){
  const copy = [...list];
  if(sortKey === "name_asc") copy.sort((a,b)=>a.name.localeCompare(b.name, "ja"));
  if(sortKey === "name_desc") copy.sort((a,b)=>b.name.localeCompare(a.name, "ja"));
  if(sortKey === "checked_desc") copy.sort((a,b)=>String(b.lastChecked).localeCompare(String(a.lastChecked)));
  if(sortKey === "checked_asc") copy.sort((a,b)=>String(a.lastChecked).localeCompare(String(b.lastChecked)));
  return copy;
}
function iconHeart(){
  return `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21s-7.5-4.7-9.7-9C.7 8.7 2.3 5.7 5.6 5.2c1.9-.3 3.6.5 4.7 1.7 1.1-1.2 2.8-2 4.7-1.7 3.3.5 4.9 3.5 3.3 6.8C19.5 16.3 12 21 12 21z" stroke="#0b1220" stroke-width="1.8" fill="rgba(255,255,255,0)"/>
  </svg>`;
}
function iconTrash(){
  return `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 6h18" stroke="#334155" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M8 6V4.8c0-.9.7-1.6 1.6-1.6h4.8c.9 0 1.6.7 1.6 1.6V6" stroke="#334155" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M7 6l1 15c.1 1 .9 1.8 2 1.8h4c1.1 0 1.9-.8 2-1.8l1-15" stroke="#334155" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M10 11v7" stroke="#334155" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M14 11v7" stroke="#334155" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`;
}

function renderSidebar(activeId){
  const side = document.querySelector("[data-side]");
  if(!side) return;

  const favInput = side.querySelector("[data-fav-search]");
  const favSort = side.querySelector("[data-fav-sort]");
  const listEl = side.querySelector("[data-fav-list]");
  const countEl = side.querySelector("[data-fav-count]");

  function rerender(){
    const favIds = getFavorites();
    countEl.textContent = `${favIds.length}件`;

    const q = (favInput?.value || "").trim().toLowerCase();
    const sortKey = favSort?.value || "checked_desc";

    let favStudios = STUDIOS.filter(s => favIds.includes(s.id));
    if(q) favStudios = favStudios.filter(s => s.name.toLowerCase().includes(q));
    favStudios = sortStudios(favStudios, sortKey);

    if(!favStudios.length){
      listEl.innerHTML = `<div class="sideNotice" style="padding:14px 10px;">まだ保存がありません。</div>`;
      return;
    }

    listEl.innerHTML = favStudios.map(s => {
      const active = s.id === activeId ? ' style="border-color: rgba(77,163,255,.35); background: rgba(255,255,255,.97);"' : "";
      return `
        <a class="sideItem"${active} href="detail.html?id=${encodeURIComponent(s.id)}">
          <div>
            <div class="sideItemTitle">${esc(s.name)}</div>
            <div class="sideItemMeta">最終確認日: ${esc(s.lastChecked || "-")}</div>
          </div>
          <button class="iconBtn" data-unfav="${esc(s.id)}" aria-label="保存解除">${iconTrash()}</button>
        </a>
      `;
    }).join("");

    listEl.querySelectorAll("[data-unfav]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault(); e.stopPropagation();
        const id = btn.getAttribute("data-unfav");
        toggleFavorite(id);
        rerender();
        document.querySelectorAll(`[data-heart="${CSS.escape(id)}"]`).forEach(h => {
          h.dataset.on = String(getFavorites().includes(id));
        });
      });
    });
  }

  favInput?.addEventListener("input", rerender);
  favSort?.addEventListener("change", rerender);
  rerender();
}

function renderListings(){
  const wrap = document.querySelector("[data-listings]");
  if(!wrap) return;

  const qEl = document.querySelector("[data-search]");
  const filterBox = document.querySelector("[data-filter-box]");

  function apply(){
    const q = (qEl?.value || "").trim().toLowerCase();
    const f = {};
    SUPPORTS.forEach(m => {
      const cb = filterBox.querySelector(`input[data-filter="${m.key}"]`);
      f[m.key] = !!cb?.checked;
    });

    let list = STUDIOS.slice();
    if(q) list = list.filter(s => s.name.toLowerCase().includes(q));
    Object.keys(f).forEach(k => { if(f[k]) list = list.filter(s => (s.supports?.[k] || "unknown") === "yes"); });

    if(!list.length){
      wrap.innerHTML = `<div class="noticeBanner">条件に合う募集が見つかりません。検索語を短くするか、絞り込みを外してください。</div>`;
      return;
    }

    const favIds = getFavorites();
    wrap.innerHTML = list.map(s => {
      const pills = SUPPORTS.map(m => {
        const val = s.supports?.[m.key] || "unknown";
        const {sym, cls, text} = supportSymbol(val);
        return `<div class="supportPill" title="${esc(m.label)}"><span class="dot ${cls}">${sym}</span><span>${esc(text)}</span></div>`;
      }).join("");

      const on = favIds.includes(s.id);
      return `
        <div class="card studioCard">
          <div style="min-width:0;">
            <h3 class="studioName">${esc(s.name)}</h3>
            <div class="studioStatus">${esc(s.status)}</div>
            <div class="kv">最終確認日: ${esc(s.lastChecked || "-")}</div>
            <div class="supportRow">${pills}</div>
          </div>
          <div class="cardActions">
            <button class="heart" data-heart="${esc(s.id)}" data-on="${on ? "true":"false"}" aria-label="保存">${iconHeart()}</button>
            <a class="btnPrimary" href="detail.html?id=${encodeURIComponent(s.id)}" style="min-width:160px; padding:12px 16px;">詳細を見る</a>
          </div>
        </div>
      `;
    }).join("");

    wrap.querySelectorAll("[data-heart]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-heart");
        toggleFavorite(id);
        btn.dataset.on = String(getFavorites().includes(id));
        renderSidebar();
      });
    });
  }

  qEl?.addEventListener("input", apply);
  filterBox?.addEventListener("change", apply);
  apply();
}

function renderDetail(){
  const detail = document.querySelector("[data-detail]");
  if(!detail) return;

  const params = new URLSearchParams(location.search);
  const id = params.get("id") || "";
  const studio = STUDIOS.find(s => s.id === id);

  if(!studio){
    detail.innerHTML = `<div class="noticeBanner">指定の事務所が見つかりませんでした。募集一覧から選び直してください。</div>`;
    renderSidebar();
    return;
  }

  const on = getFavorites().includes(studio.id);

  const rows = SUPPORTS.map(m => {
    const val = studio.supports?.[m.key] || "unknown";
    const {sym, cls, text} = supportSymbol(val);
    return `
      <div class="tr">
        <div class="th">${esc(m.label)}</div>
        <div class="td" style="display:flex; gap:8px; align-items:center;">
          <span class="dot ${cls}">${sym}</span><span style="font-weight:950;">${esc(text)}</span>
        </div>
      </div>
    `;
  }).join("");

  detail.innerHTML = `
    <div class="card detailTop">
      <div class="detailHead">
        <div>
          <h1>${esc(studio.name)}</h1>
          <div class="kv">${esc(studio.status)}</div>
          <div class="kv" style="margin-top:6px;">最終確認日: ${esc(studio.lastChecked || "-")}</div>
        </div>
        <div class="linkRow">
          <a class="linkBtn" href="${esc(studio.officialUrl)}" target="_blank" rel="noopener">公式サイト</a>
          <a class="linkBtn" href="${esc(studio.recruitUrl)}" target="_blank" rel="noopener">募集ページ</a>
          <button class="heart" data-heart="${esc(studio.id)}" data-on="${on ? "true":"false"}" aria-label="保存">${iconHeart()}</button>
        </div>
      </div>

      <div class="noteBar">${esc(studio.summary || "")}</div>

      <div class="table" role="table" aria-label="サポート表">${rows}</div>

      <div style="margin-top:16px; display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
        <a class="btnPrimary" href="${esc(studio.recruitUrl)}" target="_blank" rel="noopener">公式応募ページへ</a>
        <span class="pill">最終確認日: ${esc(studio.lastChecked || "-")}</span>
      </div>

      <div class="footerNote">応募・契約は各社規定。当サイトは応募や契約に関与しません。掲載情報は公式公開情報をもとに整理し、確認できない項目は「不明」として扱います。</div>
    </div>
  `;

  detail.querySelector("[data-heart]")?.addEventListener("click", () => {
    toggleFavorite(studio.id);
    detail.querySelector("[data-heart]").dataset.on = String(getFavorites().includes(studio.id));
    renderSidebar(studio.id);
  });

  renderSidebar(studio.id);
}

function mountCommon(){
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach(a => {
    if(a.getAttribute("href") === path) a.style.background = "rgba(77,163,255,.10)";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  mountCommon();
  renderSidebar();
  renderListings();
  renderDetail();
});

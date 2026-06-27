(function () {
  'use strict';

  const slug = getQueryParam('cat');
  const cat = getCategory(slug);

  if (!cat) {
    window.location.href = 'index.html';
    return;
  }
  if (!isAuthenticated(slug)) {
    window.location.href = 'login.html?cat=' + encodeURIComponent(slug);
    return;
  }

  // Isi judul & footer halaman
  document.getElementById('pageTitle').textContent = cat.label + ' · Data Center';
  document.getElementById('categoryTitle').innerHTML = `<i class="bi ${cat.icon} me-2"></i>${cat.label}`;
  document.getElementById('pageFooter').textContent = 'Data Center · ' + cat.label;
  document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    clearAuthenticated(slug);
    window.location.href = 'index.html';
  });

  let currentSheets = [];
  let activeSheet = null;
  let currentHeaders = [];
  let currentRows = [];
  let filteredRows = [];
  let searchTimer = null;

  const tabsEl = document.getElementById('sheetTabs');
  const tableContainer = document.getElementById('tableContainer');
  const searchInput = document.getElementById('searchInput');
  const rowCountPill = document.getElementById('rowCountPill');
  const downloadBtn = document.getElementById('downloadBtn');

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatCellValue(value) {
    if (value === null || value === undefined || value === '') return '';
    const str = String(value);
    const isoMatch = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(str);
    if (isoMatch) {
      const d = new Date(str);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
      }
    }
    return str;
  }

  function statusBadgeClass(value) {
    const v = String(value).toUpperCase();
    if (v === 'ASSIGNED') return 'assigned';
    if (v === 'OLD') return 'old';
    return 'default';
  }

  function buildAppsScriptUrl(action, extraParams) {
    const u = new URL(cat.url);
    u.searchParams.set('action', action);
    if (extraParams) {
      Object.keys(extraParams).forEach(k => u.searchParams.set(k, extraParams[k]));
    }
    return u.toString();
  }

  async function fetchAppsScript(action, extraParams) {
    const url = buildAppsScriptUrl(action, extraParams);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('HTTP ' + res.status);
    }
    return res.json();
  }

  function renderTabs() {
    tabsEl.innerHTML = '';
    currentSheets.forEach((sheetName, idx) => {
      const li = document.createElement('li');
      li.className = 'nav-item';
      li.setAttribute('role', 'presentation');

      const btn = document.createElement('button');
      btn.className = 'nav-link' + (idx === 0 ? ' active' : '');
      btn.type = 'button';
      btn.textContent = sheetName;
      btn.addEventListener('click', () => switchSheet(sheetName, btn));

      li.appendChild(btn);
      tabsEl.appendChild(li);
    });
  }

  function setActiveTabButton(clickedBtn) {
    tabsEl.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
    if (clickedBtn) clickedBtn.classList.add('active');
  }

  function renderLoadingTable() {
    tableContainer.innerHTML = '<div class="spinner-wrap"><i class="bi bi-hourglass-split"></i> Memuat data...</div>';
  }

  function renderEmptyState(message) {
    tableContainer.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-inbox" style="font-size: 2rem;"></i>
        <p class="mt-2 mb-0">${escapeHtml(message)}</p>
      </div>`;
  }

  function renderErrorState(message) {
    tableContainer.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-wifi-off" style="font-size: 2rem; color: var(--danger);"></i>
        <p class="mt-2 mb-1" style="color: #fca5a5;">${escapeHtml(message)}</p>
        <p class="mb-0" style="font-size: 0.8rem;">
          Pastikan laptop terhubung ke internet dan URL Apps Script masih aktif (Deploy &gt; Manage deployments).
        </p>
      </div>`;
  }

  function getVisibleHeaders() {
    return currentHeaders.filter(h => h.trim() !== '');
  }

  function renderTable() {
    if (!currentHeaders.length) {
      renderEmptyState('Tidak ada kolom data pada sheet ini.');
      rowCountPill.textContent = '0 baris';
      return;
    }
    if (!filteredRows.length) {
      renderEmptyState('Tidak ada data yang cocok dengan pencarian.');
      rowCountPill.textContent = '0 baris';
      return;
    }

    const visibleHeaders = getVisibleHeaders();

    let html = '<table class="data-table"><thead><tr>';
    visibleHeaders.forEach(h => { html += `<th>${escapeHtml(h)}</th>`; });
    html += '</tr></thead><tbody>';

    filteredRows.forEach(row => {
      html += '<tr>';
      visibleHeaders.forEach(h => {
        const raw = row[h];
        if (h.trim().toUpperCase() === 'STATUS' && raw) {
          html += `<td><span class="badge-status ${statusBadgeClass(raw)}">${escapeHtml(raw)}</span></td>`;
        } else {
          html += `<td>${escapeHtml(formatCellValue(raw))}</td>`;
        }
      });
      html += '</tr>';
    });

    html += '</tbody></table>';
    tableContainer.innerHTML = html;
    rowCountPill.textContent = filteredRows.length.toLocaleString('id-ID') + ' baris';
  }

  function applySearchFilter() {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      filteredRows = currentRows;
    } else {
      filteredRows = currentRows.filter(row => {
        return currentHeaders.some(h => {
          const val = row[h];
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(q);
        });
      });
    }
    renderTable();
  }

  async function loadSheetData(sheetName) {
    renderLoadingTable();
    try {
      const json = await fetchAppsScript('data', { sheet: sheetName });
      if (json.status !== 'ok') {
        renderEmptyState(json.message || 'Gagal memuat data.');
        currentHeaders = [];
        currentRows = [];
        filteredRows = [];
        return;
      }
      currentHeaders = json.headers || [];
      currentRows = json.rows || [];
      searchInput.value = '';
      filteredRows = currentRows;
      renderTable();
    } catch (err) {
      renderErrorState('Terjadi kesalahan saat memuat data: ' + err.message);
      currentHeaders = [];
      currentRows = [];
      filteredRows = [];
    }
  }

  function switchSheet(sheetName, btnEl) {
    activeSheet = sheetName;
    setActiveTabButton(btnEl);
    loadSheetData(sheetName);
  }

  function downloadExcel() {
    if (!filteredRows.length) {
      alert('Tidak ada data untuk diunduh.');
      return;
    }
    const visibleHeaders = getVisibleHeaders();
    const aoa = [visibleHeaders];
    filteredRows.forEach(row => {
      aoa.push(visibleHeaders.map(h => row[h] ?? ''));
    });

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols'] = visibleHeaders.map(() => ({ wch: 20 }));
    // Freeze header row + autofilter sederhana
    ws['!autofilter'] = { ref: ws['!ref'] };

    const wb = XLSX.utils.book_new();
    const safeSheetName = (activeSheet || 'Data').replace(/[\\/?*\[\]:]/g, ' ').substring(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, safeSheetName || 'Data');

    const safeFileLabel = cat.label.replace(/[\\/?*\[\]:]/g, ' ');
    XLSX.writeFile(wb, `${safeFileLabel} - ${safeSheetName || 'Data'}.xlsx`);
  }

  async function init() {
    try {
      const json = await fetchAppsScript('list');
      if (json.status !== 'ok' || !json.sheets || !json.sheets.length) {
        tabsEl.innerHTML = '<li class="nav-item"><span class="nav-link disabled">Tidak ada sheet ditemukan</span></li>';
        renderEmptyState('Tidak ada data tersedia untuk kategori ini.');
        return;
      }
      currentSheets = json.sheets;
      renderTabs();
      activeSheet = currentSheets[0];
      loadSheetData(activeSheet);
    } catch (err) {
      tabsEl.innerHTML = '<li class="nav-item"><span class="nav-link disabled text-danger">Gagal memuat sheet</span></li>';
      renderErrorState('Terjadi kesalahan saat memuat daftar sheet: ' + err.message);
    }
  }

  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applySearchFilter, 200);
  });

  downloadBtn.addEventListener('click', downloadExcel);

  init();
})();

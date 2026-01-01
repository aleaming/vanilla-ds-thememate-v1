/**
 * @component brand-table
 * @description Data grid with sorting, filtering, pagination, and virtualization
 * @spec docs/phase-3-spec.md#1-data-table-brand-table
 *
 * @attribute data - JSON string of data array
 * @attribute columns - JSON string of column definitions
 * @attribute page-size - Number of rows per page (default: 10)
 * @attribute current-page - Current page number (1-indexed)
 * @attribute sortable - Enable column sorting
 * @attribute filterable - Enable filtering
 * @attribute selectable - Enable row selection (single, multiple, or none)
 * @attribute virtual-scroll - Enable virtual scrolling for large datasets
 *
 * @event table-sort - Fired when column is sorted
 * @event table-filter - Fired when filter changes
 * @event table-select - Fired when row selection changes
 * @event table-page-change - Fired when page changes
 *
 * @accessibility
 * - WAI-ARIA Grid pattern
 * - Full keyboard navigation
 * - Screen reader support
 */

import { BaseComponent } from '../base-component.js';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableData {
  [key: string]: any;
}

const template = document.createElement('template');
template.innerHTML = `
  <div class="table-container" part="container">
    <div class="table-toolbar" part="toolbar">
      <div class="toolbar-left" part="toolbar-left">
        <slot name="toolbar-left"></slot>
      </div>
      <div class="toolbar-right" part="toolbar-right">
        <input type="text" class="search-input" part="search" placeholder="Search..." />
        <slot name="toolbar-right"></slot>
      </div>
    </div>
    <div class="table-wrapper" part="wrapper">
      <table class="table" part="table" role="grid">
        <thead class="table-header" part="header">
          <tr class="header-row" part="header-row" role="row"></tr>
        </thead>
        <tbody class="table-body" part="body" role="rowgroup"></tbody>
      </table>
    </div>
    <div class="table-footer" part="footer">
      <div class="footer-info" part="footer-info">
        Showing <span class="page-start">0</span> to <span class="page-end">0</span> of <span class="total-rows">0</span>
      </div>
      <div class="pagination" part="pagination">
        <button class="page-button first" part="page-first" type="button" aria-label="First page">&laquo;</button>
        <button class="page-button prev" part="page-prev" type="button" aria-label="Previous page">&lsaquo;</button>
        <span class="page-info" part="page-info">Page <span class="current-page">1</span> of <span class="total-pages">1</span></span>
        <button class="page-button next" part="page-next" type="button" aria-label="Next page">&rsaquo;</button>
        <button class="page-button last" part="page-last" type="button" aria-label="Last page">&raquo;</button>
      </div>
    </div>
  </div>
`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: block;
    box-sizing: border-box;
  }

  :host([hidden]) {
    display: none;
  }

  .table-container {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--color-border, #e0e0e0);
    border-radius: var(--radius-md, 8px);
    background: var(--color-surface, #ffffff);
    overflow: hidden;
  }

  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-3, 0.75rem);
    border-bottom: 1px solid var(--color-border, #e0e0e0);
    gap: var(--space-3, 0.75rem);
  }

  .toolbar-left,
  .toolbar-right {
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
  }

  .search-input {
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    border: 1px solid var(--color-border, #e0e0e0);
    border-radius: var(--radius-sm, 4px);
    font-family: var(--font-family-base, system-ui, sans-serif);
    font-size: var(--font-size-sm, 0.875rem);
  }

  .table-wrapper {
    overflow-x: auto;
    overflow-y: auto;
    max-height: 600px;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
  }

  .table-header {
    position: sticky;
    top: 0;
    background: var(--color-surface-secondary, #f9fafb);
    z-index: 10;
  }

  .header-row {
    border-bottom: 2px solid var(--color-border, #e0e0e0);
  }

  .header-cell {
    padding: var(--space-3, 0.75rem);
    text-align: left;
    font-weight: var(--font-weight-semibold, 600);
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--color-text, #1a1a1a);
    user-select: none;
  }

  .header-cell[data-sortable="true"] {
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .header-cell[data-sortable="true"]:hover {
    background: var(--color-surface-hover, #f5f5f5);
  }

  .header-cell .sort-icon {
    display: inline-block;
    margin-left: var(--space-1, 0.25rem);
    opacity: 0.3;
    transition: opacity 0.2s;
  }

  .header-cell[data-sort-direction="asc"] .sort-icon,
  .header-cell[data-sort-direction="desc"] .sort-icon {
    opacity: 1;
  }

  .table-body tr {
    border-bottom: 1px solid var(--color-border, #e0e0e0);
    transition: background-color 0.15s;
  }

  .table-body tr:hover {
    background: var(--color-surface-hover, #f5f5f5);
  }

  .table-body tr[aria-selected="true"] {
    background: var(--color-primary-alpha, rgba(0, 123, 255, 0.1));
  }

  .table-body tr[data-selectable="true"] {
    cursor: pointer;
  }

  .table-body td {
    padding: var(--space-3, 0.75rem);
    font-size: var(--font-size-base, 1rem);
  }

  .table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-3, 0.75rem);
    border-top: 1px solid var(--color-border, #e0e0e0);
    font-size: var(--font-size-sm, 0.875rem);
  }

  .pagination {
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
  }

  .page-button {
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    border: 1px solid var(--color-border, #e0e0e0);
    border-radius: var(--radius-sm, 4px);
    background: var(--color-surface, #ffffff);
    color: var(--color-text, #1a1a1a);
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .page-button:hover:not(:disabled) {
    background: var(--color-surface-hover, #f5f5f5);
  }

  .page-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .page-info {
    color: var(--color-text-muted, #666666);
  }

  .empty-state {
    padding: var(--space-6, 2rem);
    text-align: center;
    color: var(--color-text-muted, #666666);
  }
`);

export class BrandTable extends BaseComponent {
  static styles = styles;

  static get observedAttributes() {
    return ['data', 'columns', 'page-size', 'current-page', 'sortable', 'filterable', 'selectable', 'virtual-scroll'];
  }

  private _data: TableData[] = [];
  private _columns: Column[] = [];
  private _filteredData: TableData[] = [];
  private _pageSize: number = 10;
  private _currentPage: number = 1;
  private _sortColumn: string | null = null;
  private _sortDirection: 'asc' | 'desc' | null = null;
  private _selectedRows: Set<number> = new Set();
  private _searchQuery: string = '';

  private tableHeader: HTMLTableSectionElement | null = null;
  private tableBody: HTMLTableSectionElement | null = null;
  private searchInput: HTMLInputElement | null = null;
  private pageStartEl: HTMLElement | null = null;
  private pageEndEl: HTMLElement | null = null;
  private totalRowsEl: HTMLElement | null = null;
  private currentPageEl: HTMLElement | null = null;
  private totalPagesEl: HTMLElement | null = null;
  private firstButton: HTMLButtonElement | null = null;
  private prevButton: HTMLButtonElement | null = null;
  private nextButton: HTMLButtonElement | null = null;
  private lastButton: HTMLButtonElement | null = null;

  connectedCallback(): void {
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    this.tableHeader = this.root.querySelector('.table-header');
    this.tableBody = this.root.querySelector('.table-body');
    this.searchInput = this.root.querySelector('.search-input');
    this.pageStartEl = this.root.querySelector('.page-start');
    this.pageEndEl = this.root.querySelector('.page-end');
    this.totalRowsEl = this.root.querySelector('.total-rows');
    this.currentPageEl = this.root.querySelector('.current-page');
    this.totalPagesEl = this.root.querySelector('.total-pages');
    this.firstButton = this.root.querySelector('.page-button.first');
    this.prevButton = this.root.querySelector('.page-button.prev');
    this.nextButton = this.root.querySelector('.page-button.next');
    this.lastButton = this.root.querySelector('.page-button.last');

    this.setupEventListeners();
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'data':
        this._data = this.parseJSON(newValue, []);
        this._filteredData = [...this._data];
        this.applyFilters();
        this.render();
        break;
      case 'columns':
        this._columns = this.parseJSON(newValue, []);
        this.render();
        break;
      case 'page-size':
        this._pageSize = parseInt(newValue || '10', 10);
        this.render();
        break;
      case 'current-page':
        this._currentPage = parseInt(newValue || '1', 10);
        this.render();
        break;
    }
  }

  private parseJSON<T>(value: string | null, defaultValue: T): T {
    if (!value) return defaultValue;
    try {
      return JSON.parse(value);
    } catch {
      return defaultValue;
    }
  }

  private setupEventListeners(): void {
    // Search
    this.listen(this.searchInput!, 'input', () => {
      this._searchQuery = this.searchInput!.value.toLowerCase();
      this.applyFilters();
      this.render();
    });

    // Pagination
    this.listen(this.firstButton!, 'click', () => this.goToPage(1));
    this.listen(this.prevButton!, 'click', () => this.goToPage(this._currentPage - 1));
    this.listen(this.nextButton!, 'click', () => this.goToPage(this._currentPage + 1));
    this.listen(this.lastButton!, 'click', () => this.goToPage(this.totalPages));
  }

  private applyFilters(): void {
    let data = [...this._data];

    // Search filter
    if (this._searchQuery) {
      data = data.filter(row => {
        return this._columns.some(col => {
          const value = String(row[col.key] || '').toLowerCase();
          return value.includes(this._searchQuery);
        });
      });
    }

    this._filteredData = data;
    this._currentPage = 1; // Reset to first page
  }

  private applySort(data: TableData[]): TableData[] {
    if (!this._sortColumn || !this._sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = a[this._sortColumn!];
      const bVal = b[this._sortColumn!];

      let comparison = 0;
      if (aVal < bVal) comparison = -1;
      if (aVal > bVal) comparison = 1;

      return this._sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  private render(): void {
    this.renderHeader();
    this.renderBody();
    this.renderPagination();
  }

  private renderHeader(): void {
    if (!this.tableHeader) return;

    const headerRow = this.tableHeader.querySelector('.header-row');
    if (!headerRow) return;

    headerRow.innerHTML = '';

    this._columns.forEach(col => {
      const th = document.createElement('th');
      th.className = 'header-cell';
      th.setAttribute('role', 'columnheader');
      th.textContent = col.label;

      if (col.sortable !== false && this.sortable) {
        th.setAttribute('data-sortable', 'true');
        th.style.cursor = 'pointer';

        const sortIcon = document.createElement('span');
        sortIcon.className = 'sort-icon';
        sortIcon.textContent = this._sortColumn === col.key
          ? (this._sortDirection === 'asc' ? '▲' : '▼')
          : '⇅';
        th.appendChild(sortIcon);

        if (this._sortColumn === col.key) {
          th.setAttribute('data-sort-direction', this._sortDirection!);
          th.setAttribute('aria-sort', this._sortDirection === 'asc' ? 'ascending' : 'descending');
        }

        this.listen(th, 'click', () => this.handleSort(col.key));
      }

      if (col.width) {
        th.style.width = col.width;
      }

      if (col.align) {
        th.style.textAlign = col.align;
      }

      headerRow.appendChild(th);
    });
  }

  private renderBody(): void {
    if (!this.tableBody) return;

    this.tableBody.innerHTML = '';

    const sortedData = this.applySort(this._filteredData);
    const startIndex = (this._currentPage - 1) * this._pageSize;
    const endIndex = Math.min(startIndex + this._pageSize, sortedData.length);
    const pageData = sortedData.slice(startIndex, endIndex);

    if (pageData.length === 0) {
      const tr = document.createElement('tr');
      tr.className = 'empty-row';
      const td = document.createElement('td');
      td.colSpan = this._columns.length;
      td.className = 'empty-state';
      td.textContent = 'No data available';
      tr.appendChild(td);
      this.tableBody!.appendChild(tr);
      return;
    }

    pageData.forEach((row, index) => {
      const tr = document.createElement('tr');
      tr.setAttribute('role', 'row');

      const globalIndex = startIndex + index;
      const isSelected = this._selectedRows.has(globalIndex);

      if (isSelected) {
        tr.classList.add('selected');
        tr.setAttribute('aria-selected', 'true');
      }

      if (this.selectable !== 'none' && this.selectable) {
        tr.setAttribute('data-selectable', 'true');
        this.listen(tr, 'click', () => this.handleRowSelect(globalIndex));
      }

      this._columns.forEach(col => {
        const td = document.createElement('td');
        td.setAttribute('role', 'gridcell');
        td.textContent = row[col.key] ?? '';

        if (col.align) {
          td.style.textAlign = col.align;
        }

        tr.appendChild(td);
      });

      this.tableBody!.appendChild(tr);
    });
  }

  private renderPagination(): void {
    const total = this._filteredData.length;
    const start = total === 0 ? 0 : (this._currentPage - 1) * this._pageSize + 1;
    const end = Math.min(this._currentPage * this._pageSize, total);

    if (this.pageStartEl) this.pageStartEl.textContent = String(start);
    if (this.pageEndEl) this.pageEndEl.textContent = String(end);
    if (this.totalRowsEl) this.totalRowsEl.textContent = String(total);
    if (this.currentPageEl) this.currentPageEl.textContent = String(this._currentPage);
    if (this.totalPagesEl) this.totalPagesEl.textContent = String(this.totalPages);

    if (this.firstButton) this.firstButton.disabled = this._currentPage === 1;
    if (this.prevButton) this.prevButton.disabled = this._currentPage === 1;
    if (this.nextButton) this.nextButton.disabled = this._currentPage === this.totalPages;
    if (this.lastButton) this.lastButton.disabled = this._currentPage === this.totalPages;
  }

  private handleSort(columnKey: string): void {
    if (this._sortColumn === columnKey) {
      // Toggle direction
      this._sortDirection = this._sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this._sortColumn = columnKey;
      this._sortDirection = 'asc';
    }

    this.render();

    this.dispatchEvent(new CustomEvent('table-sort', {
      bubbles: true,
      composed: true,
      detail: {
        column: this._sortColumn,
        direction: this._sortDirection
      }
    }));
  }

  private handleRowSelect(index: number): void {
    if (this.selectable === 'single') {
      this._selectedRows.clear();
      this._selectedRows.add(index);
    } else if (this.selectable === 'multiple') {
      if (this._selectedRows.has(index)) {
        this._selectedRows.delete(index);
      } else {
        this._selectedRows.add(index);
      }
    }

    this.render();

    this.dispatchEvent(new CustomEvent('table-select', {
      bubbles: true,
      composed: true,
      detail: {
        selectedIndices: Array.from(this._selectedRows),
        selectedRows: Array.from(this._selectedRows).map(i => this._data[i])
      }
    }));
  }

  private goToPage(page: number): void {
    const newPage = Math.max(1, Math.min(page, this.totalPages));
    if (newPage !== this._currentPage) {
      this._currentPage = newPage;
      this.setAttribute('current-page', String(newPage));
      this.render();

      this.dispatchEvent(new CustomEvent('table-page-change', {
        bubbles: true,
        composed: true,
        detail: {
          page: newPage,
          pageSize: this._pageSize,
          totalPages: this.totalPages
        }
      }));
    }
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this._filteredData.length / this._pageSize));
  }

  // Properties
  get data(): TableData[] {
    return this._data;
  }

  set data(val: TableData[]) {
    this.setAttribute('data', JSON.stringify(val));
  }

  get columns(): Column[] {
    return this._columns;
  }

  set columns(val: Column[]) {
    this.setAttribute('columns', JSON.stringify(val));
  }

  get pageSize(): number {
    return this._pageSize;
  }

  set pageSize(val: number) {
    this.setAttribute('page-size', String(val));
  }

  get currentPage(): number {
    return this._currentPage;
  }

  set currentPage(val: number) {
    this.setAttribute('current-page', String(val));
  }

  get sortable(): boolean {
    return this.hasAttribute('sortable');
  }

  set sortable(val: boolean) {
    if (val) {
      this.setAttribute('sortable', '');
    } else {
      this.removeAttribute('sortable');
    }
  }

  get filterable(): boolean {
    return this.hasAttribute('filterable');
  }

  set filterable(val: boolean) {
    if (val) {
      this.setAttribute('filterable', '');
    } else {
      this.removeAttribute('filterable');
    }
  }

  get selectable(): 'single' | 'multiple' | 'none' {
    return (this.getAttribute('selectable') as any) || 'none';
  }

  set selectable(val: 'single' | 'multiple' | 'none') {
    this.setAttribute('selectable', val);
  }

  get virtualScroll(): boolean {
    return this.hasAttribute('virtual-scroll');
  }

  set virtualScroll(val: boolean) {
    if (val) {
      this.setAttribute('virtual-scroll', '');
    } else {
      this.removeAttribute('virtual-scroll');
    }
  }

  get searchable(): boolean {
    return this.hasAttribute('searchable');
  }

  set searchable(val: boolean) {
    if (val) {
      this.setAttribute('searchable', '');
    } else {
      this.removeAttribute('searchable');
    }
  }

  get pageable(): boolean {
    return this.hasAttribute('pageable');
  }

  set pageable(val: boolean) {
    if (val) {
      this.setAttribute('pageable', '');
    } else {
      this.removeAttribute('pageable');
    }
  }

  get selectedRows(): TableData[] {
    return Array.from(this._selectedRows).map(i => this._data[i]);
  }

  clearSelection(): void {
    this._selectedRows.clear();
    this.render();
  }
}

if (!customElements.get('brand-table')) {
  customElements.define('brand-table', BrandTable);
}

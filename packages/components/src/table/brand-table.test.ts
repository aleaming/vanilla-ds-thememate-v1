import { describe, it, expect, beforeEach, vi } from 'vitest';
import './brand-table';
import type { BrandTable } from './brand-table';

describe('BrandTable', () => {
  let table: BrandTable;

  beforeEach(() => {
    table = document.createElement('brand-table') as BrandTable;
    document.body.appendChild(table);
  });

  afterEach(() => {
    document.body.removeChild(table);
  });

  describe('Registration', () => {
    it('should be defined', () => {
      expect(customElements.get('brand-table')).toBeDefined();
    });

    it('should create shadow root', () => {
      expect(table.shadowRoot).not.toBeNull();
    });
  });

  describe('Data Rendering', () => {
    const sampleData = [
      { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
      { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'User' }
    ];

    const sampleColumns = [
      { key: 'id', label: 'ID', width: '80px' },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' }
    ];

    it('should render table with data', async () => {
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const rows = table.shadowRoot?.querySelectorAll('.table-body tr');
      expect(rows?.length).toBe(3);
    });

    it('should render correct number of columns', async () => {
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const headerCells = table.shadowRoot?.querySelectorAll('.header-cell');
      expect(headerCells?.length).toBe(4);
    });

    it('should render column headers', async () => {
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const headers = Array.from(table.shadowRoot?.querySelectorAll('.header-cell') || []);
      const headerTexts = headers.map(h => h.textContent?.trim().replace(/[▲▼⇅]/, '').trim());

      expect(headerTexts).toContain('ID');
      expect(headerTexts).toContain('Name');
      expect(headerTexts).toContain('Email');
      expect(headerTexts).toContain('Role');
    });

    it('should render cell data correctly', async () => {
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const firstRow = table.shadowRoot?.querySelector('.table-body tr');
      const cells = firstRow?.querySelectorAll('td');

      expect(cells?.[0].textContent).toBe('1');
      expect(cells?.[1].textContent).toBe('Alice');
      expect(cells?.[2].textContent).toBe('alice@example.com');
      expect(cells?.[3].textContent).toBe('Admin');
    });

    it('should show empty state when no data', async () => {
      table.data = [];
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const emptyRow = table.shadowRoot?.querySelector('.empty-row');
      expect(emptyRow).not.toBeNull();
      expect(emptyRow?.textContent).toContain('No data available');
    });

    it('should update when data changes', async () => {
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      let rows = table.shadowRoot?.querySelectorAll('.table-body tr');
      expect(rows?.length).toBe(3);

      table.data = [...sampleData, { id: 4, name: 'David', email: 'david@example.com', role: 'User' }];
      await new Promise(resolve => setTimeout(resolve, 0));

      rows = table.shadowRoot?.querySelectorAll('.table-body tr');
      expect(rows?.length).toBe(4);
    });
  });

  describe('Sorting', () => {
    const sampleData = [
      { id: 3, name: 'Charlie', age: 25 },
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: 'Bob', age: 20 }
    ];

    const sampleColumns = [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'age', label: 'Age', sortable: true }
    ];

    it('should sort ascending on first click', async () => {
      table.sortable = true;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const nameHeader = Array.from(table.shadowRoot?.querySelectorAll('.header-cell') || [])
        .find(h => h.textContent?.includes('Name')) as HTMLElement;

      nameHeader?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      const rows = table.shadowRoot?.querySelectorAll('.table-body tr');
      const firstCell = rows?.[0]?.querySelectorAll('td')?.[1];
      expect(firstCell?.textContent).toBe('Alice');
    });

    it('should sort descending on second click', async () => {
      table.sortable = true;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const nameHeader = Array.from(table.shadowRoot?.querySelectorAll('.header-cell') || [])
        .find(h => h.textContent?.includes('Name')) as HTMLElement;

      nameHeader?.click();
      await new Promise(resolve => setTimeout(resolve, 0));
      nameHeader?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      const rows = table.shadowRoot?.querySelectorAll('.table-body tr');
      const firstCell = rows?.[0]?.querySelectorAll('td')?.[1];
      expect(firstCell?.textContent).toBe('Charlie');
    });

    it('should emit table-sort event', async () => {
      table.sortable = true;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const sortSpy = vi.fn();
      table.addEventListener('table-sort', sortSpy);

      const idHeader = Array.from(table.shadowRoot?.querySelectorAll('.header-cell') || [])
        .find(h => h.textContent?.includes('ID')) as HTMLElement;

      idHeader?.click();

      expect(sortSpy).toHaveBeenCalledTimes(1);
      expect(sortSpy.mock.calls[0][0].detail).toEqual({
        column: 'id',
        direction: 'asc'
      });
    });

    it('should show sort indicator', async () => {
      table.sortable = true;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const nameHeader = Array.from(table.shadowRoot?.querySelectorAll('.header-cell') || [])
        .find(h => h.textContent?.includes('Name')) as HTMLElement;

      nameHeader?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      // Re-query after render
      const nameHeaderAfter = Array.from(table.shadowRoot?.querySelectorAll('.header-cell') || [])
        .find(h => h.textContent?.includes('Name')) as HTMLElement;
      const sortIcon = nameHeaderAfter?.querySelector('.sort-icon');
      expect(sortIcon?.textContent).toBe('▲');
    });

    it('should set aria-sort attribute', async () => {
      table.sortable = true;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const nameHeader = Array.from(table.shadowRoot?.querySelectorAll('.header-cell') || [])
        .find(h => h.textContent?.includes('Name')) as HTMLElement;

      nameHeader?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      // Re-query after render
      let nameHeaderAfter = Array.from(table.shadowRoot?.querySelectorAll('.header-cell') || [])
        .find(h => h.textContent?.includes('Name')) as HTMLElement;
      expect(nameHeaderAfter?.getAttribute('aria-sort')).toBe('ascending');

      nameHeaderAfter?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      // Re-query again
      nameHeaderAfter = Array.from(table.shadowRoot?.querySelectorAll('.header-cell') || [])
        .find(h => h.textContent?.includes('Name')) as HTMLElement;
      expect(nameHeaderAfter?.getAttribute('aria-sort')).toBe('descending');
    });

    it('should switch column and reset to ascending', async () => {
      table.sortable = true;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      let nameHeader = Array.from(table.shadowRoot?.querySelectorAll('.header-cell') || [])
        .find(h => h.textContent?.includes('Name')) as HTMLElement;
      let ageHeader = Array.from(table.shadowRoot?.querySelectorAll('.header-cell') || [])
        .find(h => h.textContent?.includes('Age')) as HTMLElement;

      nameHeader?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      // Re-query
      nameHeader = Array.from(table.shadowRoot?.querySelectorAll('.header-cell') || [])
        .find(h => h.textContent?.includes('Name')) as HTMLElement;
      nameHeader?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      // Re-query
      ageHeader = Array.from(table.shadowRoot?.querySelectorAll('.header-cell') || [])
        .find(h => h.textContent?.includes('Age')) as HTMLElement;
      ageHeader?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      // Re-query after final click
      ageHeader = Array.from(table.shadowRoot?.querySelectorAll('.header-cell') || [])
        .find(h => h.textContent?.includes('Age')) as HTMLElement;
      expect(ageHeader?.getAttribute('aria-sort')).toBe('ascending');
    });

    it('should sort numbers correctly', async () => {
      table.sortable = true;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const ageHeader = Array.from(table.shadowRoot?.querySelectorAll('.header-cell') || [])
        .find(h => h.textContent?.includes('Age')) as HTMLElement;

      ageHeader?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      const rows = table.shadowRoot?.querySelectorAll('.table-body tr');
      const ages = Array.from(rows || []).map(row => row.querySelectorAll('td')?.[2]?.textContent);

      expect(ages).toEqual(['20', '25', '30']);
    });
  });

  describe('Search/Filter', () => {
    const sampleData = [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com' }
    ];

    const sampleColumns = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' }
    ];

    it('should filter data on search input', async () => {
      table.searchable = true;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const searchInput = table.shadowRoot?.querySelector('.search-input') as HTMLInputElement;
      searchInput.value = 'alice';
      searchInput.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 0));

      const rows = table.shadowRoot?.querySelectorAll('.table-body tr:not(.empty-row)');
      expect(rows?.length).toBe(1);
    });

    it('should search across all columns', async () => {
      table.searchable = true;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const searchInput = table.shadowRoot?.querySelector('.search-input') as HTMLInputElement;

      searchInput.value = 'bob';
      searchInput.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 0));

      let rows = table.shadowRoot?.querySelectorAll('.table-body tr:not(.empty-row)');
      expect(rows?.length).toBe(1);

      searchInput.value = 'example.com';
      searchInput.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 0));

      rows = table.shadowRoot?.querySelectorAll('.table-body tr:not(.empty-row)');
      expect(rows?.length).toBe(3);
    });

    it('should be case insensitive', async () => {
      table.searchable = true;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const searchInput = table.shadowRoot?.querySelector('.search-input') as HTMLInputElement;
      searchInput.value = 'ALICE';
      searchInput.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 0));

      const rows = table.shadowRoot?.querySelectorAll('.table-body tr:not(.empty-row)');
      expect(rows?.length).toBe(1);
    });

    it('should show empty state when no matches', async () => {
      table.searchable = true;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const searchInput = table.shadowRoot?.querySelector('.search-input') as HTMLInputElement;
      searchInput.value = 'nonexistent';
      searchInput.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 0));

      const emptyRow = table.shadowRoot?.querySelector('.empty-row');
      expect(emptyRow).not.toBeNull();
    });

    it('should reset to page 1 on search', async () => {
      table.searchable = true;
      table.pageable = true;
      table.pageSize = 1;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const nextButton = table.shadowRoot?.querySelector('.page-button.next') as HTMLButtonElement;
      nextButton?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      const searchInput = table.shadowRoot?.querySelector('.search-input') as HTMLInputElement;
      searchInput.value = 'alice';
      searchInput.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 0));

      const pageInfo = table.shadowRoot?.querySelector('.page-info');
      expect(pageInfo?.textContent).toContain('Page 1');
    });
  });

  describe('Pagination', () => {
    const sampleData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`
    }));

    const sampleColumns = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' }
    ];

    it('should paginate data', async () => {
      table.pageable = true;
      table.pageSize = 10;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const rows = table.shadowRoot?.querySelectorAll('.table-body tr');
      expect(rows?.length).toBe(10);
    });

    it('should show correct page info', async () => {
      table.pageable = true;
      table.pageSize = 10;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const pageInfo = table.shadowRoot?.querySelector('.page-info');
      expect(pageInfo?.textContent).toContain('Page 1 of 3');
    });

    it('should show footer info', async () => {
      table.pageable = true;
      table.pageSize = 10;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const footerInfo = table.shadowRoot?.querySelector('.footer-info');
      expect(footerInfo?.textContent).toContain('Showing 1 to 10 of 25');
    });

    it('should go to next page', async () => {
      table.pageable = true;
      table.pageSize = 10;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const nextButton = table.shadowRoot?.querySelector('.page-button.next') as HTMLButtonElement;
      nextButton?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      const pageInfo = table.shadowRoot?.querySelector('.page-info');
      expect(pageInfo?.textContent).toContain('Page 2 of 3');

      const footerInfo = table.shadowRoot?.querySelector('.footer-info');
      expect(footerInfo?.textContent).toContain('Showing 11 to 20 of 25');
    });

    it('should go to previous page', async () => {
      table.pageable = true;
      table.pageSize = 10;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const nextButton = table.shadowRoot?.querySelector('.page-button.next') as HTMLButtonElement;
      nextButton?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      const prevButton = table.shadowRoot?.querySelector('.page-button.prev') as HTMLButtonElement;
      prevButton?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      const pageInfo = table.shadowRoot?.querySelector('.page-info');
      expect(pageInfo?.textContent).toContain('Page 1 of 3');
    });

    it('should go to first page', async () => {
      table.pageable = true;
      table.pageSize = 10;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const nextButton = table.shadowRoot?.querySelector('.page-button.next') as HTMLButtonElement;
      nextButton?.click();
      await new Promise(resolve => setTimeout(resolve, 0));
      nextButton?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      const firstButton = table.shadowRoot?.querySelector('.page-button.first') as HTMLButtonElement;
      firstButton?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      const pageInfo = table.shadowRoot?.querySelector('.page-info');
      expect(pageInfo?.textContent).toContain('Page 1 of 3');
    });

    it('should go to last page', async () => {
      table.pageable = true;
      table.pageSize = 10;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const lastButton = table.shadowRoot?.querySelector('.page-button.last') as HTMLButtonElement;
      lastButton?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      const pageInfo = table.shadowRoot?.querySelector('.page-info');
      expect(pageInfo?.textContent).toContain('Page 3 of 3');

      const footerInfo = table.shadowRoot?.querySelector('.footer-info');
      expect(footerInfo?.textContent).toContain('Showing 21 to 25 of 25');
    });

    it('should disable first/prev on first page', async () => {
      table.pageable = true;
      table.pageSize = 10;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const firstButton = table.shadowRoot?.querySelector('.page-button.first') as HTMLButtonElement;
      const prevButton = table.shadowRoot?.querySelector('.page-button.prev') as HTMLButtonElement;

      expect(firstButton?.disabled).toBe(true);
      expect(prevButton?.disabled).toBe(true);
    });

    it('should disable next/last on last page', async () => {
      table.pageable = true;
      table.pageSize = 10;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const lastButton = table.shadowRoot?.querySelector('.page-button.last') as HTMLButtonElement;
      lastButton?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      const nextButton = table.shadowRoot?.querySelector('.page-button.next') as HTMLButtonElement;

      expect(nextButton?.disabled).toBe(true);
      expect(lastButton?.disabled).toBe(true);
    });

    it('should emit table-page-change event', async () => {
      table.pageable = true;
      table.pageSize = 10;
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const pageSpy = vi.fn();
      table.addEventListener('table-page-change', pageSpy);

      const nextButton = table.shadowRoot?.querySelector('.page-button.next') as HTMLButtonElement;
      nextButton?.click();

      expect(pageSpy).toHaveBeenCalledTimes(1);
      expect(pageSpy.mock.calls[0][0].detail).toEqual({
        page: 2,
        pageSize: 10,
        totalPages: 3
      });
    });
  });

  describe('Row Selection', () => {
    const sampleData = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' }
    ];

    const sampleColumns = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' }
    ];

    it('should select single row', async () => {
      table.selectable = 'single';
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const firstRow = table.shadowRoot?.querySelector('.table-body tr') as HTMLElement;
      firstRow?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      // Re-query after render
      const firstRowAfter = table.shadowRoot?.querySelector('.table-body tr') as HTMLElement;
      expect(firstRowAfter?.classList.contains('selected')).toBe(true);
      expect(firstRowAfter?.getAttribute('aria-selected')).toBe('true');
    });

    it('should deselect previous row in single mode', async () => {
      table.selectable = 'single';
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      let rows = table.shadowRoot?.querySelectorAll('.table-body tr');
      const firstRow = rows?.[0] as HTMLElement;
      const secondRow = rows?.[1] as HTMLElement;

      firstRow?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      // Re-query
      rows = table.shadowRoot?.querySelectorAll('.table-body tr');
      const secondRowNew = rows?.[1] as HTMLElement;
      secondRowNew?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      // Re-query final state
      rows = table.shadowRoot?.querySelectorAll('.table-body tr');
      const firstRowAfter = rows?.[0] as HTMLElement;
      const secondRowAfter = rows?.[1] as HTMLElement;
      expect(firstRowAfter?.classList.contains('selected')).toBe(false);
      expect(secondRowAfter?.classList.contains('selected')).toBe(true);
    });

    it('should select multiple rows', async () => {
      table.selectable = 'multiple';
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      let rows = table.shadowRoot?.querySelectorAll('.table-body tr');
      const firstRow = rows?.[0] as HTMLElement;
      const secondRow = rows?.[1] as HTMLElement;

      firstRow?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      // Re-query
      rows = table.shadowRoot?.querySelectorAll('.table-body tr');
      const secondRowNew = rows?.[1] as HTMLElement;
      secondRowNew?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      // Re-query final state
      rows = table.shadowRoot?.querySelectorAll('.table-body tr');
      const firstRowAfter = rows?.[0] as HTMLElement;
      const secondRowAfter = rows?.[1] as HTMLElement;
      expect(firstRowAfter?.classList.contains('selected')).toBe(true);
      expect(secondRowAfter?.classList.contains('selected')).toBe(true);
    });

    it('should toggle row in multiple mode', async () => {
      table.selectable = 'multiple';
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      let firstRow = table.shadowRoot?.querySelector('.table-body tr') as HTMLElement;

      firstRow?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      // Re-query
      firstRow = table.shadowRoot?.querySelector('.table-body tr') as HTMLElement;
      expect(firstRow?.classList.contains('selected')).toBe(true);

      firstRow?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      // Re-query
      firstRow = table.shadowRoot?.querySelector('.table-body tr') as HTMLElement;
      expect(firstRow?.classList.contains('selected')).toBe(false);
    });

    it('should emit table-select event', async () => {
      table.selectable = 'single';
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const selectSpy = vi.fn();
      table.addEventListener('table-select', selectSpy);

      const firstRow = table.shadowRoot?.querySelector('.table-body tr') as HTMLElement;
      firstRow?.click();

      expect(selectSpy).toHaveBeenCalledTimes(1);
      expect(selectSpy.mock.calls[0][0].detail.selectedIndices).toEqual([0]);
      expect(selectSpy.mock.calls[0][0].detail.selectedRows).toEqual([sampleData[0]]);
    });

    it('should return multiple selected rows in event', async () => {
      table.selectable = 'multiple';
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const selectSpy = vi.fn();
      table.addEventListener('table-select', selectSpy);

      const rows = table.shadowRoot?.querySelectorAll('.table-body tr');
      (rows?.[0] as HTMLElement)?.click();
      (rows?.[1] as HTMLElement)?.click();

      expect(selectSpy).toHaveBeenCalledTimes(2);
      expect(selectSpy.mock.calls[1][0].detail.selectedIndices).toEqual([0, 1]);
      expect(selectSpy.mock.calls[1][0].detail.selectedRows).toEqual([sampleData[0], sampleData[1]]);
    });
  });

  describe('ARIA Attributes', () => {
    const sampleData = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ];

    const sampleColumns = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' }
    ];

    it('should have role="grid"', async () => {
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const tableEl = table.shadowRoot?.querySelector('.table');
      expect(tableEl?.getAttribute('role')).toBe('grid');
    });

    it('should have role="row" on rows', async () => {
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const headerRow = table.shadowRoot?.querySelector('.header-row');
      expect(headerRow?.getAttribute('role')).toBe('row');

      const bodyRow = table.shadowRoot?.querySelector('.table-body tr');
      expect(bodyRow?.getAttribute('role')).toBe('row');
    });

    it('should have role="columnheader" on headers', async () => {
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const headers = table.shadowRoot?.querySelectorAll('.header-cell');
      headers?.forEach(header => {
        expect(header.getAttribute('role')).toBe('columnheader');
      });
    });

    it('should have role="gridcell" on cells', async () => {
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const cells = table.shadowRoot?.querySelectorAll('.table-body td');
      cells?.forEach(cell => {
        expect(cell.getAttribute('role')).toBe('gridcell');
      });
    });

    it('should have role="rowgroup" on tbody', async () => {
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const tbody = table.shadowRoot?.querySelector('.table-body');
      expect(tbody?.getAttribute('role')).toBe('rowgroup');
    });

    it('should set aria-selected on selected rows', async () => {
      table.selectable = 'single';
      table.data = sampleData;
      table.columns = sampleColumns;
      await new Promise(resolve => setTimeout(resolve, 0));

      const firstRow = table.shadowRoot?.querySelector('.table-body tr') as HTMLElement;
      firstRow?.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      // Re-query after render
      const firstRowAfter = table.shadowRoot?.querySelector('.table-body tr') as HTMLElement;
      expect(firstRowAfter?.getAttribute('aria-selected')).toBe('true');
    });
  });

  describe('CSS Parts', () => {
    it('should expose container part', () => {
      const container = table.shadowRoot?.querySelector('[part="container"]');
      expect(container).not.toBeNull();
    });

    it('should expose toolbar part', () => {
      const toolbar = table.shadowRoot?.querySelector('[part="toolbar"]');
      expect(toolbar).not.toBeNull();
    });

    it('should expose search part', () => {
      const search = table.shadowRoot?.querySelector('[part="search"]');
      expect(search).not.toBeNull();
    });

    it('should expose table part', () => {
      const tableEl = table.shadowRoot?.querySelector('[part="table"]');
      expect(tableEl).not.toBeNull();
    });

    it('should expose header part', () => {
      const header = table.shadowRoot?.querySelector('[part="header"]');
      expect(header).not.toBeNull();
    });

    it('should expose body part', () => {
      const body = table.shadowRoot?.querySelector('[part="body"]');
      expect(body).not.toBeNull();
    });

    it('should expose footer part', () => {
      const footer = table.shadowRoot?.querySelector('[part="footer"]');
      expect(footer).not.toBeNull();
    });
  });

  describe('Attributes', () => {
    it('should reflect sortable attribute', () => {
      table.sortable = true;
      expect(table.hasAttribute('sortable')).toBe(true);

      table.sortable = false;
      expect(table.hasAttribute('sortable')).toBe(false);
    });

    it('should reflect searchable attribute', () => {
      table.searchable = true;
      expect(table.hasAttribute('searchable')).toBe(true);

      table.searchable = false;
      expect(table.hasAttribute('searchable')).toBe(false);
    });

    it('should reflect pageable attribute', () => {
      table.pageable = true;
      expect(table.hasAttribute('pageable')).toBe(true);

      table.pageable = false;
      expect(table.hasAttribute('pageable')).toBe(false);
    });

    it('should reflect selectable attribute', () => {
      table.selectable = 'single';
      expect(table.getAttribute('selectable')).toBe('single');

      table.selectable = 'multiple';
      expect(table.getAttribute('selectable')).toBe('multiple');
    });

    it('should reflect page-size attribute', () => {
      table.pageSize = 20;
      expect(table.getAttribute('page-size')).toBe('20');
    });
  });
});

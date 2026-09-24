import { ExternalHistoryItem } from '../product/FoodLensProduct';

export type HistoryGroupId = 'today' | 'yesterday' | 'week' | 'older';

export interface ExternalHistoryGroup {
  id: HistoryGroupId;
  label: string;
  items: ExternalHistoryItem[];
}

const GROUPS: Array<{ id: HistoryGroupId; label: string }> = [
  { id: 'today', label: 'Hoy' },
  { id: 'yesterday', label: 'Ayer' },
  { id: 'week', label: 'Esta semana' },
  { id: 'older', label: 'Anteriores' },
];

const normalizedText = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');

const localDayNumber = (date: Date) =>
  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000;

const parsedTimestamp = (value: string) => {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
};

export function filterExternalHistory(items: ExternalHistoryItem[], query: string) {
  const needle = normalizedText(query.trim());
  if (!needle) return items;

  return items.filter(({ product }) => normalizedText([
    product.name,
    product.brand ?? '',
    product.barcode,
  ].join(' ')).includes(needle));
}

export function groupExternalHistory(
  items: ExternalHistoryItem[],
  now: Date = new Date(),
): ExternalHistoryGroup[] {
  const today = localDayNumber(now);
  const grouped = new Map<HistoryGroupId, ExternalHistoryItem[]>();

  [...items]
    .sort((a, b) => parsedTimestamp(b.scannedAt) - parsedTimestamp(a.scannedAt))
    .forEach(item => {
      const date = new Date(item.scannedAt);
      const daysAgo = Number.isNaN(date.getTime()) ? Number.POSITIVE_INFINITY : today - localDayNumber(date);
      const id: HistoryGroupId = daysAgo <= 0
        ? 'today'
        : daysAgo === 1
          ? 'yesterday'
          : daysAgo <= 6
            ? 'week'
            : 'older';
      grouped.set(id, [...(grouped.get(id) ?? []), item]);
    });

  return GROUPS.flatMap(group => {
    const groupItems = grouped.get(group.id);
    return groupItems?.length ? [{ ...group, items: groupItems }] : [];
  });
}

export function formatScanDate(value: string, now: Date = new Date()) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Fecha no disponible';

  const daysAgo = localDayNumber(now) - localDayNumber(date);
  const time = new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

  if (daysAgo <= 0) return `Hoy, ${time}`;
  if (daysAgo === 1) return `Ayer, ${time}`;

  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

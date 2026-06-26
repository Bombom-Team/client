import styled from '@emotion/styled';
import {
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Layout } from '@/components/Layout';
import {
  domainMeta,
  erdIndexTotal,
  erdIndexesByTable,
  erdEntities,
  erdRelationships,
} from '@/pages/erd/erdModel';
import type {
  DomainId,
  ErdEntity,
  ErdRelationship,
} from '@/pages/erd/erdModel';

type DomainFilter = DomainId | 'all' | 'core';
type ViewMode = 'map' | 'indexes';
type IndexDrilldownFilter = 'all' | 'unique' | 'normal';
type IndexDrilldownDomainFilter = DomainId | 'all';

const NODE_WIDTH = 244;
const NODE_HEIGHT = 176;
const CANVAS_PADDING = 112;
const SECTION_WIDTH = 880;
const SECTION_GAP_X = 72;
const SECTION_GAP_Y = 72;
const SECTION_PADDING = 30;
const SECTION_HEADER_HEIGHT = 58;
const SECTION_CARD_COLUMNS = 3;
const NODE_GAP_X = 48;
const NODE_GAP_Y = 46;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2.4;
const ZOOM_STEP = 0.2;
const TRACKPAD_ZOOM_SENSITIVITY = 0.0032;
const TRACKPAD_ZOOM_MAX_DELTA = 90;

const filters: Array<{ id: DomainFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'core', label: 'Core' },
  { id: 'identity', label: 'Members' },
  { id: 'newsletter', label: 'Newsletters' },
  { id: 'article', label: 'Articles' },
  { id: 'reading', label: 'Reading' },
  { id: 'challenge', label: 'Challenges' },
  { id: 'native', label: 'Maeil Mail' },
  { id: 'blog', label: 'Blog' },
  { id: 'engagement', label: 'Growth' },
  { id: 'ops', label: 'Ops' },
];

const viewTabs: Array<{ id: ViewMode; label: string }> = [
  { id: 'map', label: 'Map' },
  { id: 'indexes', label: 'Indexes' },
];

const indexDrilldownFilters: Array<{
  id: IndexDrilldownFilter;
  label: string;
}> = [
  { id: 'all', label: 'All' },
  { id: 'unique', label: 'Unique' },
  { id: 'normal', label: 'Normal' },
];

const domainLoadLabels: Record<DomainId, string> = {
  identity: 'Members',
  newsletter: 'Newsletters',
  article: 'Articles',
  reading: 'Reading',
  challenge: 'Challenges',
  native: 'Maeil Mail',
  blog: 'Blog',
  engagement: 'Growth',
  ops: 'Ops',
};

const indexDrilldownDomainFilters: Array<{
  id: IndexDrilldownDomainFilter;
  label: string;
}> = [
  { id: 'all', label: 'All' },
  ...Object.entries(domainLoadLabels).map(([id, label]) => ({
    id: id as DomainId,
    label,
  })),
];

interface DomainSectionLayout {
  domain: DomainId;
  x: number;
  y: number;
  width: number;
  height: number;
  count: number;
}

interface PanState {
  pointerId: number;
  originX: number;
  originY: number;
  startScrollLeft: number;
  startScrollTop: number;
  hasMoved: boolean;
}

const mapDomainOrder: DomainId[] = [
  'newsletter',
  'reading',
  'article',
  'identity',
  'challenge',
  'native',
  'blog',
  'engagement',
  'ops',
];

const mapDomainColumnOverrides: Partial<Record<DomainId, number>> = {
  newsletter: 0,
  reading: 1,
  article: 2,
  identity: 1,
};

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value * 100) / 100));
}

function isInteractiveCanvasTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;

  return Boolean(
    target.closest('button, input, textarea, select, a, [role="button"]'),
  );
}

function buildMapLayout(entities: ErdEntity[]) {
  const visibleDomains = mapDomainOrder
    .map((domain) => ({
      domain,
      entities: entities.filter((entity) => entity.domain === domain),
    }))
    .filter(({ entities: domainEntities }) => domainEntities.length > 0);
  const columnCount =
    visibleDomains.length <= 1 ? 1 : visibleDomains.length <= 4 ? 2 : 3;
  const columnBottoms = Array.from(
    { length: columnCount },
    () => CANVAS_PADDING,
  );
  const layoutEntities: ErdEntity[] = [];
  const sections: DomainSectionLayout[] = [];

  visibleDomains.forEach(({ domain, entities: domainEntities }) => {
    const preferredColumnIndex = mapDomainColumnOverrides[domain];
    const columnIndex =
      preferredColumnIndex != null && preferredColumnIndex < columnCount
        ? preferredColumnIndex
        : columnBottoms.indexOf(Math.min(...columnBottoms));
    const sectionX =
      CANVAS_PADDING + columnIndex * (SECTION_WIDTH + SECTION_GAP_X);
    const sectionY = columnBottoms[columnIndex] ?? CANVAS_PADDING;
    const rowCount = Math.ceil(domainEntities.length / SECTION_CARD_COLUMNS);
    const sectionHeight =
      SECTION_HEADER_HEIGHT +
      SECTION_PADDING +
      rowCount * NODE_HEIGHT +
      Math.max(0, rowCount - 1) * NODE_GAP_Y;

    sections.push({
      domain,
      x: sectionX,
      y: sectionY,
      width: SECTION_WIDTH,
      height: sectionHeight,
      count: domainEntities.length,
    });

    domainEntities.forEach((entity, index) => {
      const column = index % SECTION_CARD_COLUMNS;
      const row = Math.floor(index / SECTION_CARD_COLUMNS);

      layoutEntities.push({
        ...entity,
        x: sectionX + SECTION_PADDING + column * (NODE_WIDTH + NODE_GAP_X),
        y: sectionY + SECTION_HEADER_HEIGHT + row * (NODE_HEIGHT + NODE_GAP_Y),
      });
    });

    columnBottoms[columnIndex] = sectionY + sectionHeight + SECTION_GAP_Y;
  });

  const usedWidth =
    columnCount * SECTION_WIDTH + Math.max(0, columnCount - 1) * SECTION_GAP_X;
  const lastSectionBottom = sections.reduce(
    (bottom, section) => Math.max(bottom, section.y + section.height),
    CANVAS_PADDING,
  );

  return {
    entities: layoutEntities,
    sections,
    canvasSize: {
      width: Math.max(1100, CANVAS_PADDING * 2 + usedWidth),
      height: Math.max(760, lastSectionBottom + CANVAS_PADDING),
    },
  };
}

const ErdPage = () => {
  const [activeView, setActiveView] = useState<ViewMode>('map');
  const [activeIndexDrilldownFilter, setActiveIndexDrilldownFilter] =
    useState<IndexDrilldownFilter>('all');
  const [activeIndexDrilldownDomain, setActiveIndexDrilldownDomain] =
    useState<IndexDrilldownDomainFilter>('all');
  const [activeFilter, setActiveFilter] = useState<DomainFilter>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('member');
  const [zoom, setZoom] = useState(1);
  const viewportRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(zoom);
  const gestureStartZoomRef = useRef(zoom);
  const wheelZoomDeltaRef = useRef(0);
  const wheelZoomFrameRef = useRef<number | null>(null);
  const wheelZoomOriginRef = useRef<{ x: number; y: number } | undefined>(
    undefined,
  );
  const panStateRef = useRef<PanState | null>(null);
  const suppressClickRef = useRef(false);
  const [isPanning, setIsPanning] = useState(false);

  const visibleEntities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const scopedEntities = erdEntities.filter((entity) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'core') return entity.featured;
      return entity.domain === activeFilter;
    });

    if (!normalizedQuery) return scopedEntities;

    const matches = new Set(
      erdEntities
        .filter((entity) => {
          const searchableText = [
            entity.table,
            entity.entity,
            entity.summary,
            entity.source,
            ...entity.fields.map((field) => field.name),
          ]
            .join(' ')
            .toLowerCase();

          return searchableText.includes(normalizedQuery);
        })
        .map((entity) => entity.id),
    );

    erdRelationships.forEach((relationship) => {
      if (matches.has(relationship.from)) matches.add(relationship.to);
      if (matches.has(relationship.to)) matches.add(relationship.from);
    });

    return scopedEntities.filter((entity) => matches.has(entity.id));
  }, [activeFilter, query]);

  const visibleEntityIds = useMemo(
    () => new Set(visibleEntities.map((entity) => entity.id)),
    [visibleEntities],
  );

  const visibleRelationships = useMemo(
    () =>
      erdRelationships.filter(
        (relationship) =>
          visibleEntityIds.has(relationship.from) &&
          visibleEntityIds.has(relationship.to),
      ),
    [visibleEntityIds],
  );
  const mapLayout = useMemo(
    () => buildMapLayout(visibleEntities),
    [visibleEntities],
  );
  const layoutEntitiesById = useMemo(
    () => new Map(mapLayout.entities.map((entity) => [entity.id, entity])),
    [mapLayout.entities],
  );
  const layoutSectionsByDomain = useMemo(
    () =>
      new Map(mapLayout.sections.map((section) => [section.domain, section])),
    [mapLayout.sections],
  );

  const selectedEntity =
    layoutEntitiesById.get(selectedId) ??
    mapLayout.entities[0] ??
    erdEntities[0]!;

  useEffect(() => {
    const firstVisibleEntity = visibleEntities[0];

    if (!visibleEntityIds.has(selectedId) && firstVisibleEntity) {
      setSelectedId(firstVisibleEntity.id);
    }
  }, [selectedId, visibleEntities, visibleEntityIds]);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    if (activeView !== 'map') return undefined;

    const viewport = viewportRef.current;
    const focusSection = layoutSectionsByDomain.get('identity');
    const focusEntity =
      layoutEntitiesById.get('member') ?? mapLayout.entities[0];

    if (!viewport || (!focusSection && !focusEntity)) return undefined;

    const frameId = window.requestAnimationFrame(() => {
      const currentZoom = zoomRef.current;
      const focusCenter =
        focusSection != null
          ? {
              x: focusSection.x + focusSection.width / 2,
              y: focusSection.y + focusSection.height / 2,
            }
          : {
              x: focusEntity!.x + NODE_WIDTH / 2,
              y: focusEntity!.y + NODE_HEIGHT / 2,
            };
      const focusCenterX = focusCenter.x * currentZoom;
      const focusCenterY = focusCenter.y * currentZoom;

      viewport.scrollLeft = Math.max(
        0,
        focusCenterX - viewport.clientWidth / 2,
      );
      viewport.scrollTop = Math.max(
        0,
        focusCenterY - viewport.clientHeight / 2,
      );
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [
    activeView,
    layoutEntitiesById,
    layoutSectionsByDomain,
    mapLayout.entities,
  ]);

  const setZoomFromPoint = useCallback(
    (nextZoomValue: number, origin?: { x: number; y: number }) => {
      const nextZoom = clampZoom(nextZoomValue);
      const currentZoom = zoomRef.current;
      const viewport = viewportRef.current;

      if (nextZoom === currentZoom) return;

      if (!viewport) {
        zoomRef.current = nextZoom;
        setZoom(nextZoom);
        return;
      }

      const viewportRect = viewport.getBoundingClientRect();
      const originX = origin?.x ?? viewportRect.left + viewportRect.width / 2;
      const originY = origin?.y ?? viewportRect.top + viewportRect.height / 2;
      const offsetX = originX - viewportRect.left;
      const offsetY = originY - viewportRect.top;
      const contentX = (viewport.scrollLeft + offsetX) / currentZoom;
      const contentY = (viewport.scrollTop + offsetY) / currentZoom;

      zoomRef.current = nextZoom;
      setZoom(nextZoom);

      window.requestAnimationFrame(() => {
        viewport.scrollLeft = contentX * nextZoom - offsetX;
        viewport.scrollTop = contentY * nextZoom - offsetY;
      });
    },
    [],
  );

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) return undefined;

    const shouldHandleGesture = (event: Event) => {
      if (viewport.matches(':hover')) return true;

      return event.target instanceof Node && viewport.contains(event.target);
    };

    const handleWheel = (event: WheelEvent) => {
      const isZoomGesture =
        event.ctrlKey || event.metaKey || Math.abs(event.deltaZ) > 0;

      if (!isZoomGesture) return;

      event.preventDefault();

      const normalizedDelta =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? event.deltaY * 16
          : event.deltaY;
      const smoothedDelta = Math.max(
        -TRACKPAD_ZOOM_MAX_DELTA,
        Math.min(TRACKPAD_ZOOM_MAX_DELTA, normalizedDelta),
      );

      wheelZoomDeltaRef.current = Math.max(
        -TRACKPAD_ZOOM_MAX_DELTA,
        Math.min(
          TRACKPAD_ZOOM_MAX_DELTA,
          wheelZoomDeltaRef.current + smoothedDelta,
        ),
      );
      wheelZoomOriginRef.current = {
        x: event.clientX,
        y: event.clientY,
      };

      if (wheelZoomFrameRef.current != null) return;

      wheelZoomFrameRef.current = window.requestAnimationFrame(() => {
        const frameDelta = wheelZoomDeltaRef.current;
        const origin = wheelZoomOriginRef.current;

        wheelZoomDeltaRef.current = 0;
        wheelZoomFrameRef.current = null;

        const nextZoom =
          zoomRef.current * Math.exp(-frameDelta * TRACKPAD_ZOOM_SENSITIVITY);

        setZoomFromPoint(nextZoom, origin);
      });
    };

    const handleGestureStart = (event: Event) => {
      if (!shouldHandleGesture(event)) return;

      event.preventDefault();
      gestureStartZoomRef.current = zoomRef.current;
    };

    const handleGestureEnd = (event: Event) => {
      if (!shouldHandleGesture(event)) return;

      event.preventDefault();
    };

    const handleGestureChange = (event: Event) => {
      if (!shouldHandleGesture(event)) return;

      const gestureEvent = event as Event & {
        clientX?: number;
        clientY?: number;
        scale?: number;
      };

      if (typeof gestureEvent.scale !== 'number') return;

      event.preventDefault();

      const origin =
        typeof gestureEvent.clientX === 'number' &&
        typeof gestureEvent.clientY === 'number'
          ? {
              x: gestureEvent.clientX,
              y: gestureEvent.clientY,
            }
          : undefined;

      setZoomFromPoint(
        gestureStartZoomRef.current * gestureEvent.scale,
        origin,
      );
    };

    viewport.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('gesturestart', handleGestureStart, {
      passive: false,
    });
    window.addEventListener('gesturechange', handleGestureChange, {
      passive: false,
    });
    window.addEventListener('gestureend', handleGestureEnd, {
      passive: false,
    });

    return () => {
      if (wheelZoomFrameRef.current != null) {
        window.cancelAnimationFrame(wheelZoomFrameRef.current);
      }

      viewport.removeEventListener('wheel', handleWheel);
      window.removeEventListener('gesturestart', handleGestureStart);
      window.removeEventListener('gesturechange', handleGestureChange);
      window.removeEventListener('gestureend', handleGestureEnd);
    };
  }, [setZoomFromPoint]);

  const handleViewportPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const viewport = viewportRef.current;

      if (
        event.button !== 0 ||
        !viewport ||
        isInteractiveCanvasTarget(event.target)
      ) {
        return;
      }

      panStateRef.current = {
        pointerId: event.pointerId,
        originX: event.clientX,
        originY: event.clientY,
        startScrollLeft: viewport.scrollLeft,
        startScrollTop: viewport.scrollTop,
        hasMoved: false,
      };
      suppressClickRef.current = false;
      event.currentTarget.setPointerCapture(event.pointerId);
      setIsPanning(true);
      event.preventDefault();
    },
    [],
  );

  const handleViewportPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const panState = panStateRef.current;
      const viewport = viewportRef.current;

      if (!panState || !viewport || panState.pointerId !== event.pointerId) {
        return;
      }

      const deltaX = event.clientX - panState.originX;
      const deltaY = event.clientY - panState.originY;

      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        panState.hasMoved = true;
        suppressClickRef.current = true;
      }

      viewport.scrollLeft = panState.startScrollLeft - deltaX;
      viewport.scrollTop = panState.startScrollTop - deltaY;
      event.preventDefault();
    },
    [],
  );

  const finishViewportPanning = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const panState = panStateRef.current;

      if (!panState || panState.pointerId !== event.pointerId) return;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      panStateRef.current = null;
      setIsPanning(false);

      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    },
    [],
  );

  const handleViewportClickCapture = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!suppressClickRef.current) return;

      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
    },
    [],
  );

  const visibleFieldCount = visibleEntities.reduce(
    (sum, entity) => sum + entity.fields.length,
    0,
  );
  const inferredRelationshipCount = visibleRelationships.filter(
    (relationship) => relationship.strength === 'inferred',
  ).length;
  const visibleTableIndexRows = visibleEntities
    .map((entity) => ({
      entity,
      indexes: erdIndexesByTable[entity.table] ?? [],
    }))
    .sort((a, b) => {
      if (b.indexes.length !== a.indexes.length) {
        return b.indexes.length - a.indexes.length;
      }

      return a.entity.table.localeCompare(b.entity.table);
    });
  const visibleIndexRows = visibleTableIndexRows
    .filter(({ indexes }) => indexes.length > 0)
    .sort((a, b) => {
      if (b.indexes.length !== a.indexes.length) {
        return b.indexes.length - a.indexes.length;
      }

      return a.entity.table.localeCompare(b.entity.table);
    });
  const typedDashboardDrilldownRows = visibleTableIndexRows
    .map(({ entity, indexes }) => {
      const filteredIndexes =
        activeIndexDrilldownFilter === 'unique'
          ? indexes.filter((index) => index.type === 'unique')
          : activeIndexDrilldownFilter === 'normal'
            ? indexes.filter((index) => index.type === 'index')
            : indexes;

      return {
        entity,
        indexes: filteredIndexes,
      };
    })
    .filter(
      ({ indexes }) =>
        activeIndexDrilldownFilter === 'all' || indexes.length > 0,
    );
  const drilldownDomainCounts = typedDashboardDrilldownRows.reduce<
    Record<IndexDrilldownDomainFilter, number>
  >(
    (counts, { entity, indexes }) => ({
      ...counts,
      all: counts.all + indexes.length,
      [entity.domain]: counts[entity.domain] + indexes.length,
    }),
    {
      all: 0,
      identity: 0,
      newsletter: 0,
      article: 0,
      reading: 0,
      challenge: 0,
      native: 0,
      blog: 0,
      engagement: 0,
      ops: 0,
    },
  );
  const dashboardDrilldownRows = typedDashboardDrilldownRows.filter(
    ({ entity }) =>
      activeIndexDrilldownDomain === 'all' ||
      entity.domain === activeIndexDrilldownDomain,
  );
  const dashboardDrilldownIndexCount = dashboardDrilldownRows.reduce(
    (total, { indexes }) => total + indexes.length,
    0,
  );
  const visibleIndexCount = visibleIndexRows.reduce(
    (total, { indexes }) => total + indexes.length,
    0,
  );
  const visibleUniqueIndexCount = visibleIndexRows.reduce(
    (total, { indexes }) =>
      total + indexes.filter((index) => index.type === 'unique').length,
    0,
  );
  const visibleNormalIndexCount = visibleIndexRows.reduce(
    (total, { indexes }) =>
      total + indexes.filter((index) => index.type === 'index').length,
    0,
  );
  const visibleFulltextIndexCount = visibleIndexRows.reduce(
    (total, { indexes }) =>
      total + indexes.filter((index) => index.type === 'fulltext').length,
    0,
  );
  const visibleIndexCoverage =
    visibleEntities.length === 0
      ? 0
      : Math.round((visibleIndexRows.length / visibleEntities.length) * 100);
  const visibleIndexDensity =
    visibleEntities.length === 0
      ? '0.0'
      : (visibleIndexCount / visibleEntities.length).toFixed(1);
  const visibleUniqueRatio =
    visibleIndexCount === 0
      ? 0
      : Math.round((visibleUniqueIndexCount / visibleIndexCount) * 100);
  const visibleIndexTypeRows = [
    {
      label: 'Unique',
      value: visibleUniqueIndexCount,
      color: '#2563EB',
    },
    {
      label: 'Normal',
      value: visibleNormalIndexCount,
      color: '#16A34A',
    },
    {
      label: 'Fulltext',
      value: visibleFulltextIndexCount,
      color: '#C026D3',
    },
  ];
  const drilldownFilterCounts: Record<IndexDrilldownFilter, number> = {
    all: visibleIndexCount,
    unique: visibleUniqueIndexCount,
    normal: visibleNormalIndexCount,
  };
  const maxIndexTypeCount = Math.max(
    1,
    ...visibleIndexTypeRows.map((row) => row.value),
  );
  const visibleDomainIndexRows = Array.from(
    visibleEntities.reduce(
      (domainMap, entity) => domainMap.set(entity.domain, true),
      new Map<DomainId, boolean>(),
    ),
  )
    .map(([domain]) => {
      const domainEntities = visibleEntities.filter(
        (entity) => entity.domain === domain,
      );
      const domainIndexRows = visibleIndexRows.filter(
        ({ entity }) => entity.domain === domain,
      );
      const indexCount = domainIndexRows.reduce(
        (total, { indexes }) => total + indexes.length,
        0,
      );

      return {
        domain,
        indexedTables: domainIndexRows.length,
        indexCount,
        label: domainLoadLabels[domain],
        tableCount: domainEntities.length,
        color: domainMeta[domain].color,
      };
    })
    .sort((a, b) => b.indexCount - a.indexCount);
  const maxDomainIndexCount = Math.max(
    1,
    ...visibleDomainIndexRows.map((row) => row.indexCount),
  );
  const zoomPercent = Math.round(zoom * 100);
  const zoomOut = () => {
    setZoomFromPoint(zoomRef.current - ZOOM_STEP);
  };
  const zoomIn = () => {
    setZoomFromPoint(zoomRef.current + ZOOM_STEP);
  };

  return (
    <Layout title="ERD">
      <PageShell>
        <TopBar>
          <BrandGroup>
            <LogoBox>ERD</LogoBox>
            <TitleGroup>
              <Eyebrow>BomBom Data Map</Eyebrow>
              <Title>Service ERD</Title>
            </TitleGroup>
          </BrandGroup>
          <Search
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tables, entities, fields"
            aria-label="Search ERD"
          />
        </TopBar>

        <ViewTabs aria-label="ERD view">
          {viewTabs.map((tab) => (
            <ViewTabButton
              key={tab.id}
              type="button"
              $active={activeView === tab.id}
              onClick={() => setActiveView(tab.id)}
            >
              {tab.label}
            </ViewTabButton>
          ))}
        </ViewTabs>

        <FilterBar>
          {filters.map((filter) => (
            <FilterButton
              key={filter.id}
              type="button"
              $active={activeFilter === filter.id}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </FilterButton>
          ))}
        </FilterBar>

        {activeView === 'map' ? (
          <DashboardGrid>
            <SidePanel>
              <PanelTitle>Overview</PanelTitle>
              <MetricGrid>
                <MetricItem>
                  <MetricValue>{visibleEntities.length}</MetricValue>
                  <MetricLabel>tables</MetricLabel>
                </MetricItem>
                <MetricItem>
                  <MetricValue>{visibleRelationships.length}</MetricValue>
                  <MetricLabel>relations</MetricLabel>
                </MetricItem>
                <MetricItem>
                  <MetricValue>{visibleFieldCount}</MetricValue>
                  <MetricLabel>fields</MetricLabel>
                </MetricItem>
                <MetricItem>
                  <MetricValue>{inferredRelationshipCount}</MetricValue>
                  <MetricLabel>inferred</MetricLabel>
                </MetricItem>
              </MetricGrid>
              <DomainList>
                {Object.entries(domainMeta).map(([domain, meta]) => {
                  const count = visibleEntities.filter(
                    (entity) => entity.domain === domain,
                  ).length;

                  if (count === 0) return null;

                  return (
                    <DomainRow key={domain}>
                      <DomainMark $color={meta.color} />
                      <span>{meta.label}</span>
                      <strong>{count}</strong>
                    </DomainRow>
                  );
                })}
              </DomainList>
            </SidePanel>

            <CanvasPanel>
              <ZoomToolbar aria-label="ERD zoom controls">
                <ZoomButton
                  type="button"
                  onClick={zoomOut}
                  disabled={zoom <= MIN_ZOOM}
                  aria-label="Zoom out"
                  title="Zoom out"
                >
                  -
                </ZoomButton>
                <ZoomValue>{zoomPercent}%</ZoomValue>
                <ZoomButton
                  type="button"
                  onClick={zoomIn}
                  disabled={zoom >= MAX_ZOOM}
                  aria-label="Zoom in"
                  title="Zoom in"
                >
                  +
                </ZoomButton>
                <ZoomResetButton
                  type="button"
                  onClick={() => setZoomFromPoint(1)}
                  disabled={zoom === 1}
                  aria-label="Reset zoom"
                  title="Reset zoom"
                >
                  100
                </ZoomResetButton>
              </ZoomToolbar>
              <CanvasViewport
                ref={viewportRef}
                $isPanning={isPanning}
                onClickCapture={handleViewportClickCapture}
                onPointerCancel={finishViewportPanning}
                onPointerDown={handleViewportPointerDown}
                onPointerMove={handleViewportPointerMove}
                onPointerUp={finishViewportPanning}
              >
                <CanvasScaleFrame
                  $width={mapLayout.canvasSize.width * zoom}
                  $height={mapLayout.canvasSize.height * zoom}
                >
                  <CanvasSurface
                    $zoom={zoom}
                    $width={mapLayout.canvasSize.width}
                    $height={mapLayout.canvasSize.height}
                  >
                    {mapLayout.sections.map((section) => (
                      <DomainSection
                        key={section.domain}
                        $x={section.x}
                        $y={section.y}
                        $width={section.width}
                        $height={section.height}
                        $color={domainMeta[section.domain].color}
                        $background={domainMeta[section.domain].softColor}
                      >
                        <DomainSectionTitle>
                          {domainLoadLabels[section.domain]}
                        </DomainSectionTitle>
                        <DomainSectionCount>
                          {section.count} tables
                        </DomainSectionCount>
                      </DomainSection>
                    ))}
                    <RelationshipLayer
                      relationships={visibleRelationships}
                      entitiesById={layoutEntitiesById}
                      selectedId={selectedEntity.id}
                      canvasSize={mapLayout.canvasSize}
                    />
                    {mapLayout.entities.map((entity) => (
                      <EntityNode
                        key={entity.id}
                        entity={entity}
                        selected={entity.id === selectedEntity.id}
                        connected={visibleRelationships.some(
                          (relationship) =>
                            selectedEntity.id === relationship.from &&
                            entity.id === relationship.to,
                        )}
                        referenced={visibleRelationships.some(
                          (relationship) =>
                            selectedEntity.id === relationship.to &&
                            entity.id === relationship.from,
                        )}
                        onSelect={() => setSelectedId(entity.id)}
                      />
                    ))}
                  </CanvasSurface>
                </CanvasScaleFrame>
              </CanvasViewport>
            </CanvasPanel>

            <DetailPanel>
              <PanelTitle>Selected Table</PanelTitle>
              <DetailHeader $color={domainMeta[selectedEntity.domain].color}>
                <DetailDomain>
                  {domainMeta[selectedEntity.domain].label}
                </DetailDomain>
                <DetailTable>{selectedEntity.table}</DetailTable>
                <DetailEntity>{selectedEntity.entity}</DetailEntity>
              </DetailHeader>
              <DetailSummary>{selectedEntity.summary}</DetailSummary>
              <SourceText>{selectedEntity.source}</SourceText>
              <FieldList>
                {selectedEntity.fields.map((field) => (
                  <DetailField key={field.name}>
                    <FieldName>{field.name}</FieldName>
                    <FieldType>{field.type}</FieldType>
                    <BadgeRow>
                      {field.badges?.map((badge) => (
                        <FieldBadge key={badge}>{badge}</FieldBadge>
                      ))}
                    </BadgeRow>
                    {field.relation && (
                      <RelationText>{field.relation}</RelationText>
                    )}
                  </DetailField>
                ))}
              </FieldList>
              {selectedEntity.uniques && (
                <UniqueBox>
                  <PanelSubTitle>unique constraints</PanelSubTitle>
                  {selectedEntity.uniques.map((unique) => (
                    <UniqueText key={unique}>{unique}</UniqueText>
                  ))}
                </UniqueBox>
              )}
            </DetailPanel>
          </DashboardGrid>
        ) : (
          <IndexesView>
            <IndexSurface>
              <IndexSummaryBar>
                <IndexSummaryItem>
                  <MetricValue>{visibleIndexCount}</MetricValue>
                  <MetricLabel>visible indexes</MetricLabel>
                </IndexSummaryItem>
                <IndexSummaryItem>
                  <MetricValue>{erdIndexTotal}</MetricValue>
                  <MetricLabel>total indexes</MetricLabel>
                </IndexSummaryItem>
                <IndexSummaryItem>
                  <MetricValue>{visibleIndexCoverage}%</MetricValue>
                  <MetricLabel>table coverage</MetricLabel>
                </IndexSummaryItem>
                <IndexSummaryItem>
                  <MetricValue>{visibleIndexDensity}</MetricValue>
                  <MetricLabel>avg indexes/table</MetricLabel>
                </IndexSummaryItem>
              </IndexSummaryBar>

              <IndexInsightGrid>
                <IndexPanel>
                  <IndexPanelTop>
                    <PanelSubTitle>type mix</PanelSubTitle>
                    <IndexPanelMeta>
                      {visibleUniqueRatio}% unique
                    </IndexPanelMeta>
                  </IndexPanelTop>
                  <BarList>
                    {visibleIndexTypeRows.map((row) => (
                      <BarRow key={row.label}>
                        <BarLabel>{row.label}</BarLabel>
                        <BarTrack>
                          <BarFill
                            $color={row.color}
                            $percent={(row.value / maxIndexTypeCount) * 100}
                          />
                        </BarTrack>
                        <BarValue>{row.value}</BarValue>
                      </BarRow>
                    ))}
                  </BarList>
                </IndexPanel>

                <IndexPanel>
                  <IndexPanelTop>
                    <PanelSubTitle>domain load</PanelSubTitle>
                    <DomainLoadMeta>
                      <IndexPanelMeta>
                        {visibleDomainIndexRows.length} domains
                      </IndexPanelMeta>
                      <DomainLoadLegend title="secondary indexes / tables">
                        idx/tables
                      </DomainLoadLegend>
                    </DomainLoadMeta>
                  </IndexPanelTop>
                  <BarList>
                    {visibleDomainIndexRows.map((row) => (
                      <BarRow key={row.domain}>
                        <BarLabel>{row.label}</BarLabel>
                        <BarTrack>
                          <BarFill
                            $color={row.color}
                            $percent={
                              (row.indexCount / maxDomainIndexCount) * 100
                            }
                          />
                        </BarTrack>
                        <BarValue
                          title={`${row.indexCount} secondary indexes / ${row.tableCount} tables`}
                        >
                          {row.indexCount}/{row.tableCount}
                        </BarValue>
                      </BarRow>
                    ))}
                  </BarList>
                </IndexPanel>

                <IndexPanel>
                  <IndexPanelTop>
                    <PanelSubTitle>top indexed tables</PanelSubTitle>
                    <IndexPanelMeta>current scope</IndexPanelMeta>
                  </IndexPanelTop>
                  <CompactTableList>
                    {visibleIndexRows.slice(0, 5).map(({ entity, indexes }) => (
                      <CompactTableRow key={entity.id}>
                        <span>{entity.table}</span>
                        <strong>{indexes.length}</strong>
                      </CompactTableRow>
                    ))}
                  </CompactTableList>
                </IndexPanel>
              </IndexInsightGrid>

              <DashboardDrilldown>
                <DrilldownHeader>
                  <div>
                    <PanelSubTitle>table index drilldown</PanelSubTitle>
                    <DrilldownLead>
                      Open the stats view and still scan table indexes directly.
                    </DrilldownLead>
                  </div>
                  <DrilldownMeta>
                    {dashboardDrilldownRows.length} tables ·{' '}
                    {dashboardDrilldownIndexCount} indexes
                  </DrilldownMeta>
                </DrilldownHeader>
                <DrilldownFilterBar aria-label="Table index drilldown filter">
                  {indexDrilldownFilters.map((filter) => (
                    <DrilldownFilterButton
                      key={filter.id}
                      type="button"
                      $active={activeIndexDrilldownFilter === filter.id}
                      onClick={() => setActiveIndexDrilldownFilter(filter.id)}
                    >
                      <span>{filter.label}</span>
                      <strong>{drilldownFilterCounts[filter.id]}</strong>
                    </DrilldownFilterButton>
                  ))}
                </DrilldownFilterBar>
                <DrilldownDomainFilterBar aria-label="Table index domain filter">
                  {indexDrilldownDomainFilters.map((filter) => (
                    <DrilldownDomainButton
                      key={filter.id}
                      type="button"
                      $active={activeIndexDrilldownDomain === filter.id}
                      onClick={() => setActiveIndexDrilldownDomain(filter.id)}
                    >
                      <span>{filter.label}</span>
                      <strong>{drilldownDomainCounts[filter.id]}</strong>
                    </DrilldownDomainButton>
                  ))}
                </DrilldownDomainFilterBar>
                {dashboardDrilldownRows.length === 0 ? (
                  <IndexEmptyState>
                    No indexes match the current drilldown filter.
                  </IndexEmptyState>
                ) : (
                  <DashboardTableGrid>
                    {dashboardDrilldownRows.map(({ entity, indexes }) => (
                      <DashboardTableCard key={entity.id}>
                        <DashboardTableTop>
                          <IndexTableDomain
                            $color={domainMeta[entity.domain].color}
                            $background={domainMeta[entity.domain].softColor}
                          >
                            {domainMeta[entity.domain].label}
                          </IndexTableDomain>
                          <IndexCountBadge>{indexes.length}</IndexCountBadge>
                        </DashboardTableTop>
                        <DashboardTableName>{entity.table}</DashboardTableName>
                        {indexes.length > 0 ? (
                          <InlineIndexList>
                            {indexes.map((index) => (
                              <InlineIndexChip key={index.name}>
                                <IndexType $type={index.type}>
                                  {index.type}
                                </IndexType>
                                <InlineIndexName>{index.name}</InlineIndexName>
                                <InlineIndexColumns>
                                  {index.columns.join(' + ')}
                                </InlineIndexColumns>
                              </InlineIndexChip>
                            ))}
                          </InlineIndexList>
                        ) : (
                          <NoIndexText>No secondary index</NoIndexText>
                        )}
                      </DashboardTableCard>
                    ))}
                  </DashboardTableGrid>
                )}
              </DashboardDrilldown>
            </IndexSurface>
          </IndexesView>
        )}
      </PageShell>
    </Layout>
  );
};

export default ErdPage;

function EntityNode({
  entity,
  selected,
  connected,
  referenced,
  onSelect,
}: {
  entity: ErdEntity;
  selected: boolean;
  connected: boolean;
  referenced: boolean;
  onSelect: () => void;
}) {
  const meta = domainMeta[entity.domain];
  const fields = entity.fields.slice(0, 4);

  return (
    <NodeButton
      type="button"
      onClick={onSelect}
      $x={entity.x}
      $y={entity.y}
      $selected={selected}
      $connected={connected}
      $referenced={referenced}
      $color={meta.color}
    >
      <NodeTop>
        <NodeDomain $color={meta.color} $background={meta.softColor}>
          {meta.label}
        </NodeDomain>
        <NodeEntity>{entity.entity}</NodeEntity>
      </NodeTop>
      <NodeTable>{entity.table}</NodeTable>
      <NodeSummary>{entity.summary}</NodeSummary>
      <NodeFields>
        {fields.map((field) => (
          <NodeField key={field.name}>
            <NodeFieldText>
              <NodeFieldName>{field.name}</NodeFieldName>
              <NodeFieldType>{field.type}</NodeFieldType>
            </NodeFieldText>
            <NodeFieldBadges>
              {field.badges?.slice(0, 2).map((badge) => (
                <MiniBadge key={badge}>{badge}</MiniBadge>
              ))}
            </NodeFieldBadges>
          </NodeField>
        ))}
      </NodeFields>
    </NodeButton>
  );
}

function RelationshipLayer({
  relationships,
  entitiesById,
  selectedId,
  canvasSize,
}: {
  relationships: ErdRelationship[];
  entitiesById: Map<string, ErdEntity>;
  selectedId: string;
  canvasSize: { width: number; height: number };
}) {
  return (
    <SvgLayer
      width={canvasSize.width}
      height={canvasSize.height}
      viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
    >
      <defs>
        <marker
          id="arrow-default"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M 0 0 L 8 4 L 0 8 z" fill="#9AA7B5" />
        </marker>
        <marker
          id="arrow-active"
          markerWidth="9"
          markerHeight="9"
          refX="8"
          refY="4.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M 0 0 L 9 4.5 L 0 9 z" fill="#111827" />
        </marker>
      </defs>
      {relationships.map((relationship) => {
        const from = entitiesById.get(relationship.from);
        const to = entitiesById.get(relationship.to);

        if (!from || !to) return null;

        const path = buildPath(from, to);
        const active =
          selectedId === relationship.from || selectedId === relationship.to;

        return (
          <g
            key={`${relationship.from}-${relationship.to}-${relationship.field}`}
          >
            <path
              d={path.d}
              fill="none"
              stroke={
                active
                  ? '#111827'
                  : relationship.strength === 'constraint'
                    ? '#94A3B8'
                    : '#CBD5E1'
              }
              strokeWidth={active ? 1.9 : 1}
              strokeDasharray={
                relationship.strength === 'inferred' ? '6 7' : undefined
              }
              markerEnd={active ? 'url(#arrow-active)' : undefined}
              opacity={active ? 0.68 : 0.12}
            >
              <title>{relationship.label}</title>
            </path>
          </g>
        );
      })}
    </SvgLayer>
  );
}

function buildPath(from: ErdEntity, to: ErdEntity) {
  const fromCenter = {
    x: from.x + NODE_WIDTH / 2,
    y: from.y + NODE_HEIGHT / 2,
  };
  const toCenter = {
    x: to.x + NODE_WIDTH / 2,
    y: to.y + NODE_HEIGHT / 2,
  };
  const horizontal =
    Math.abs(fromCenter.x - toCenter.x) > Math.abs(fromCenter.y - toCenter.y);
  const start = horizontal
    ? {
        x: fromCenter.x < toCenter.x ? from.x + NODE_WIDTH : from.x,
        y: fromCenter.y,
      }
    : {
        x: fromCenter.x,
        y: fromCenter.y < toCenter.y ? from.y + NODE_HEIGHT : from.y,
      };
  const end = horizontal
    ? {
        x: fromCenter.x < toCenter.x ? to.x : to.x + NODE_WIDTH,
        y: toCenter.y,
      }
    : {
        x: toCenter.x,
        y: fromCenter.y < toCenter.y ? to.y : to.y + NODE_HEIGHT,
      };
  const curve = horizontal
    ? Math.max(70, Math.abs(end.x - start.x) * 0.38)
    : Math.max(70, Math.abs(end.y - start.y) * 0.38);
  const controlA = horizontal
    ? {
        x: start.x + (start.x < end.x ? curve : -curve),
        y: start.y,
      }
    : {
        x: start.x,
        y: start.y + (start.y < end.y ? curve : -curve),
      };
  const controlB = horizontal
    ? {
        x: end.x - (start.x < end.x ? curve : -curve),
        y: end.y,
      }
    : {
        x: end.x,
        y: end.y - (start.y < end.y ? curve : -curve),
      };

  return {
    d: `M ${start.x} ${start.y} C ${controlA.x} ${controlA.y}, ${controlB.x} ${controlB.y}, ${end.x} ${end.y}`,
  };
}

const PageShell = styled.main`
  min-height: 100vh;
  padding: 28px;

  display: flex;
  gap: 18px;
  flex-direction: column;

  background:
    linear-gradient(rgb(15 23 42 / 3.5%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(15 23 42 / 3.5%) 1px, transparent 1px), #f7f9fc;
  background-size: 28px 28px;
`;

const TopBar = styled.header`
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;

  @media (width <= 1180px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const BrandGroup = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
`;

const LogoBox = styled.div`
  width: 48px;
  height: 48px;
  border: 1px solid #d6dee8;
  border-radius: 12px;
  box-shadow: 0 12px 28px rgb(15 23 42 / 8%);

  display: flex;
  align-items: center;
  justify-content: center;

  background: #fff;
  color: #111827;
  font:
    800 12px/18px Inter,
    system-ui,
    sans-serif;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Eyebrow = styled.span`
  color: #64748b;
  font:
    600 12px/18px Inter,
    system-ui,
    sans-serif;
`;

const Title = styled.h1`
  color: #0f172a;
  font:
    800 30px/38px Inter,
    system-ui,
    sans-serif;
`;

const Search = styled.input`
  width: min(430px, 100%);
  height: 46px;
  padding: 0 16px;
  outline: none;
  border: 1px solid #d6dee8;
  border-radius: 8px;
  box-shadow: 0 12px 26px rgb(15 23 42 / 6%);

  background: rgb(255 255 255 / 92%);
  color: #0f172a;
  font:
    500 14px/22px Inter,
    system-ui,
    sans-serif;

  &:focus {
    box-shadow: 0 0 0 3px rgb(255 153 102 / 22%);
    border-color: #f96;
  }
`;

const ViewTabs = styled.nav`
  width: fit-content;
  padding: 4px;
  border: 1px solid #d6dee8;
  border-radius: 8px;
  box-shadow: 0 12px 26px rgb(15 23 42 / 6%);

  display: flex;
  gap: 4px;

  background: rgb(255 255 255 / 94%);

  @media (width <= 640px) {
    width: 100%;
  }
`;

const ViewTabButton = styled.button<{ $active: boolean }>`
  height: 38px;
  min-width: 118px;
  padding: 0 18px;
  border: 0;
  border-radius: 6px;

  background: ${({ $active }) => ($active ? '#111827' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#475569')};
  font:
    800 13px/20px Inter,
    system-ui,
    sans-serif;

  cursor: pointer;

  @media (width <= 640px) {
    min-width: 0;
    flex: 1;
  }
`;

const FilterBar = styled.nav`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  height: 36px;
  min-width: 72px;
  padding: 0 14px;
  border: 1px solid ${({ $active }) => ($active ? '#ff9966' : '#d6dee8')};
  border-radius: 8px;

  background: ${({ $active }) => ($active ? '#fff3ed' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#9a3412' : '#334155')};
  font:
    700 13px/20px Inter,
    system-ui,
    sans-serif;

  cursor: pointer;
`;

const DashboardGrid = styled.section`
  min-height: 0;

  display: grid;
  gap: 18px;
  align-items: stretch;

  grid-template-columns: 244px minmax(0, 1fr) 318px;

  @media (width <= 1180px) {
    grid-template-columns: 1fr;
  }
`;

const SidePanel = styled.aside`
  min-height: 720px;
  padding: 18px;
  border: 1px solid #dfe7ef;
  border-radius: 8px;
  box-shadow: 0 18px 38px rgb(15 23 42 / 8%);

  background: rgb(255 255 255 / 94%);

  @media (width <= 1180px) {
    min-height: auto;
  }
`;

const DetailPanel = styled.aside`
  min-height: 720px;
  padding: 18px;
  border: 1px solid #dfe7ef;
  border-radius: 8px;
  box-shadow: 0 18px 38px rgb(15 23 42 / 8%);

  background: rgb(255 255 255 / 96%);

  @media (width <= 1180px) {
    min-height: auto;
  }
`;

const PanelTitle = styled.h2`
  margin-bottom: 14px;

  color: #0f172a;
  font:
    800 16px/24px Inter,
    system-ui,
    sans-serif;
`;

const PanelSubTitle = styled.h3`
  color: #475569;
  font:
    800 11px/18px Inter,
    system-ui,
    sans-serif;
`;

const MetricGrid = styled.div`
  display: grid;
  gap: 10px;

  grid-template-columns: 1fr 1fr;
`;

const MetricItem = styled.div`
  min-height: 74px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;

  background: #f8fafc;
`;

const MetricValue = styled.strong`
  display: block;

  color: #0f172a;
  font:
    800 26px/32px Inter,
    system-ui,
    sans-serif;
`;

const MetricLabel = styled.span`
  color: #64748b;
  font:
    700 11px/18px Inter,
    system-ui,
    sans-serif;
`;

const DomainList = styled.div`
  margin-top: 18px;

  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const DomainRow = styled.div`
  display: grid;
  gap: 8px;
  align-items: center;

  color: #334155;
  font:
    700 12px/18px Inter,
    system-ui,
    sans-serif;

  grid-template-columns: 10px 1fr auto;

  strong {
    color: #0f172a;
  }
`;

const DomainMark = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 3px;

  background: ${({ $color }) => $color};
`;

const CanvasPanel = styled.div`
  position: relative;
  min-width: 0;
`;

const ZoomToolbar = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 5;
  height: 38px;
  padding: 4px;
  border: 1px solid rgb(203 213 225 / 92%);
  border-radius: 8px;
  box-shadow: 0 12px 26px rgb(15 23 42 / 12%);

  display: flex;
  gap: 4px;
  align-items: center;

  background: rgb(255 255 255 / 94%);

  backdrop-filter: blur(8px);
`;

const ZoomButton = styled.button`
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 6px;

  background: #111827;
  color: #fff;
  font:
    800 18px/28px Inter,
    system-ui,
    sans-serif;

  cursor: pointer;

  &:disabled {
    background: #e2e8f0;
    color: #94a3b8;

    cursor: not-allowed;
  }
`;

const ZoomValue = styled.span`
  width: 48px;

  color: #0f172a;
  font:
    800 12px/18px Inter,
    system-ui,
    sans-serif;
  text-align: center;
`;

const ZoomResetButton = styled.button`
  width: 40px;
  height: 30px;
  border: 1px solid #d6dee8;
  border-radius: 6px;

  background: #fff;
  color: #334155;
  font:
    800 11px/16px Inter,
    system-ui,
    sans-serif;

  cursor: pointer;

  &:disabled {
    color: #94a3b8;
    cursor: not-allowed;
  }
`;

const CanvasViewport = styled.div<{ $isPanning: boolean }>`
  overflow: auto;
  height: clamp(640px, calc(100vh - 220px), 820px);
  border: 1px solid #d3dde9;
  border-radius: 8px;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 55%);

  background: #edf2f7;

  cursor: ${({ $isPanning }) => ($isPanning ? 'grabbing' : 'grab')};
  overscroll-behavior: contain;
  touch-action: none;
  user-select: ${({ $isPanning }) => ($isPanning ? 'none' : 'auto')};

  @media (width <= 1180px) {
    height: 68vh;
    min-height: 520px;
  }

  @media (width <= 640px) {
    height: 62vh;
    min-height: 420px;
  }
`;

const CanvasScaleFrame = styled.div<{ $width: number; $height: number }>`
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
`;

const CanvasSurface = styled.div<{
  $zoom: number;
  $width: number;
  $height: number;
}>`
  position: relative;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;

  background:
    linear-gradient(rgb(71 85 105 / 8%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(71 85 105 / 8%) 1px, transparent 1px), #f9fbfd;
  background-size: 24px 24px;

  transform: scale(${({ $zoom }) => $zoom});
  transform-origin: top left;
`;

const DomainSection = styled.div<{
  $x: number;
  $y: number;
  $width: number;
  $height: number;
  $color: string;
  $background: string;
}>`
  position: absolute;
  top: ${({ $y }) => $y}px;
  left: ${({ $x }) => $x}px;
  z-index: 0;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  padding: 18px ${SECTION_PADDING}px;
  border: 1px solid ${({ $color }) => `${$color}42`};
  border-top: 4px solid ${({ $color }) => $color};
  border-radius: 8px;
  box-shadow: 0 18px 38px rgb(15 23 42 / 7%);

  background:
    linear-gradient(180deg, ${({ $background }) => $background}CC, #fff 68%),
    #fff;

  pointer-events: none;
`;

const DomainSectionTitle = styled.strong`
  color: #0f172a;
  font:
    800 15px/20px Inter,
    system-ui,
    sans-serif;
`;

const DomainSectionCount = styled.span`
  margin-left: 8px;

  color: #64748b;
  font:
    800 10px/14px Inter,
    system-ui,
    sans-serif;
`;

const SvgLayer = styled.svg`
  position: absolute;
  z-index: 1;

  inset: 0;
  pointer-events: none;
`;

const NodeButton = styled.button<{
  $x: number;
  $y: number;
  $selected: boolean;
  $connected: boolean;
  $referenced: boolean;
  $color: string;
}>`
  position: absolute;
  top: ${({ $y }) => $y}px;
  left: ${({ $x }) => $x}px;
  z-index: 2;
  width: ${NODE_WIDTH}px;
  height: ${NODE_HEIGHT}px;
  padding: 12px;
  border: 1px solid
    ${({ $selected, $connected, $referenced, $color }) =>
      $selected || $connected || $referenced ? $color : '#d9e2ec'};
  border-radius: 8px;
  box-shadow: ${({ $selected }) =>
    $selected
      ? '0 18px 42px rgba(15, 23, 42, 0.18)'
      : '0 10px 24px rgba(15, 23, 42, 0.08)'};

  background: #fff;
  color: #0f172a;
  text-align: left;

  cursor: pointer;
  opacity: 1;
`;

const NodeTop = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
`;

const NodeDomain = styled.span<{ $color: string; $background: string }>`
  overflow: hidden;
  max-width: 88px;
  padding: 3px 7px;
  border-radius: 6px;

  background: ${({ $background }) => $background};
  color: ${({ $color }) => $color};
  font:
    800 10px/14px Inter,
    system-ui,
    sans-serif;
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const NodeEntity = styled.span`
  overflow: hidden;
  min-width: 0;

  color: #64748b;
  font:
    700 11px/16px Inter,
    system-ui,
    sans-serif;
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const NodeTable = styled.strong`
  overflow: hidden;
  margin-top: 10px;

  display: block;

  color: #0f172a;
  font:
    800 17px/24px Inter,
    system-ui,
    sans-serif;
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const NodeSummary = styled.p`
  overflow: hidden;
  height: 18px;

  color: #64748b;
  font:
    600 11px/18px Inter,
    system-ui,
    sans-serif;
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const NodeFields = styled.div`
  margin-top: 8px;

  display: flex;
  gap: 3px;
  flex-direction: column;
`;

const NodeField = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: space-between;
`;

const NodeFieldText = styled.span`
  min-width: 0;

  display: flex;
  gap: 4px;
  align-items: baseline;
`;

const NodeFieldName = styled.span`
  overflow: hidden;
  min-width: 0;

  color: #334155;
  font:
    600 11px/15px Inter,
    system-ui,
    sans-serif;
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const NodeFieldType = styled.span`
  overflow: hidden;
  min-width: 0;

  color: #94a3b8;
  font:
    600 9px/13px Inter,
    system-ui,
    sans-serif;
  white-space: nowrap;

  text-overflow: ellipsis;

  &::before {
    margin-right: 4px;

    color: #cbd5e1;

    content: '·';
  }
`;

const NodeFieldBadges = styled.span`
  display: flex;
  gap: 3px;
  flex-shrink: 0;
`;

const MiniBadge = styled.span`
  min-width: 20px;
  padding: 1px 3px;
  border-radius: 4px;

  background: #eef2f7;
  color: #475569;
  font:
    800 8px/11px Inter,
    system-ui,
    sans-serif;
  text-align: center;
`;

const DetailHeader = styled.div<{ $color: string }>`
  padding-left: 12px;
  border-left: 4px solid ${({ $color }) => $color};
`;

const DetailDomain = styled.span`
  color: #64748b;
  font:
    800 11px/16px Inter,
    system-ui,
    sans-serif;
`;

const DetailTable = styled.h2`
  margin-top: 2px;

  color: #0f172a;
  font:
    800 23px/30px Inter,
    system-ui,
    sans-serif;

  overflow-wrap: anywhere;
`;

const DetailEntity = styled.p`
  color: #475569;
  font:
    700 13px/20px Inter,
    system-ui,
    sans-serif;
`;

const DetailSummary = styled.p`
  margin-top: 14px;

  color: #334155;
  font:
    600 13px/21px Inter,
    system-ui,
    sans-serif;
`;

const SourceText = styled.p`
  margin-top: 8px;

  color: #64748b;
  font:
    500 11px/18px Inter,
    system-ui,
    sans-serif;

  overflow-wrap: anywhere;
`;

const FieldList = styled.div`
  margin-top: 16px;

  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const DetailField = styled.div`
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;

  background: #f8fafc;
`;

const FieldName = styled.strong`
  display: block;

  color: #0f172a;
  font:
    800 13px/20px Inter,
    system-ui,
    sans-serif;

  overflow-wrap: anywhere;
`;

const FieldType = styled.span`
  color: #64748b;
  font:
    600 11px/18px Inter,
    system-ui,
    sans-serif;
`;

const BadgeRow = styled.div`
  margin-top: 6px;

  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const FieldBadge = styled.span`
  min-width: 28px;
  padding: 2px 5px;
  border-radius: 5px;

  background: #e8eef6;
  color: #334155;
  font:
    800 9px/13px Inter,
    system-ui,
    sans-serif;
  text-align: center;
`;

const RelationText = styled.p`
  margin-top: 6px;

  color: #0f766e;
  font:
    700 11px/16px Inter,
    system-ui,
    sans-serif;

  overflow-wrap: anywhere;
`;

const UniqueBox = styled.div`
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
`;

const UniqueText = styled.p`
  margin-top: 6px;

  color: #334155;
  font:
    700 12px/18px Inter,
    system-ui,
    sans-serif;
`;

const IndexType = styled.span<{ $type: 'index' | 'unique' | 'fulltext' }>`
  min-width: 52px;
  padding: 2px 6px;
  border-radius: 5px;

  background: ${({ $type }) =>
    $type === 'unique'
      ? '#E8F0FF'
      : $type === 'fulltext'
        ? '#FBE9FD'
        : '#E9F8EF'};
  color: ${({ $type }) =>
    $type === 'unique'
      ? '#2563EB'
      : $type === 'fulltext'
        ? '#C026D3'
        : '#16A34A'};
  font:
    800 9px/13px Inter,
    system-ui,
    sans-serif;
  text-align: center;
`;

const IndexesView = styled.section`
  min-height: 720px;

  display: flex;
  gap: 14px;
  flex-direction: column;
`;

const IndexSurface = styled.section`
  padding: 16px;
  border: 1px solid #dfe7ef;
  border-radius: 8px;
  box-shadow: 0 18px 38px rgb(15 23 42 / 8%);

  background: rgb(255 255 255 / 96%);
`;

const IndexSummaryBar = styled.div`
  display: grid;
  gap: 12px;

  grid-template-columns: repeat(4, minmax(140px, 1fr));

  @media (width <= 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (width <= 520px) {
    grid-template-columns: 1fr;
  }
`;

const IndexSummaryItem = styled.div`
  min-height: 82px;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;

  background: #f8fafc;
`;

const IndexEmptyState = styled.p`
  padding: 18px;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;

  background: #f8fafc;
  color: #64748b;
  font:
    700 13px/20px Inter,
    system-ui,
    sans-serif;
`;

const IndexInsightGrid = styled.div`
  margin-top: 14px;

  display: grid;
  gap: 12px;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (width <= 980px) {
    grid-template-columns: 1fr;
  }
`;

const IndexPanel = styled.div`
  min-width: 0;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;

  background: #fff;
`;

const IndexPanelTop = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
`;

const IndexPanelMeta = styled.span`
  color: #94a3b8;
  font:
    800 10px/14px Inter,
    system-ui,
    sans-serif;
`;

const DomainLoadMeta = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
`;

const DomainLoadLegend = styled.span`
  padding: 2px 6px;
  border-radius: 999px;

  background: #eef2f7;
  color: #475569;
  font:
    800 9px/13px Inter,
    system-ui,
    sans-serif;
`;

const BarList = styled.div`
  margin-top: 14px;

  display: flex;
  gap: 11px;
  flex-direction: column;
`;

const BarRow = styled.div`
  display: grid;
  gap: 8px;
  align-items: center;

  grid-template-columns: 72px minmax(0, 1fr) 56px;
`;

const BarLabel = styled.span`
  overflow: hidden;

  color: #475569;
  font:
    800 11px/16px Inter,
    system-ui,
    sans-serif;
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const BarTrack = styled.div`
  overflow: hidden;
  height: 8px;
  border-radius: 999px;

  background: #e8eef6;
`;

const BarFill = styled.span<{ $color: string; $percent: number }>`
  width: ${({ $percent }) => Math.max(4, Math.min(100, $percent))}%;
  height: 100%;
  border-radius: inherit;

  display: block;

  background: ${({ $color }) => $color};
`;

const BarValue = styled.strong`
  color: #0f172a;
  font:
    800 11px/16px Inter,
    system-ui,
    sans-serif;
  text-align: right;
`;

const CompactTableList = styled.div`
  margin-top: 12px;

  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const CompactTableRow = styled.div`
  display: grid;
  gap: 10px;
  align-items: center;

  color: #334155;
  font:
    800 12px/18px Inter,
    system-ui,
    sans-serif;

  grid-template-columns: minmax(0, 1fr) auto;

  span {
    overflow: hidden;
    min-width: 0;

    white-space: nowrap;

    text-overflow: ellipsis;
  }

  strong {
    min-width: 30px;
    padding: 3px 6px;
    border-radius: 6px;

    background: #eef2f7;
    color: #0f172a;
    text-align: center;
  }
`;

const DashboardDrilldown = styled.div`
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #e2e8f0;
`;

const DrilldownHeader = styled.div`
  display: flex;
  gap: 12px;
  align-items: start;
  justify-content: space-between;
`;

const DrilldownLead = styled.p`
  margin-top: 3px;

  color: #64748b;
  font:
    700 11px/17px Inter,
    system-ui,
    sans-serif;
`;

const DrilldownMeta = styled.span`
  flex-shrink: 0;

  color: #94a3b8;
  font:
    800 10px/14px Inter,
    system-ui,
    sans-serif;
`;

const DrilldownFilterBar = styled.div`
  width: fit-content;
  max-width: 100%;
  margin-top: 12px;
  padding: 4px;
  border: 1px solid #d6dee8;
  border-radius: 8px;

  display: flex;
  gap: 4px;

  background: #f8fafc;

  overflow-x: auto;
`;

const DrilldownFilterButton = styled.button<{ $active: boolean }>`
  height: 32px;
  min-width: 92px;
  padding: 0 9px;
  border: 0;
  border-radius: 6px;

  display: inline-flex;
  gap: 7px;
  align-items: center;
  justify-content: center;

  background: ${({ $active }) => ($active ? '#111827' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#334155')};
  font:
    800 11px/16px Inter,
    system-ui,
    sans-serif;

  cursor: pointer;

  strong {
    min-width: 22px;
    padding: 1px 5px;
    border-radius: 999px;

    background: ${({ $active }) =>
      $active ? 'rgba(255, 255, 255, 0.18)' : '#e8eef6'};
    color: inherit;
    text-align: center;
  }
`;

const DrilldownDomainFilterBar = styled.div`
  max-width: 100%;
  margin-top: 8px;
  padding: 4px;
  border: 1px solid #d6dee8;
  border-radius: 8px;

  display: flex;
  gap: 4px;

  background: #fff;

  overflow-x: auto;
`;

const DrilldownDomainButton = styled.button<{ $active: boolean }>`
  height: 32px;
  min-width: 98px;
  padding: 0 9px;
  border: 0;
  border-radius: 6px;

  display: inline-flex;
  gap: 7px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  background: ${({ $active }) => ($active ? '#fff3ed' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#9a3412' : '#334155')};
  font:
    800 11px/16px Inter,
    system-ui,
    sans-serif;

  cursor: pointer;

  strong {
    min-width: 22px;
    padding: 1px 5px;
    border-radius: 999px;

    background: ${({ $active }) => ($active ? '#fed7c4' : '#e8eef6')};
    color: inherit;
    text-align: center;
  }
`;

const DashboardTableGrid = styled.div`
  overflow: auto;
  max-height: 520px;
  margin-top: 12px;

  display: grid;
  gap: 10px;

  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
`;

const DashboardTableCard = styled.div`
  min-width: 0;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;

  background: #fff;
`;

const DashboardTableTop = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
`;

const IndexCountBadge = styled.strong`
  min-width: 28px;
  padding: 3px 6px;
  border-radius: 6px;

  background: #111827;
  color: #fff;
  font:
    800 10px/14px Inter,
    system-ui,
    sans-serif;
  text-align: center;
`;

const DashboardTableName = styled.strong`
  overflow: hidden;
  margin-top: 9px;

  display: block;

  color: #0f172a;
  font:
    800 14px/20px Inter,
    system-ui,
    sans-serif;
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const InlineIndexList = styled.div`
  margin-top: 9px;

  display: flex;
  gap: 7px;
  flex-direction: column;
`;

const InlineIndexChip = styled.div`
  min-width: 0;
  padding: 8px;
  border: 1px solid #edf2f7;
  border-radius: 8px;

  background: #f8fafc;
`;

const InlineIndexName = styled.strong`
  overflow: hidden;
  margin-top: 5px;

  display: block;

  color: #0f172a;
  font:
    800 11px/16px Inter,
    system-ui,
    sans-serif;
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const InlineIndexColumns = styled.span`
  margin-top: 2px;

  display: block;

  color: #64748b;
  font:
    700 10px/15px Inter,
    system-ui,
    sans-serif;

  overflow-wrap: anywhere;
`;

const NoIndexText = styled.p`
  margin-top: 9px;

  color: #94a3b8;
  font:
    700 11px/17px Inter,
    system-ui,
    sans-serif;
`;

const IndexTableDomain = styled.span<{
  $color: string;
  $background: string;
}>`
  overflow: hidden;
  max-width: 100%;
  padding: 3px 8px;
  border-radius: 6px;

  display: inline-flex;

  background: ${({ $background }) => $background};
  color: ${({ $color }) => $color};
  font:
    800 10px/14px Inter,
    system-ui,
    sans-serif;
  white-space: nowrap;

  text-overflow: ellipsis;
`;

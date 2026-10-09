import { useEffect, useRef, useState, type ReactNode } from "react";
import ContactsView from "./ContactsView";
import {
  contacts,
  developments,
  properties,
  reminders,
  schedule,
  stages,
  type Contact,
  type Property,
} from "./data";

const asset = (name: string) => `/assets/${name}.svg`;
function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <img className={className} src={asset(name)} alt="" aria-hidden="true" />
  );
}
function Panel({
  title,
  className = "",
  children,
  action,
}: {
  title: string;
  className?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className={`panel ${className}`} aria-label={title}>
      <div className="panel-heading">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
function AvatarStack({
  count,
  small = false,
}: {
  count: number;
  small?: boolean;
}) {
  return (
    <span
      className={`avatar-stack ${small ? "small" : ""}`}
      aria-label={`${count + (small ? 4 : 2)} leads`}
    >
      {small ? (
        <>
          <Icon name="reminder-one" />
          <Icon name="reminder-two" />
          <Icon name="reminder-three" />
          <Icon name="reminder-four" />
        </>
      ) : (
        <>
          <Icon name="lead-one" />
          <Icon name="lead-two" />
        </>
      )}
      <span>+{count}</span>
    </span>
  );
}
type ModalContent = { title: string; content: ReactNode };
function loadCompletedReminders(): string[] {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem("realtor360-completed") || "[]",
    );
    return Array.isArray(stored)
      ? stored.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}
function Modal({
  value,
  onClose,
}: {
  value: ModalContent;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="detail-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="dialog-title"
    >
      <div className="dialog-header">
        <h2 id="dialog-title">{value.title}</h2>
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          ×
        </button>
      </div>
      <div className="dialog-body">{value.content}</div>
    </dialog>
  );
}

function Legend({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (name: string | null) => void;
}) {
  return (
    <div className="legend" aria-label="Filter by development">
      {developments.map((d) => (
        <button
          key={d.name}
          aria-pressed={selected === d.name}
          className={selected && selected !== d.name ? "muted" : ""}
          onClick={() => onSelect(selected === d.name ? null : d.name)}
        >
          <span style={{ background: d.color }} />
          {d.name}
        </button>
      ))}
    </div>
  );
}
function LeadSource({
  onInspect,
}: {
  onInspect: (label: string, detail: string) => void;
}) {
  const labels = [
    {
      name: "Inbound Call",
      detail: "9 (37.87%)",
      className: "inbound",
      color: "#f6efd7",
    },
    {
      name: "Reference",
      detail: "1 (30.6%)",
      className: "reference",
      color: "#d4af37",
    },
    {
      name: "Website",
      detail: "10 (24.83%)",
      className: "website",
      color: "#eedfaf",
    },
    {
      name: "Facebook",
      detail: "1 (6.78%)",
      className: "facebook",
      color: "#ebd17d",
    },
  ];
  return (
    <Panel title="Deals by Lead Source" className="lead-source">
      <div className="donut-plot">
        <Icon name="lead-source" className="desktop-source-plot" />
        <Icon name="lead-source-mobile" className="mobile-source-plot" />
        {labels.map((l) => (
          <button
            key={l.name}
            className={`source-label ${l.className}`}
            onClick={() => onInspect(l.name, l.detail)}
          >
            <span className="source-name">
              <span className="source-dot" style={{ background: l.color }} />
              {l.name}
            </span>
            <span className="source-detail">{l.detail}</span>
          </button>
        ))}
      </div>
    </Panel>
  );
}
function StageChart({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (name: string | null) => void;
}) {
  const total = [8, 10, 9.4, 10, 8.5, 10],
    middle = [5.6, 7.15, 6.6, 7.15, 6, 7.15],
    bottom = [3, 3.8, 3.5, 3.8, 3.2, 3.8];
  const [tooltip, setTooltip] = useState<string | null>(null);
  return (
    <Panel title="Deals by Stages by Development" className="stage-panel">
      <div className="stage-chart" onMouseLeave={() => setTooltip(null)}>
        <svg
          viewBox="0 0 491 247"
          role="group"
          aria-label={`Deals by stage${selected ? ` for ${selected}` : " across all developments"}`}
        >
          {[0, 2.5, 5, 7.5, 10].map((v) => (
            <g key={v}>
              <line
                x1="46"
                x2="438"
                y1={170 - v * 14.9}
                y2={170 - v * 14.9}
                stroke="#bbb"
                strokeWidth="1"
              />
              <text x="34" y={174 - v * 14.9} textAnchor="end" fontSize="12">
                {v}
              </text>
            </g>
          ))}
          {!selected && (
            <image
              href={asset("stage-bars")}
              x="46"
              y="21"
              width="392"
              height="149"
            />
          )}
          {stages.map((s, i) => (
            <g
              key={s}
              tabIndex={0}
              role="img"
              aria-label={`${s}: ${total[i]} total records`}
              onFocus={() => setTooltip(`${s}: ${total[i]} records`)}
              onBlur={() => setTooltip(null)}
              onMouseEnter={() => setTooltip(`${s}: ${total[i]} records`)}
            >
              {selected && (
                <rect
                  x={67 + i * 62}
                  y={
                    170 -
                    (selected === "Angel Plaza"
                      ? bottom[i]
                      : selected === "Angel Garden"
                        ? middle[i] - bottom[i]
                        : total[i] - middle[i]) *
                      14.9
                  }
                  width="32"
                  height={
                    (selected === "Angel Plaza"
                      ? bottom[i]
                      : selected === "Angel Garden"
                        ? middle[i] - bottom[i]
                        : total[i] - middle[i]) * 14.9
                  }
                  rx="6"
                  fill={developments.find((d) => d.name === selected)!.color}
                />
              )}
              <rect
                x={62 + i * 62}
                y="20"
                width="42"
                height="152"
                fill="transparent"
              />
              <text
                transform={`translate(${[42.832, 87.082, 146.652, 210.053, 279.582, 336.854][i]} ${[200.497, 213.352, 216.566, 221.709, 211.424, 215.923][i]}) rotate(-40)`}
                fontSize="10"
                y="9.7"
              >
                {s}
              </text>
            </g>
          ))}
          <text
            x="246"
            y="250"
            textAnchor="middle"
            fontSize="14"
            className="axis-bottom"
          >
            Stage
          </text>
          <text
            transform="translate(10 95) rotate(-90)"
            textAnchor="middle"
            fontSize="14"
          >
            Record Count
          </text>
        </svg>
        {tooltip && <output className="chart-tooltip">{tooltip}</output>}
        <span className="stage-axis-label">Stage</span>
      </div>
      <div className="mobile-stage-chart" aria-label="Deals by stage">
        {stages.map((stage, i) => {
          const segments = [
            bottom[i],
            middle[i] - bottom[i],
            total[i] - middle[i],
          ];
          const count = selected
            ? segments[developments.findIndex((d) => d.name === selected)]
            : total[i];
          return (
            <div
              className="mobile-stage-row"
              key={stage}
              role="img"
              aria-label={`${stage}: ${Number(count.toFixed(2))} records${selected ? ` for ${selected}` : ""}`}
            >
              <div>
                <span>{stage}</span>
                <span>{Number(count.toFixed(2))}</span>
              </div>
              <div className="mobile-stage-track">
                {developments.map(
                  (development, index) =>
                    (!selected || selected === development.name) && (
                      <span
                        key={development.name}
                        style={{
                          width: `${segments[index] * 10}%`,
                          background: development.color,
                        }}
                      />
                    ),
                )}
              </div>
            </div>
          );
        })}
      </div>
      <Legend selected={selected} onSelect={onSelect} />
    </Panel>
  );
}
function SalesChart({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (name: string | null) => void;
}) {
  return (
    <Panel title="Deals by Sales People by Development" className="sales-panel">
      <svg
        className="sales-chart"
        viewBox="0 0 491 119"
        role="img"
        aria-label="Deals by sales people: 17.8 and 12 records"
      >
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i}>
            <line
              x1={26 + i * 56}
              x2={26 + i * 56}
              y1="2"
              y2="77"
              stroke="#bbb"
            />
            <text x={26 + i * 56} y="94" textAnchor="middle" fontSize="12">
              {i * 2.5}
            </text>
          </g>
        ))}
        {!selected ? (
          <image
            href={asset("sales-bars")}
            x="26"
            y="2"
            width="450"
            height="75"
          />
        ) : (
          [0, 1].map((i) => (
            <rect
              key={i}
              x="26"
              y={5 + i * 37}
              width={
                (selected === "Angel Plaza"
                  ? [4.9, 2.3]
                  : selected === "Angel Garden"
                    ? [6.15, 5.55]
                    : [6.65, 4.2])[i] * 22.4
              }
              height="28"
              rx="8"
              fill={developments.find((d) => d.name === selected)!.color}
            />
          ))
        )}
        <text
          transform="translate(9 40) rotate(-90)"
          fontSize="14"
          textAnchor="middle"
        >
          Deal Owner
        </text>
        <text x="245" y="114" fontSize="14" textAnchor="middle">
          Record Count
        </text>
      </svg>
      <Legend selected={selected} onSelect={onSelect} />
    </Panel>
  );
}
function Calendar({
  onInspect,
}: {
  onInspect: (title: string, content: ReactNode) => void;
}) {
  const [month, setMonth] = useState(new Date(2025, 6, 1));
  const [selected, setSelected] = useState<number | null>(8);
  const [filtered, setFiltered] = useState(false);
  const isDesignMonth = month.getFullYear() === 2025 && month.getMonth() === 6;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const visibleSchedule = isDesignMonth
    ? schedule.filter((item) => !filtered || item.day === selected)
    : [];
  const changeMonth = (delta: number) => {
    setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));
    setSelected(null);
    setFiltered(false);
  };
  return (
    <section
      className="panel calendar-panel"
      aria-label="Calendar and schedule"
    >
      <div className="calendar-heading">
        <h2 aria-live="polite">
          {month.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div>
          <button aria-label="Previous month" onClick={() => changeMonth(-1)}>
            <Icon name="arrow-left" />
          </button>
          <button aria-label="Next month" onClick={() => changeMonth(1)}>
            <Icon name="arrow-right" />
          </button>
        </div>
      </div>
      <div className="calendar-grid">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span className="weekday" key={`weekday-${i}`}>
            {d}
          </span>
        ))}
        {Array.from({ length: month.getDay() }, (_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const day = i + 1;
          const category = isDesignMonth
            ? schedule.find((s) => s.day === day)?.category
            : undefined;
          return (
            <button
              key={day}
              className={`day ${day === selected ? "selected" : ""}`}
              aria-label={`${month.toLocaleDateString("en-US", { month: "long" })} ${day}, ${month.getFullYear()}${category ? ", scheduled events" : ""}`}
              aria-pressed={day === selected}
              onClick={() => {
                setSelected(day);
                setFiltered(true);
              }}
            >
              <span className={category}>{day}</span>
            </button>
          );
        })}
      </div>
      <div className="schedule">
        <div className="schedule-heading">
          <h3>My Schedule</h3>
          {filtered && (
            <button className="text-button" onClick={() => setFiltered(false)}>
              Show all
            </button>
          )}
        </div>
        <div className="schedule-items">
          {visibleSchedule.map((item) => (
            <button
              key={item.title}
              className={`schedule-item ${item.category}`}
              onClick={() =>
                onInspect(
                  item.title,
                  <>
                    <p>{item.description}</p>
                    <p className="detail-muted">July {item.day}, 2025</p>
                  </>,
                )
              }
            >
              <span>{item.title}</span>
              <small>{item.description}</small>
            </button>
          ))}
          {!visibleSchedule.length && (
            <p className="empty-state">
              No events scheduled{filtered ? " for this day" : " this month"}.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState<"Home" | "Contacts">(() =>
    window.location.hash === "#/contacts" ? "Contacts" : "Home",
  );
  useEffect(() => {
    const syncRoute = () => {
      if (window.location.hash === "#/contacts") setActiveView("Contacts");
      else if (window.location.hash === "#/home" || !window.location.hash)
        setActiveView("Home");
    };
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);
  useEffect(() => {
    document.title = `Realtor360 | ${activeView}`;
  }, [activeView]);
  const [query, setQuery] = useState("");
  const [development, setDevelopment] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalContent | null>(null);
  const [menu, setMenu] = useState<"more" | "profile" | "mobile" | null>(null);
  const [sort, setSort] = useState<{
    key: "name" | "units" | "views";
    ascending: boolean;
  } | null>(null);
  const [completed, setCompleted] = useState<string[]>(loadCompletedReminders);
  useEffect(() => {
    try {
      localStorage.setItem("realtor360-completed", JSON.stringify(completed));
    } catch {
      /* Storage may be unavailable in private browsing. */
    }
  }, [completed]);
  const menuRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenu(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(null);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  const inspect = (title: string, content: ReactNode) => {
    setMenu(null);
    setModal({ title, content });
  };
  const showContact = (contact: Contact) =>
    inspect(
      contact.name,
      <div className="contact-detail">
        <Icon name={contact.image} />
        <p>{contact.location}</p>
        {contact.email ? (
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        ) : (
          <p className="detail-muted">
            No email or phone number is available in this contact record.
          </p>
        )}
      </div>,
    );
  const showProperty = (property: Property) =>
    inspect(
      property.name,
      <>
        <div className="property-detail">
          <Icon name={property.image} />
          <strong>{property.price}</strong>
          <span
            className={`status ${property.status === "Sold Out" ? "sold" : ""}`}
          >
            {property.status}
          </span>
        </div>
        <dl className="details-grid">
          <dt>Property type</dt>
          <dd>{property.type}</dd>
          <dt>Units</dt>
          <dd>{property.units}</dd>
          <dt>Active leads</dt>
          <dd>{property.leads + 2}</dd>
          <dt>Views</dt>
          <dd>{property.views}</dd>
        </dl>
      </>,
    );
  const filteredProperties = properties
    .filter((p) =>
      `${p.name} ${p.type} ${p.status}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      !sort
        ? 0
        : (typeof a[sort.key] === "string"
            ? String(a[sort.key]).localeCompare(String(b[sort.key]))
            : Number(a[sort.key]) - Number(b[sort.key])) *
          (sort.ascending ? 1 : -1),
    );
  const filteredContacts = contacts.filter((c) =>
    `${c.name} ${c.location}`.toLowerCase().includes(query.toLowerCase()),
  );
  const nav = [
    "Home",
    "Developments",
    "Buildings",
    "Units",
    "Leads",
    "Companies",
    "Contacts",
    "Deals",
    "Activities",
    "Attorney Firms",
    "Reports",
  ];
  const openModule = (name: string) => {
    if (name === "Contacts") {
      setActiveView("Contacts");
      window.location.hash = "/contacts";
      setQuery("");
      setMenu(null);
      window.scrollTo({ top: 0 });
      return;
    }
    if (name === "Home") {
      setActiveView("Home");
      window.location.hash = "/home";
      setQuery("");
      setDevelopment(null);
      setMenu(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (["Buildings", "Units"].includes(name)) {
      setActiveView("Home");
      window.location.hash = "/home";
      setQuery(name === "Units" ? "Apartment" : "");
      setMenu(null);
      requestAnimationFrame(() =>
        document
          .getElementById("listings")
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      );
      return;
    }
    if (name === "Leads") {
      inspect(
        name,
        <div className="dialog-contact-list">
          {contacts.map((c) => (
            <button key={c.name} onClick={() => showContact(c)}>
              <Icon name={c.image} />
              <span>
                {c.name}
                <small>{c.location}</small>
              </span>
              <span>↗</span>
            </button>
          ))}
        </div>,
      );
      return;
    }
    if (["Developments", "Deals", "Reports"].includes(name)) {
      inspect(
        name,
        <>
          <p className="detail-muted">Current development pipeline</p>
          <div className="pipeline-summary">
            {[...developments]
              .sort((a, b) => b.count - a.count)
              .map((d) => (
                <div key={d.name}>
                  <span>{d.name}</span>
                  <strong>{d.count} records</strong>
                </div>
              ))}
          </div>
        </>,
      );
      return;
    }
    if (name === "Activities") {
      inspect(
        name,
        <div className="dialog-schedule">
          {schedule.map((s) => (
            <div key={s.title}>
              <strong>{s.title}</strong>
              <p>{s.description}</p>
              <small>July {s.day}, 2025</small>
            </div>
          ))}
        </div>,
      );
      return;
    }
    inspect(
      name,
      <p className="detail-muted">
        There are no {name.toLowerCase()} records in the supplied dashboard
        data.
      </p>,
    );
  };
  const sortBy = (key: "name" | "units" | "views") =>
    setSort({ key, ascending: sort?.key === key ? !sort.ascending : true });
  return (
    <>
      <a
        className="skip-link"
        href={activeView === "Contacts" ? "#contacts-content" : "#dashboard"}
      >
        Skip to {activeView === "Contacts" ? "contacts" : "dashboard"}
      </a>
      <header
        className={`topbar ${activeView === "Contacts" ? "contacts-topbar" : ""}`}
        ref={menuRef}
      >
        <button
          className="brand"
          aria-label="Realtor360 home"
          onClick={() => openModule("Home")}
        >
          <Icon name="logo" />
        </button>
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map((n) => (
            <button
              key={n}
              className={n === activeView ? "active" : ""}
              aria-current={n === activeView ? "page" : undefined}
              onClick={() => openModule(n)}
            >
              {n}
            </button>
          ))}
        </nav>
        <div className="more-wrapper">
          <button
            className="more-button"
            aria-label="More navigation"
            aria-expanded={menu === "more"}
            onClick={() => setMenu(menu === "more" ? null : "more")}
          >
            ···
          </button>
          {menu === "more" && (
            <div className="dropdown">
              <button
                onClick={() =>
                  inspect(
                    "Settings",
                    <p>
                      Realtor360 dashboard · Local demo
                      <br />
                      Your completed reminders are saved in this browser.
                    </p>,
                  )
                }
              >
                Settings
              </button>
              <button
                onClick={() =>
                  inspect(
                    "About Realtor360",
                    <p>
                      A real estate dashboard for managing listings, leads,
                      developments, and daily activities.
                    </p>,
                  )
                }
              >
                About Realtor360
              </button>
            </div>
          )}
        </div>
        <label className="search-box">
          <span className="sr-only">Search listings and contacts</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            type="search"
          />
          <Icon name="search" />
        </label>
        <div className="profile-wrapper">
          <button
            className="profile-button"
            aria-label="Open profile menu"
            aria-expanded={menu === "profile"}
            onClick={() => setMenu(menu === "profile" ? null : "profile")}
          >
            <Icon name="profile" />
            <Icon name="arrow-down" />
          </button>
          {menu === "profile" && (
            <div className="dropdown profile-dropdown">
              <strong>My workspace</strong>
              <span>Realtor360</span>
              <button
                onClick={() => {
                  setCompleted([]);
                  setMenu(null);
                }}
              >
                Reset completed reminders
              </button>
            </div>
          )}
        </div>
        <button
          className="mobile-toggle"
          aria-label={
            menu === "mobile" ? "Close navigation" : "Open navigation"
          }
          aria-expanded={menu === "mobile"}
          aria-controls="mobile-navigation"
          onClick={() => setMenu(menu === "mobile" ? null : "mobile")}
        >
          {menu === "mobile" ? "×" : "☰"}
        </button>
        {menu === "mobile" && (
          <nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            {nav.map((n) => (
              <button
                key={n}
                className={n === activeView ? "active" : ""}
                aria-current={n === activeView ? "page" : undefined}
                onClick={() => openModule(n)}
              >
                {n}
              </button>
            ))}
          </nav>
        )}
      </header>
      {activeView === "Contacts" ? (
        <ContactsView
          globalQuery={query}
          onClearQuery={() => setQuery("")}
          inspect={inspect}
          closeDialog={() => setModal(null)}
        />
      ) : (
        <main id="dashboard" className="dashboard">
          <h1 className="sr-only">Realtor360 real estate dashboard</h1>
          <div className="main-content">
            <section className="stats" aria-label="Key performance indicators">
              {[
                ["Active Listing", "23", "-12%", "listing"],
                ["Active Leads", "120", "+12%", "leads"],
                ["Total Closed", "42", "+12%", "closed"],
                ["Total Revenue", "Rs.22Cr.", "+12%", "revenue"],
              ].map(([label, value, trend, icon]) => (
                <article key={label} className="panel stat-card">
                  <div className="stat-label">
                    <Icon name={`stat-${icon}`} />
                    <h2>{label}</h2>
                  </div>
                  <div className="stat-value">
                    <strong>{value}</strong>
                    <span
                      className={`trend ${trend[0] === "-" ? "negative" : ""}`}
                    >
                      {trend}
                      <span aria-hidden="true">
                        {trend[0] === "-" ? "↘" : "↗"}
                      </span>
                    </span>
                  </div>
                </article>
              ))}
            </section>
            <div className="charts-grid">
              <LeadSource
                onInspect={(title, detail) =>
                  inspect(
                    title,
                    <>
                      <p>{detail}</p>
                      <p className="detail-muted">
                        Lead source figures reproduced from the supplied design.
                      </p>
                    </>,
                  )
                }
              />
              <StageChart selected={development} onSelect={setDevelopment} />
              <div className="sales-column">
                <SalesChart selected={development} onSelect={setDevelopment} />
                <Panel title="Total Deals Closed" className="closed-panel">
                  <div
                    className="progress-track"
                    role="meter"
                    aria-label="Closed deals"
                    aria-valuemin={0}
                    aria-valuemax={174}
                    aria-valuenow={42}
                  >
                    <div>
                      <svg
                        className="progress-marker"
                        viewBox="0 0 3 49"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <circle
                          cx="1.5"
                          cy="1.5"
                          r="1"
                          fill="currentColor"
                          stroke="currentColor"
                        />
                        <path
                          d="M1.5 3V5.687M1.5 46V43.312M1.5 11.062V16.437M1.5 21.812V27.187M1.5 32.562V37.937"
                          stroke="currentColor"
                        />
                        <circle
                          cx="1.5"
                          cy="47.5"
                          r="1"
                          fill="currentColor"
                          stroke="currentColor"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="progress-summary">
                    <span>
                      <strong>42</strong> Closed Deals
                    </span>
                    <span>
                      <strong>132</strong> On Progress
                    </span>
                  </div>
                </Panel>
              </div>
              <Panel
                title="Deals in Pipeline by Development"
                className="pipeline-panel"
              >
                <table>
                  <thead>
                    <tr>
                      <th>Development Name</th>
                      <th>Record Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...developments]
                      .sort((a, b) => b.count - a.count)
                      .filter((d) => !development || d.name === development)
                      .map((d) => (
                        <tr key={d.name}>
                          <td>
                            <button
                              onClick={() =>
                                inspect(
                                  d.name,
                                  <p>
                                    {d.count} {d.count === 1 ? "deal" : "deals"}{" "}
                                    currently in the pipeline.
                                  </p>,
                                )
                              }
                            >
                              {d.name}
                            </button>
                          </td>
                          <td>{d.count}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {development && (
                  <button
                    className="text-button clear-filter"
                    onClick={() => setDevelopment(null)}
                  >
                    Clear development filter
                  </button>
                )}
              </Panel>
            </div>
            <div className="bottom-grid">
              <div id="listings">
                <Panel title="Active Listing" className="listing-panel">
                  <div
                    className="table-scroll"
                    tabIndex={0}
                    role="region"
                    aria-label="Property listings table"
                  >
                    <table className="listing-table">
                      <colgroup>
                        <col className="property-col" />
                        <col />
                        <col />
                        <col />
                        <col className="leads-col" />
                        <col className="views-col" />
                        <col className="status-col" />
                      </colgroup>
                      <thead>
                        <tr>
                          {[
                            "Property",
                            "Type",
                            "Units",
                            "Price",
                            "Active Leads",
                            "Views",
                            "Status",
                          ].map((label) => {
                            const key =
                              label === "Property"
                                ? "name"
                                : label === "Units"
                                  ? "units"
                                  : label === "Views"
                                    ? "views"
                                    : null;
                            return (
                              <th
                                key={label}
                                aria-sort={
                                  key && sort?.key === key
                                    ? sort.ascending
                                      ? "ascending"
                                      : "descending"
                                    : undefined
                                }
                              >
                                {key ? (
                                  <button onClick={() => sortBy(key)}>
                                    {label}
                                    {sort?.key === key
                                      ? sort.ascending
                                        ? " ↑"
                                        : " ↓"
                                      : ""}
                                  </button>
                                ) : (
                                  label
                                )}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProperties.map((p) => (
                          <tr key={p.id}>
                            <td>
                              <button
                                className="property-name"
                                onClick={() => showProperty(p)}
                              >
                                <Icon name={p.image} />
                                <span>{p.name}</span>
                              </button>
                            </td>
                            <td>{p.type}</td>
                            <td>{p.units}</td>
                            <td>{p.price}</td>
                            <td>
                              <button
                                className="lead-stack-button"
                                onClick={() => openModule("Leads")}
                                aria-label={`View ${p.leads + 2} leads for ${p.name}`}
                              >
                                <AvatarStack count={p.leads} />
                              </button>
                            </td>
                            <td>{p.views}</td>
                            <td>
                              <span
                                className={`status ${p.status === "Sold Out" ? "sold" : ""}`}
                              >
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div
                    className="mobile-listings"
                    aria-label="Property listings"
                  >
                    <div
                      className="mobile-listing-sort"
                      aria-label="Sort property listings"
                    >
                      <span>Sort by</span>
                      {(
                        [
                          ["name", "Name"],
                          ["units", "Units"],
                          ["views", "Views"],
                        ] as const
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => sortBy(key)}
                          aria-pressed={sort?.key === key}
                        >
                          {label}
                          {sort?.key === key
                            ? sort.ascending
                              ? " ↑"
                              : " ↓"
                            : ""}
                        </button>
                      ))}
                    </div>
                    {filteredProperties.map((property) => (
                      <article className="mobile-listing" key={property.id}>
                        <button
                          className="mobile-property"
                          onClick={() => showProperty(property)}
                        >
                          <Icon name={property.image} />
                          <span>
                            <strong>{property.name}</strong>
                            <small>
                              {property.type} ·{" "}
                              {property.units.toLocaleString("en-IN")} units
                            </small>
                          </span>
                        </button>
                        <div className="mobile-listing-summary">
                          <strong>{property.price}</strong>
                          <span
                            className={`status ${property.status === "Sold Out" ? "sold" : ""}`}
                          >
                            {property.status}
                          </span>
                        </div>
                        <div className="mobile-listing-meta">
                          <button
                            onClick={() => openModule("Leads")}
                            aria-label={`View ${property.leads + 2} leads for ${property.name}`}
                          >
                            {property.leads + 2} active leads
                          </button>
                          <span>{property.views} views</span>
                        </div>
                      </article>
                    ))}
                  </div>
                  {!filteredProperties.length && (
                    <p className="empty-state">
                      No properties match “{query}”.{" "}
                      <button
                        className="text-button"
                        onClick={() => setQuery("")}
                      >
                        Clear search
                      </button>
                    </p>
                  )}
                </Panel>
              </div>
              <Panel
                title="Leads Contacts"
                className="contacts-panel"
                action={
                  <button
                    className="expand-button"
                    aria-label="View all contacts"
                    onClick={() => openModule("Contacts")}
                  >
                    ↗
                  </button>
                }
              >
                <div className="contact-list">
                  {filteredContacts.map((c) => (
                    <div className="contact" key={c.name}>
                      <button
                        className="contact-person"
                        onClick={() => showContact(c)}
                      >
                        <Icon name={c.image} />
                        <span>
                          {c.name}
                          <small>{c.location}</small>
                        </span>
                      </button>
                      <button
                        className="call-button"
                        aria-label={`Contact ${c.name}`}
                        onClick={() => showContact(c)}
                      >
                        <Icon name="call" />
                      </button>
                    </div>
                  ))}
                </div>
                {!filteredContacts.length && (
                  <p className="empty-state">No matching contacts.</p>
                )}
              </Panel>
            </div>
          </div>
          <aside className="sidebar">
            <Panel title="Reminder" className="reminders-panel">
              <div className="reminder-list">
                {reminders.map((r, index) => (
                  <button
                    className={`reminder ${index === 0 ? "featured" : ""} ${completed.includes(r.title) ? "completed" : ""}`}
                    key={r.title}
                    onClick={() =>
                      inspect(
                        r.title,
                        <>
                          <p>{r.description}</p>
                          {index === 0 && (
                            <div className="dialog-contact-list">
                              {contacts.map((c) => (
                                <button
                                  key={c.name}
                                  onClick={() => showContact(c)}
                                >
                                  <Icon name={c.image} />
                                  <span>{c.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                          <button
                            className="primary-button"
                            onClick={() => {
                              setCompleted((current) =>
                                current.includes(r.title)
                                  ? current.filter((t) => t !== r.title)
                                  : [...current, r.title],
                              );
                              setModal(null);
                            }}
                          >
                            {completed.includes(r.title)
                              ? "Mark as pending"
                              : "Mark as complete"}
                          </button>
                        </>,
                      )
                    }
                  >
                    <span>
                      {completed.includes(r.title) && (
                        <span aria-label="Completed">✓ </span>
                      )}
                      {r.title}
                    </span>
                    <small>{r.description}</small>
                    {index === 0 && <AvatarStack count={11} small />}
                  </button>
                ))}
              </div>
            </Panel>
            <Calendar onInspect={inspect} />
          </aside>
        </main>
      )}
      {query && activeView === "Home" && (
        <span className="sr-only" role="status">
          {filteredProperties.length} properties and {filteredContacts.length}{" "}
          contacts found.
        </span>
      )}
      {modal && <Modal value={modal} onClose={() => setModal(null)} />}
    </>
  );
}

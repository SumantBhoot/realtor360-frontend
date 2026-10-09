import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  contactStatuses,
  designContacts,
  emptyFilters,
  filterGroups,
  statusClass,
  type ContactFilters,
  type DirectoryContact,
  type FilterKey,
} from "./contacts-data";
import "./contacts.css";

type Inspector = (title: string, content: ReactNode) => void;
const icon = (name: string) => (
  <img src={`/assets/contacts-${name}.svg`} alt="" aria-hidden="true" />
);
const storageKey = "realtor360-created-contacts";
function readCreatedContacts(): DirectoryContact[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (!Array.isArray(value)) return [];
    return value.filter(
      (item): item is DirectoryContact =>
        !!item &&
        typeof item === "object" &&
        [
          "id",
          "name",
          "email",
          "company",
          "role",
          "phone",
          "stage",
          "assignedTo",
        ].every((key) => typeof item[key] === "string") &&
        contactStatuses.includes(item.status),
    );
  } catch {
    return [];
  }
}
function CreateContactForm({
  onSave,
}: {
  onSave: (contact: DirectoryContact) => void;
}) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (key: string) => String(data.get(key) || "").trim();
    if (!field("name")) return;
    onSave({
      id: crypto.randomUUID(),
      name: field("name"),
      email: field("email"),
      company: field("company"),
      phone: field("phone"),
      role: field("role"),
      status: field("status") as DirectoryContact["status"],
      assignedTo: field("assignedTo"),
      stage: field("stage"),
      city: field("city") || undefined,
      source: field("source") || undefined,
    });
  };
  return (
    <form className="create-contact-form" onSubmit={submit}>
      <label>
        Contact name
        <input name="name" required autoFocus autoComplete="name" />
      </label>
      <label>
        Email
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label>
        Company
        <input name="company" required autoComplete="organization" />
      </label>
      <label>
        Phone number
        <input name="phone" type="tel" required autoComplete="tel" />
      </label>
      <label>
        Role
        <select name="role">
          {["Buyer", "Seller", "Investor", "Broker", "Developer"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label>
        Status
        <select name="status">
          {contactStatuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label>
        Assigned to
        <select name="assignedTo">
          {["Jessica Chen", "Mohit", "Arjun", "Emily"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label>
        Deal stage
        <select name="stage">
          {[
            "Negotiation",
            "Interested",
            "Site Visit Done",
            "Unit Shortlisted",
            "Contracts Signed",
            "Offer Initiated",
            "Offer Accepted",
          ].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label>
        City
        <select name="city">
          <option value="">Not specified</option>
          {filterGroups[3].options.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label>
        Lead source
        <select name="source">
          <option value="">Not specified</option>
          {filterGroups[4].options.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <button type="submit" className="primary-button">
        Create contact
      </button>
    </form>
  );
}

export default function ContactsView({
  globalQuery,
  onClearQuery,
  inspect,
  closeDialog,
}: {
  globalQuery: string;
  onClearQuery: () => void;
  inspect: Inspector;
  closeDialog: () => void;
}) {
  const [created, setCreated] =
    useState<DirectoryContact[]>(readCreatedContacts);
  const [search, setSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [appliedName, setAppliedName] = useState("");
  const [draft, setDraft] = useState<ContactFilters>(emptyFilters);
  const [filters, setFilters] = useState<ContactFilters>(emptyFilters);
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"table" | "cards">("table");
  const [openMenu, setOpenMenu] = useState<"view" | "actions" | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState<{
    key: keyof DirectoryContact;
    direction: 1 | -1;
  } | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const toolbar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(created));
    } catch {
      /* The view remains usable when storage is unavailable. */
    }
  }, [created]);
  useEffect(() => {
    setPage(1);
  }, [globalQuery]);
  useEffect(() => {
    const outside = (e: MouseEvent) => {
      if (!toolbar.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setFiltersOpen(false);
      }
    };
    document.addEventListener("click", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("click", outside);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  const allContacts = [...created, ...designContacts];
  const filtered = allContacts
    .filter((contact) => {
      const searchable =
        `${contact.name} ${contact.email} ${contact.company} ${contact.role} ${contact.phone} ${contact.status} ${contact.assignedTo}`.toLowerCase();
      return (
        [globalQuery, search].every((q) =>
          searchable.includes(q.toLowerCase().trim()),
        ) &&
        contact.name.toLowerCase().includes(appliedName.toLowerCase().trim()) &&
        filterGroups.every(
          (group) =>
            !filters[group.key].length ||
            filters[group.key].some((value) =>
              group.key === "assignedTo"
                ? contact.assignedTo.startsWith(value)
                : contact[group.key] === value,
            ),
        )
      );
    })
    .sort((a, b) =>
      sort
        ? String(a[sort.key] || "").localeCompare(String(b[sort.key] || "")) *
          sort.direction
        : 0,
    );
  const hasFilters = !!(
    search ||
    globalQuery ||
    appliedName ||
    Object.values(filters).some((v) => v.length)
  );
  // Figma includes three page controls but supplies only the first eight records.
  const pageCount = hasFilters
    ? Math.max(1, Math.ceil(filtered.length / 8))
    : Math.max(3, Math.ceil(filtered.length / 8));
  const visible = filtered.slice((page - 1) * 8, page * 8);
  const toggle = (key: FilterKey, value: string) =>
    setDraft((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((v) => v !== value)
        : [...current[key], value],
    }));
  const reset = () => {
    setDraft(emptyFilters());
    setFilters(emptyFilters());
    setNameSearch("");
    setAppliedName("");
    setSearch("");
    onClearQuery();
    setPage(1);
    setAnnouncement("All contact filters reset.");
  };
  const showContact = (contact: DirectoryContact) =>
    inspect(
      contact.name,
      <div className="directory-details">
        <span className={`directory-status ${statusClass(contact.status)}`}>
          {contact.status}
        </span>
        <dl>
          {[
            ["Email", contact.email],
            ["Company", contact.company],
            ["Role", contact.role],
            ["Phone", contact.phone],
            ["Deal stage", contact.stage],
            ["Assigned to", contact.assignedTo],
            ["City", contact.city || "Not specified"],
            ["Lead source", contact.source || "Not specified"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>,
    );
  const create = () =>
    inspect(
      "Create Contact",
      <CreateContactForm
        onSave={(contact) => {
          setCreated((current) => [contact, ...current]);
          reset();
          setAnnouncement(`${contact.name} created.`);
          closeDialog();
        }}
      />,
    );
  const exportContacts = () => {
    const columns: (keyof DirectoryContact)[] = [
      "name",
      "email",
      "company",
      "role",
      "phone",
      "stage",
      "status",
      "assignedTo",
      "city",
      "source",
    ];
    const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const text = [
      columns.join(","),
      ...filtered.map((contact) =>
        columns.map((key) => quote(String(contact[key] || ""))).join(","),
      ),
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "realtor360-contacts.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setOpenMenu(null);
    setAnnouncement(`Exported ${filtered.length} contacts.`);
  };
  const sortBy = (key: keyof DirectoryContact) => {
    setSort((current) => ({
      key,
      direction: current?.key === key && current.direction === 1 ? -1 : 1,
    }));
    setPage(1);
  };
  return (
    <main className="contacts-view" id="contacts-content">
      <aside
        className={`contacts-filters ${filtersOpen ? "is-open" : ""}`}
        aria-label="Contact filters"
      >
        <h2>Filters</h2>
        <label className="contacts-name-search">
          <span className="sr-only">Search by Contact Name</span>
          <input
            placeholder="Search by Contact Name"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setAppliedName(nameSearch);
                setFilters(draft);
                setPage(1);
              }
            }}
          />
          {icon("search-small")}
        </label>
        {filterGroups.map((group) => (
          <fieldset key={group.key}>
            <legend>{group.title}</legend>
            <div className="filter-options">
              {group.options.map((value) => (
                <label key={value}>
                  <input
                    type="checkbox"
                    checked={draft[group.key].includes(value)}
                    onChange={() => toggle(group.key, value)}
                  />
                  <span>{value}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <div className="filter-buttons">
          <button
            className="apply-filters"
            onClick={() => {
              setFilters(draft);
              setAppliedName(nameSearch);
              setPage(1);
              setFiltersOpen(false);
              setAnnouncement("Contact filters applied.");
            }}
          >
            Apply Filters
          </button>
          <button className="reset-filters" onClick={reset}>
            Reset Filters
          </button>
        </div>
      </aside>
      <section className="contacts-directory" aria-labelledby="contacts-title">
        <div className="contacts-toolbar" ref={toolbar}>
          <h1 id="contacts-title">All Contacts</h1>
          <button className="create-contact" onClick={create}>
            {icon("add")}Create Contact
          </button>
          <button
            className="contacts-filter-toggle"
            onClick={() => setFiltersOpen(!filtersOpen)}
            aria-expanded={filtersOpen}
          >
            Filters
          </button>
          <div className="contacts-tools">
            <label className="contacts-search">
              <span className="sr-only">Search Contact</span>
              <input
                placeholder="Search Contact"
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              {icon("search")}
            </label>
            <div className="contacts-menu-wrap">
              <button
                className="contacts-view-switch"
                aria-label="Contact display options"
                aria-expanded={openMenu === "view"}
                onClick={() => setOpenMenu(openMenu === "view" ? null : "view")}
              >
                {icon("grid")}
                {icon("dropdown")}
              </button>
              {openMenu === "view" && (
                <div className="dropdown">
                  <button
                    onClick={() => {
                      setView("table");
                      setOpenMenu(null);
                    }}
                    aria-pressed={view === "table"}
                  >
                    Table view
                  </button>
                  <button
                    onClick={() => {
                      setView("cards");
                      setOpenMenu(null);
                    }}
                    aria-pressed={view === "cards"}
                  >
                    Card view
                  </button>
                </div>
              )}
            </div>
            <div className="contacts-menu-wrap">
              <button
                className="contacts-actions"
                aria-expanded={openMenu === "actions"}
                onClick={() =>
                  setOpenMenu(openMenu === "actions" ? null : "actions")
                }
              >
                Actions{icon("dropdown")}
              </button>
              {openMenu === "actions" && (
                <div className="dropdown">
                  <button onClick={exportContacts}>
                    Export contacts as CSV
                  </button>
                  <button
                    onClick={() => {
                      reset();
                      setOpenMenu(null);
                    }}
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="contacts-results">
          {view === "table" ? (
            <div
              className="contacts-table-scroll"
              tabIndex={0}
              role="region"
              aria-label="All contacts table"
            >
              <table className="directory-table">
                <colgroup>
                  {[290, 130, 93, 150, 130, 148, 140].map((width, i) => (
                    <col
                      key={i}
                      style={{ width: `${(width / 1081) * 100}%` }}
                    />
                  ))}
                </colgroup>
                <thead>
                  <tr>
                    {[
                      ["Contact Name", "name"],
                      ["Company", "company"],
                      ["Role", "role"],
                      ["Phone No.", "phone"],
                      ["Deal Stage", "stage"],
                      ["Status", "status"],
                      ["Assigned to", "assignedTo"],
                    ].map(([label, key]) => (
                      <th
                        key={key}
                        scope="col"
                        aria-sort={
                          sort?.key === key
                            ? sort.direction === 1
                              ? "ascending"
                              : "descending"
                            : undefined
                        }
                      >
                        <button
                          onClick={() => sortBy(key as keyof DirectoryContact)}
                        >
                          {label}
                          {sort?.key === key && (
                            <span className="sort-direction">
                              {sort.direction === 1 ? " ↑" : " ↓"}
                            </span>
                          )}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((contact) => (
                    <tr key={contact.id}>
                      <td>
                        <button
                          className="directory-name"
                          onClick={() => showContact(contact)}
                        >
                          <strong>{contact.name}</strong>
                          <span>
                            <b>Email:</b> {contact.email}
                          </span>
                        </button>
                      </td>
                      <td>{contact.company}</td>
                      <td>{contact.role}</td>
                      <td>{contact.phone}</td>
                      <td>{contact.stage}</td>
                      <td>
                        <span
                          className={`directory-status ${statusClass(contact.status)}`}
                        >
                          {contact.status}
                        </span>
                      </td>
                      <td>{contact.assignedTo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="directory-cards">
              {visible.map((contact) => (
                <button
                  key={contact.id}
                  className="directory-card"
                  onClick={() => showContact(contact)}
                >
                  <strong>{contact.name}</strong>
                  <span>{contact.email}</span>
                  <span>
                    {contact.company} · {contact.role}
                  </span>
                  <span
                    className={`directory-status ${statusClass(contact.status)}`}
                  >
                    {contact.status}
                  </span>
                </button>
              ))}
            </div>
          )}
          {!visible.length && (
            <div className="contacts-empty">
              <h2>
                {filtered.length
                  ? "No contacts on this page"
                  : "No matching contacts"}
              </h2>
              <p>
                {page > 1
                  ? "Return to page 1 to see your contacts."
                  : "Try another search or reset your filters."}
              </p>
              <button
                className="primary-button"
                onClick={() => {
                  if (page > 1) setPage(1);
                  else reset();
                }}
              >
                {page > 1 ? "Back to page 1" : "Reset filters"}
              </button>
            </div>
          )}
          <nav className="contacts-pagination" aria-label="Contact pages">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              {icon("prev")}Prev
            </button>
            <span>|</span>
            {Array.from({ length: pageCount }, (_, i) => (
              <span className="page-number-pair" key={i}>
                <button
                  className={page === i + 1 ? "current-page" : ""}
                  aria-label={`Page ${i + 1}`}
                  aria-current={page === i + 1 ? "page" : undefined}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
                <span>|</span>
              </span>
            ))}
            <button
              disabled={page === pageCount}
              onClick={() => setPage((p) => p + 1)}
            >
              Next{icon("next")}
            </button>
          </nav>
        </div>
      </section>
      <span className="sr-only" role="status">
        {announcement} {filtered.length} contacts found.
      </span>
    </main>
  );
}

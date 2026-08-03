import { useState } from "react";
import "./settings.css";
import axios from "axios";
import {
  FiSettings,
  FiUsers,
  FiShield,
  FiTool,
  FiClock,
  FiSearch,
  FiPlus,
  FiMoreVertical,
  FiCheck,
  FiX,
  FiAlertTriangle,
} from "react-icons/fi";

// ---------------------------------------------------------------------
// Static config — swap these for real API data once your endpoints exist
// ---------------------------------------------------------------------

const NAV_ITEMS = [
  { id: "general", label: "General", icon: FiSettings },
  { id: "access", label: "Access Management", icon: FiUsers },
  { id: "roles", label: "Roles & Permissions", icon: FiShield },
  { id: "maintenance", label: "Maintenance Mode", icon: FiTool },
];

const ROLE_META = {
  admin: { label: "Admin", className: "role-admin" },
  seller: { label: "Seller", className: "role-seller" },
  customer: { label: "Customer", className: "role-customer" },
};

const INITIAL_USERS = [
  { id: 1, name: "Anika Rahman", email: "anika@northgate.io", role: "admin", status: "active" },
  { id: 2, name: "Tobias Ferreira", email: "tobias@ferreiragoods.com", role: "seller", status: "active" },
  { id: 3, name: "Priya Nair", email: "priya.nair@gmail.com", role: "customer", status: "active" },
  { id: 4, name: "Marcus Webb", email: "marcus@webbtrade.com", role: "seller", status: "suspended" },
  { id: 5, name: "Lin Chen", email: "lin.chen@outlook.com", role: "customer", status: "active" },
  { id: 6, name: "Fatima Al-Sayed", email: "fatima@sayedstores.com", role: "seller", status: "pending" },
];

const MODULES = ["Orders", "Products", "Payments", "Users", "Reports", "Storefront"];

const DEFAULT_PERMS = {
  admin: { Orders: "full", Products: "full", Payments: "full", Users: "full", Reports: "full", Storefront: "full" },
  seller: { Orders: "edit", Products: "full", Payments: "view", Users: "none", Reports: "view", Storefront: "edit" },
  customer: { Orders: "view", Products: "view", Payments: "none", Users: "none", Reports: "none", Storefront: "view" },
};

const PERM_LEVELS = ["none", "view", "edit", "full"];

// ---------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`toggle ${checked ? "toggle-on" : ""}`}
    >
      <span className="toggle-thumb" />
    </button>
  );
}


function RoleBadge({ role }) {
  const meta = ROLE_META[role];
  return <span className={`role-badge ${meta.className}`}>{meta.label}</span>;
}

function StatusDot({ status }) {
  return (
    <span className={`status-dot status-${status}`}>
      <span className="dot" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="section-header">
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------
// Panels
// ---------------------------------------------------------------------

function GeneralPanel() {
  const [appName, setAppName] = useState("Northgate Marketplace");
  const [supportEmail, setSupportEmail] = useState("support@northgate.io");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const accessToken = localStorage.getItem("access_token");
    try {
      // Replace with your real endpoint
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/settings/general/`,
        { app_name: appName, support_email: supportEmail },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Workspace"
        title="General Settings"
        description="Basic information shown across the admin, seller, and customer sides."
      />
      <div className="form-block">
        <label>Application name</label>
        <input value={appName} onChange={(e) => setAppName(e.target.value)} />

        <label>Support email</label>
        <input value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />

        <button className="primary-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}

function AccessManagementPanel({ users, setUsers }) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);

  const filtered = users.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  const setStatus = async (id, status) => {
    const accessToken = localStorage.getItem("access_token");
    try {
      // Replace with your real endpoint, e.g. /api/admin/users/{id}/status/
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${id}/status/`,
        { status },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    } catch (error) {
      console.error(error);
    }
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    setOpenMenuId(null);
  };

  const setRole = async (id, role) => {
    const accessToken = localStorage.getItem("access_token");
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${id}/role/`,
        { role },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    } catch (error) {
      console.error(error);
    }
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  };

  return (
    <div>
      <SectionHeader
        eyebrow="People"
        title="Access Management"
        description="See everyone with access to your marketplace and control who can sign in."
      />

      <div className="toolbar">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email"
          />
        </div>

        <div className="filter-pills">
          {["all", "admin", "seller", "customer"].map((r) => (
            <button
              key={r}
              className={roleFilter === r ? "pill pill-active" : "pill"}
              onClick={() => setRoleFilter(r)}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <button className="primary-btn">
          <FiPlus className="btn-icon" />
          Invite person
        </button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th className="align-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, index) => {
              const menuOpensUp = index >= filtered.length - 2;

              return (
                <tr key={u.id}>
                  <td>
                    <div className="user-name">{u.name}</div>
                    <div className="user-email">{u.email}</div>
                  </td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => setRole(u.id, e.target.value)}
                      className={`role-select ${ROLE_META[u.role].className}`}
                    >
                      <option value="admin">Admin</option>
                      <option value="seller">Seller</option>
                      <option value="customer">Customer</option>
                    </select>
                  </td>
                  <td>
                    <StatusDot status={u.status} />
                  </td>
                  <td className="actions-cell">
                    <button
                      className="icon-btn"
                      onClick={() => setOpenMenuId(openMenuId === u.id ? null : u.id)}
                    >
                      <FiMoreVertical />
                    </button>
                    {openMenuId === u.id && (
                      <div className={`dropdown-menu ${menuOpensUp ? "dropdown-menu-up" : ""}`}>
                        {u.status !== "active" && (
                          <button onClick={() => setStatus(u.id, "active")}>Reactivate</button>
                        )}
                        {u.status !== "suspended" && (
                          <button className="danger" onClick={() => setStatus(u.id, "suspended")}>
                            Suspend access
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="empty-row">
                  No one matches that search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RolesPanel() {
  const [perms, setPerms] = useState(DEFAULT_PERMS);

  const cycle = (role, module) => {
    if (role === "admin") return; // admin always stays full access
    setPerms((prev) => {
      const current = prev[role][module];
      const next = PERM_LEVELS[(PERM_LEVELS.indexOf(current) + 1) % PERM_LEVELS.length];
      return { ...prev, [role]: { ...prev[role], [module]: next } };
    });
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Permissions"
        title="Roles & Permissions"
        description="Click a cell to cycle its access level: no access → view → edit → full."
      />

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Module</th>
              {Object.keys(ROLE_META).map((role) => (
                <th key={role} className="align-center">
                  <RoleBadge role={role} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODULES.map((module) => (
              <tr key={module}>
                <td className="module-name">{module}</td>
                {Object.keys(ROLE_META).map((role) => {
                  const level = perms[role][module];
                  const isAdmin = role === "admin";
                  return (
                    <td key={role} className="align-center">
                      <button
                        className={`perm-btn perm-${level}`}
                        disabled={isAdmin}
                        onClick={() => cycle(role, module)}
                      >
                        {level === "full" && <FiCheck size={12} />}
                        {level === "none" && <FiX size={12} />}
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="hint-text">Admin permissions are fixed at full access and can't be reduced from here.</p>
    </div>
  );
}

function MaintenancePanel() {
  const [enabled, setEnabled] = useState(false);
  const [notifyUsers, setNotifyUsers] = useState(true);
  const [allowAdminBypass, setAllowAdminBypass] = useState(true);
  const [message, setMessage] = useState(
    "We're upgrading the marketplace. Ordering and seller tools will be back shortly.",
  );
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const toggleMaintenance = async (value) => {
    setEnabled(value);
    const accessToken = localStorage.getItem("access_token");
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/settings/maintenance/`,
        { enabled: value, message, start, end, notify_users: notifyUsers, allow_admin_bypass: allowAdminBypass },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Availability"
        title="Maintenance Mode"
        description="Temporarily take the storefront offline for customers and sellers while you make changes."
      />

      <div className={`maintenance-banner ${enabled ? "on" : ""}`}>
        <div className="maintenance-banner-left">
          <div className="maintenance-icon">
            {enabled ? <FiAlertTriangle /> : <FiCheck />}
          </div>
          <div>
            <div className="maintenance-title">{enabled ? "Maintenance mode is ON" : "Site is live"}</div>
            <div className="maintenance-sub">
              {enabled
                ? "Customers and sellers currently see the maintenance page."
                : "Everyone can access the marketplace normally."}
            </div>
          </div>
        </div>
        <Toggle checked={enabled} onChange={toggleMaintenance} />
      </div>

      <fieldset disabled={!enabled} className={`form-block ${!enabled ? "disabled" : ""}`}>
        <div className="two-col">
          <div>
            <label>
              <FiClock size={12} className="label-icon" />
              Starts
            </label>
            <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <label>
              <FiClock size={12} className="label-icon" />
              Ends
            </label>
            <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>

        <label>Message shown to customers & sellers</label>
        <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />

        <div className="switch-row">
          <div>
            <div className="switch-label">Let admins keep working</div>
            <div className="switch-sub">Admin accounts can still sign in and manage the backend.</div>
          </div>
          <Toggle checked={allowAdminBypass} onChange={setAllowAdminBypass} />
        </div>

        <div className="switch-row">
          <div>
            <div className="switch-label">Email everyone before it starts</div>
            <div className="switch-sub">Sends a heads-up to sellers and customers 30 minutes ahead.</div>
          </div>
          <Toggle checked={notifyUsers} onChange={setNotifyUsers} />
        </div>

        <div className="preview-box">
          <div className="preview-label">Preview</div>
          <div className="preview-card">
            <FiAlertTriangle size={20} color="#d97706" />
            <div className="preview-title">We'll be right back</div>
            <p className="preview-message">{message}</p>
          </div>
        </div>
      </fieldset>
    </div>
  );
}

// ---------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------

const Settings = () => {
  const [active, setActive] = useState("general");
  const [users, setUsers] = useState(INITIAL_USERS);

  const panelMap = {
    general: <GeneralPanel />,
    access: <AccessManagementPanel users={users} setUsers={setUsers} />,
    roles: <RolesPanel />,
    maintenance: <MaintenancePanel />,
  };

  return (
    <div className="settings-container">
      <div className="settings-tabs">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              className={isActive ? "settings-tab active" : "settings-tab"}
              onClick={() => setActive(item.id)}
            >
              <Icon size={15} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="settings-panel">{panelMap[active]}</div>
    </div>
  );
};

export default Settings;

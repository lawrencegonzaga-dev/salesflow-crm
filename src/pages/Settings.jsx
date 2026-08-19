import { useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { useCRM } from "../context/CRMContext";

const themes = [
  {
    value: "Light",
    title: "Light",
    description: "Use a bright interface.",
  },
  {
    value: "Dark",
    title: "Dark",
    description: "Reduce glare in low light.",
  },
  {
    value: "System",
    title: "System",
    description: "Use the default device appearance.",
  },
];

const notificationOptions = [
  {
    name: "enabled",
    title: "In-app notifications",
    description: "Show task reminders in the header.",
  },
  {
    name: "email",
    title: "Email notifications",
    description: "Receive important account updates by email.",
  },
  {
    name: "tasks",
    title: "Task reminders",
    description: "Get reminders for tasks due today or overdue.",
  },
  {
    name: "deals",
    title: "Deal updates",
    description: "Receive notifications when deals change.",
  },
  {
    name: "leads",
    title: "Lead updates",
    description: "Receive notifications about lead activity.",
  },
];

function Settings() {
  const { settings, saveSettings } = useCRM();
  const [profile, setProfile] = useState(settings.profile);
  const [savedMessage, setSavedMessage] = useState("");

  const notifications =
    typeof settings.preferences.notifications === "object"
      ? settings.preferences.notifications
      : {
          enabled: Boolean(settings.preferences.notifications),
          email: true,
          tasks: true,
          deals: true,
          leads: false,
        };

  function handleProfileChange({ target: { name, value } }) {
    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
    setSavedMessage("");
  }

  function handleProfileSubmit(event) {
    event.preventDefault();
    saveSettings({
      ...settings,
      profile,
    });
    setSavedMessage("Profile saved.");
  }

  function updatePreferences(changes) {
    saveSettings({
      ...settings,
      preferences: {
        ...settings.preferences,
        ...changes,
      },
    });
  }

  function handleThemeChange(theme) {
    updatePreferences({ theme });
  }

  function handleNotificationChange({ target: { name, checked } }) {
    updatePreferences({
      notifications: {
        ...notifications,
        [name]: checked,
      },
    });
  }

  return (
    <section className="page settings-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="body-text">
            Manage your profile, appearance, and notification preferences.
          </p>
        </div>
      </header>

      <article className="card settings-section">
        <div className="card-header">
          <div>
            <h2 className="card-title">Appearance</h2>
            <p className="card-subtitle">
              Choose how SalesFlow looks on this device.
            </p>
          </div>
        </div>

        <div className="settings-choices" role="group" aria-label="Theme">
          {themes.map((theme) => {
            const isActive = settings.preferences.theme === theme.value;

            return (
              <button
                type="button"
                className={`settings-choice ${isActive ? "settings-choice--active" : ""}`}
                key={theme.value}
                onClick={() => handleThemeChange(theme.value)}
                aria-pressed={isActive}
              >
                <span className="settings-choice__check" aria-hidden="true">
                  {isActive && <FaCheck />}
                </span>
                <strong>{theme.title}</strong>
                <span>{theme.description}</span>
              </button>
            );
          })}
        </div>

        <label className="form-group settings-default-view" htmlFor="default-view">
          <span className="form-label">Default view</span>
          <select
            id="default-view"
            value={settings.preferences.defaultView}
            onChange={(event) =>
              updatePreferences({ defaultView: event.target.value })
            }
          >
            <option value="Dashboard">Dashboard</option>
            <option value="Contacts">Contacts</option>
            <option value="Leads">Leads</option>
            <option value="Deals">Deals</option>
            <option value="Tasks">Tasks</option>
            <option value="Calendar">Calendar</option>
          </select>
        </label>
      </article>

      <article className="card settings-section">
        <div className="card-header">
          <div>
            <h2 className="card-title">Profile</h2>
            <p className="card-subtitle">
              Update the account details shown across the CRM.
            </p>
          </div>
        </div>

        <form className="settings-form" onSubmit={handleProfileSubmit}>
          <div className="form-row">
            <label className="form-group" htmlFor="profile-name">
              <span className="form-label form-label--required">Name</span>
              <input
                id="profile-name"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                required
              />
            </label>

            <label className="form-group" htmlFor="profile-role">
              <span className="form-label form-label--required">Role</span>
              <input
                id="profile-role"
                name="role"
                value={profile.role}
                onChange={handleProfileChange}
                required
              />
            </label>
          </div>

          <label className="form-group" htmlFor="profile-email">
            <span className="form-label form-label--required">Email</span>
            <input
              id="profile-email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleProfileChange}
              required
            />
          </label>

          <div className="settings-save">
            <button className="button button--primary" type="submit">
              Save profile
            </button>
            <span role="status">{savedMessage}</span>
          </div>
        </form>
      </article>

      <article className="card settings-section">
        <div className="card-header">
          <div>
            <h2 className="card-title">Notifications</h2>
            <p className="card-subtitle">
              Choose which CRM updates you want to receive.
            </p>
          </div>
        </div>

        <div className="settings-notification-list">
          {notificationOptions.map((option) => (
            <label className="settings-notification" key={option.name}>
              <span className="settings-notification__content">
                <strong>{option.title}</strong>
                <small>{option.description}</small>
              </span>
              <span className="settings-switch">
                <input
                  className="settings-switch__input"
                  type="checkbox"
                  name={option.name}
                  checked={Boolean(notifications[option.name])}
                  onChange={handleNotificationChange}
                  aria-label={option.title}
                />
                <span className="settings-switch__track" aria-hidden="true">
                  <span className="settings-switch__thumb" />
                </span>
              </span>
            </label>
          ))}
        </div>
      </article>
    </section>
  );
}

export default Settings;

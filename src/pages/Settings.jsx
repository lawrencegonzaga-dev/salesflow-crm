import { useState } from "react";

function Settings() {
  const [theme, setTheme] = useState("system");

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    tasks: true,
    deals: true,
    leads: false,
  });

  const handleThemeChange = (value) => {
    setTheme(value);

    if (value === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", value);
    }
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleNotificationChange = (event) => {
    const { name, checked } = event.target;

    setNotifications((current) => ({
      ...current,
      [name]: checked,
    }));
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();

    console.log("Profile saved:", profile);
  };

  return (
    <section className="settings-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account and application preferences.</p>
        </div>
      </div>

      {/* Appearance */}
      <div className="card settings-card">
        <div className="card-header">
          <h2>Appearance</h2>
          <p>Customize how SalesFlow looks.</p>
        </div>

        <div className="theme-options">
          <button
            type="button"
            className={
              theme === "light"
                ? "theme-option active"
                : "theme-option"
            }
            onClick={() => handleThemeChange("light")}
          >
            <span className="theme-icon">☀️</span>

            <div>
              <strong>Light</strong>
              <p>Use the light theme.</p>
            </div>
          </button>

          <button
            type="button"
            className={
              theme === "dark"
                ? "theme-option active"
                : "theme-option"
            }
            onClick={() => handleThemeChange("dark")}
          >
            <span className="theme-icon">🌙</span>

            <div>
              <strong>Dark</strong>
              <p>Use the dark theme.</p>
            </div>
          </button>

          <button
            type="button"
            className={
              theme === "system"
                ? "theme-option active"
                : "theme-option"
            }
            onClick={() => handleThemeChange("system")}
          >
            <span className="theme-icon">💻</span>

            <div>
              <strong>System</strong>
              <p>Follow your device preference.</p>
            </div>
          </button>
        </div>
      </div>

      {/* Profile */}
      <div className="card settings-card">
        <div className="card-header">
          <h2>Profile</h2>
          <p>Update your personal information.</p>
        </div>

        <form onSubmit={handleProfileSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                value={profile.firstName}
                onChange={handleProfileChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                value={profile.lastName}
                onChange={handleProfileChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleProfileChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={profile.phone}
              onChange={handleProfileChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Company</label>

            <input
              id="company"
              name="company"
              type="text"
              value={profile.company}
              onChange={handleProfileChange}
            />
          </div>

          <button type="submit" className="button button-primary">
            Save Changes
          </button>
        </form>
      </div>

      {/* Notifications */}
      <div className="card settings-card">
        <div className="card-header">
          <h2>Notifications</h2>
          <p>Choose which notifications you want to receive.</p>
        </div>

        <div className="settings-options">
          <label className="settings-option">
            <div>
              <strong>Email Notifications</strong>

              <p>
                Receive important updates by email.
              </p>
            </div>

            <input
              type="checkbox"
              name="email"
              checked={notifications.email}
              onChange={handleNotificationChange}
            />
          </label>

          <label className="settings-option">
            <div>
              <strong>Task Reminders</strong>

              <p>
                Get reminders about upcoming tasks.
              </p>
            </div>

            <input
              type="checkbox"
              name="tasks"
              checked={notifications.tasks}
              onChange={handleNotificationChange}
            />
          </label>

          <label className="settings-option">
            <div>
              <strong>Deal Updates</strong>

              <p>
                Receive notifications when deals change.
              </p>
            </div>

            <input
              type="checkbox"
              name="deals"
              checked={notifications.deals}
              onChange={handleNotificationChange}
            />
          </label>

          <label className="settings-option">
            <div>
              <strong>Lead Updates</strong>

              <p>
                Receive notifications about lead activity.
              </p>
            </div>

            <input
              type="checkbox"
              name="leads"
              checked={notifications.leads}
              onChange={handleNotificationChange}
            />
          </label>
        </div>
      </div>
    </section>
  );
}

export default Settings;
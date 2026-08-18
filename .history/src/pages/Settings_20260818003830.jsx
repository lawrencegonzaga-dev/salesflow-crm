
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
    <>
      <style>{`
        .settings-page {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          padding-bottom: 48px;
        }

        .settings-header {
          margin-bottom: 28px;
        }

        .settings-eyebrow {
          display: inline-block;
          margin-bottom: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--color-primary);
        }

        .settings-header h1 {
          margin: 0;
          font-size: 30px;
          line-height: 1.2;
          font-weight: 700;
          color: var(--color-text);
        }

        .settings-header p {
          margin: 8px 0 0;
          font-size: 14px;
          line-height: 1.6;
          color: var(--color-text-muted);
        }

        .settings-card {
          margin-bottom: 20px;
          padding: 28px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        }

        .settings-card-header {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 24px;
        }

        .settings-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          font-size: 17px;
        }

        .appearance-icon {
          background: rgba(99, 102, 241, 0.1);
        }

        .profile-icon {
          background: rgba(16, 185, 129, 0.1);
        }

        .notification-icon {
          background: rgba(245, 158, 11, 0.1);
        }

        .settings-card-header h2 {
          margin: 0;
          font-size: 17px;
          font-weight: 650;
          color: var(--color-text);
        }

        .settings-card-header p {
          margin: 5px 0 0;
          font-size: 13px;
          line-height: 1.5;
          color: var(--color-text-muted);
        }

        .theme-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .theme-option {
          min-height: 145px;
          padding: 18px;
          text-align: left;
          background: var(--color-background);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .theme-option:hover {
          transform: translateY(-2px);
          border-color: var(--color-primary);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
        }

        .theme-option.active {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 1px var(--color-primary);
        }

        .theme-option-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .theme-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          font-size: 18px;
        }

        .theme-check {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--color-primary);
          color: white;
          font-size: 12px;
          font-weight: 700;
        }

        .theme-option-content strong {
          display: block;
          margin-bottom: 5px;
          font-size: 14px;
          font-weight: 650;
          color: var(--color-text);
        }

        .theme-option-content p {
          margin: 0;
          font-size: 12px;
          line-height: 1.5;
          color: var(--color-text-muted);
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text);
        }

        .form-group input {
          width: 100%;
          height: 44px;
          padding: 0 13px;
          box-sizing: border-box;
          background: var(--color-background);
          border: 1px solid var(--color-border);
          border-radius: 9px;
          outline: none;
          font: inherit;
          font-size: 13px;
          color: var(--color-text);
          transition: all 0.2s ease;
        }

        .form-group input::placeholder {
          color: var(--color-text-muted);
          opacity: 0.65;
        }

        .form-group input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          padding-top: 4px;
        }

        .notification-list {
          display: flex;
          flex-direction: column;
        }

        .notification-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 18px 0;
          cursor: pointer;
        }

        .notification-option + .notification-option {
          border-top: 1px solid var(--color-border);
        }

        .notification-info strong {
          display: block;
          margin-bottom: 4px;
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text);
        }

        .notification-info p {
          margin: 0;
          font-size: 12px;
          line-height: 1.5;
          color: var(--color-text-muted);
        }

        .switch {
          position: relative;
          flex-shrink: 0;
          width: 44px;
          height: 24px;
        }

        .switch input {
          position: absolute;
          width: 0;
          height: 0;
          opacity: 0;
        }

        .switch-slider {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: var(--color-border);
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .switch-slider::before {
          content: "";
          position: absolute;
          width: 18px;
          height: 18px;
          left: 3px;
          top: 3px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease;
        }

        .switch input:checked + .switch-slider {
          background: var(--color-primary);
        }

        .switch input:checked + .switch-slider::before {
          transform: translateX(20px);
        }

        @media (max-width: 768px) {
          .settings-card {
            padding: 22px;
          }

          .theme-options {
            grid-template-columns: 1fr;
          }

          .theme-option {
            min-height: auto;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .settings-header h1 {
            font-size: 26px;
          }
        }

        @media (max-width: 480px) {
          .settings-card {
            padding: 18px;
            border-radius: 12px;
          }

          .notification-option {
            align-items: flex-start;
          }

          .form-actions {
            justify-content: stretch;
          }

          .form-actions .button {
            width: 100%;
          }
        }
      `}</style>

      <section className="settings-page">

        <div className="settings-header">
          <span className="settings-eyebrow">
            ACCOUNT
          </span>

          <h1>Settings</h1>

          <p>
            Manage your account, appearance, and notification preferences.
          </p>
        </div>

        {/* Appearance */}
        <div className="settings-card">

          <div className="settings-card-header">
            <div className="settings-card-icon appearance-icon">
              ✦
            </div>

            <div>
              <h2>Appearance</h2>

              <p>
                Customize how SalesFlow looks on your device.
              </p>
            </div>
          </div>

          <div className="theme-options">

            <button
              type="button"
              className={`theme-option ${
                theme === "light" ? "active" : ""
              }`}
              onClick={() => handleThemeChange("light")}
            >
              <div className="theme-option-top">
                <span className="theme-icon">☀️</span>

                {theme === "light" && (
                  <span className="theme-check">✓</span>
                )}
              </div>

              <div className="theme-option-content">
                <strong>Light</strong>
                <p>Clean and bright appearance.</p>
              </div>
            </button>

            <button
              type="button"
              className={`theme-option ${
                theme === "dark" ? "active" : ""
              }`}
              onClick={() => handleThemeChange("dark")}
            >
              <div className="theme-option-top">
                <span className="theme-icon">🌙</span>

                {theme === "dark" && (
                  <span className="theme-check">✓</span>
                )}
              </div>

              <div className="theme-option-content">
                <strong>Dark</strong>
                <p>Easy on the eyes in low light.</p>
              </div>
            </button>

            <button
              type="button"
              className={`theme-option ${
                theme === "system" ? "active" : ""
              }`}
              onClick={() => handleThemeChange("system")}
            >
              <div className="theme-option-top">
                <span className="theme-icon">💻</span>

                {theme === "system" && (
                  <span className="theme-check">✓</span>
                )}
              </div>

              <div className="theme-option-content">
                <strong>System</strong>
                <p>Follow your device preference.</p>
              </div>
            </button>

          </div>
        </div>

        {/* Profile */}
        <div className="settings-card">

          <div className="settings-card-header">
            <div className="settings-card-icon profile-icon">
              👤
            </div>

            <div>
              <h2>Profile</h2>

              <p>
                Update your personal information.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleProfileSubmit}
            className="settings-form"
          >

            <div className="form-grid">

              <div className="form-group">
                <label htmlFor="firstName">
                  First Name
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={profile.firstName}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">
                  Last Name
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                />
              </div>

            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={profile.email}
                onChange={handleProfileChange}
              />
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label htmlFor="phone">
                  Phone
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+63 900 000 0000"
                  value={profile.phone}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">
                  Company
                </label>

                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Company name"
                  value={profile.company}
                  onChange={handleProfileChange}
                />
              </div>

            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="button button-primary"
              >
                Save Changes
              </button>
            </div>

          </form>
        </div>

        {/* Notifications */}
        <div className="settings-card">

          <div className="settings-card-header">
            <div className="settings-card-icon notification-icon">
              🔔
            </div>

            <div>
              <h2>Notifications</h2>

              <p>
                Choose which notifications you want to receive.
              </p>
            </div>
          </div>

          <div className="notification-list">

            {[
              {
                name: "email",
                title: "Email Notifications",
                description: "Receive important updates by email.",
              },
              {
                name: "tasks",
                title: "Task Reminders",
                description: "Get reminders about upcoming tasks.",
              },
              {
                name: "deals",
                title: "Deal Updates",
                description: "Receive notifications when deals change.",
              },
              {
                name: "leads",
                title: "Lead Updates",
                description: "Receive notifications about lead activity.",
              },
            ].map((notification) => (
              <label
                key={notification.name}
                className="notification-option"
              >
                <div className="notification-info">
                  <strong>{notification.title}</strong>

                  <p>{notification.description}</p>
                </div>

                <div className="switch">
                  <input
                    type="checkbox"
                    name={notification.name}
                    checked={notifications[notification.name]}
                    onChange={handleNotificationChange}
                  />

                  <span className="switch-slider"></span>
                </div>
              </label>
            ))}

          </div>
        </div>

      </section>
    </>
  );
}

export default Settings;


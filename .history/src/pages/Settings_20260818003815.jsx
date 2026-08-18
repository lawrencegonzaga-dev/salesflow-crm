import { useState } from "react";
import { useCRM } from "../context/CRMContext";

function Settings() {
  const { settings, saveSettings } = useCRM();
  const [profile, setProfile] = useState(settings.profile);
  const [preferences, setPreferences] = useState(settings.preferences);
  const [saved, setSaved] = useState(false);

  const handleThemeChange = (value) => {
    setPreferences((current) => ({ ...current, theme: value }));

    if (value === "System") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", value.toLowerCase());
    }
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const handleNotificationChange = (event) => {
    const { checked } = event.target;
    setPreferences((current) => ({ ...current, notifications: checked }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    saveSettings({ profile, preferences });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const themes = [
    { value: "Light", icon: "☀️", label: "Light", description: "Clean and bright appearance." },
    { value: "Dark", icon: "🌙", label: "Dark", description: "Easy on the eyes in low light." },
    { value: "System", icon: "💻", label: "System", description: "Follow your device preference." }
  ];

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="body-text">Manage your account, appearance, and notification preferences.</p>
        </div>
      </header>

      <section className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Appearance</h2>
            <p className="card-subtitle">Customize how SalesFlow looks on your device.</p>
          </div>
        </div>
        <div className="theme-options">
          {themes.map((theme) => (
            <button
              key={theme.value}
              type="button"
              className={`theme-option ${preferences.theme === theme.value ? "theme-option--active" : ""}`}
              onClick={() => handleThemeChange(theme.value)}
            >
              <span className="theme-option__icon">{theme.icon}</span>
              <div>
                <strong>{theme.label}</strong>
                <p>{theme.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Profile</h2>
            <p className="card-subtitle">Update your personal information.</p>
          </div>
        </div>
        <form className="settings-form" onSubmit={handleSave}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="settings-name">Name</label>
              <input id="settings-name" name="name" value={profile.name} onChange={handleProfileChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="settings-role">Role</label>
              <input id="settings-role" name="role" value={profile.role} onChange={handleProfileChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="settings-email">Email</label>
            <input id="settings-email" name="email" type="email" value={profile.email} onChange={handleProfileChange} />
          </div>

          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={handleNotificationChange}
            />
            Email notifications
          </label>

          <div className="settings-save">
            <button type="submit" className="button button--primary">Save Changes</button>
            {saved && <span>Saved ✓</span>}
          </div>
        </form>
      </section>
    </section>
  );
}

export default Settings;
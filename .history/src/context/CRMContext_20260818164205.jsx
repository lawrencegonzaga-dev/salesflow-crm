/* ========================================================= */
/* FILE: src/context/CRMContext.jsx */
/* ========================================================= */

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

const CRMContext = createContext(null);

const STORAGE_KEY = "salesflow-crm-data";

/*
 * =========================================================
 * INITIAL DATA
 * =========================================================
 */

const initialData = {
    contacts: [
        {
            id: "contact-1",
            name: "John Smith",
            company: "Acme Corp",
            email: "john@example.com",
            phone: "09171234567",
            status: "Customer",
        },
        {
            id: "contact-2",
            name: "Sarah Jane",
            company: "Tech Advise",
            email: "sarah@example.com",
            phone: "",
            status: "Prospect",
        },
    ],

    leads: [
        {
            id: "lead-1",
            name: "Mia Santos",
            company: "Northstar Studio",
            email: "mia@northstar.co",
            phone: "09171234567",
            stage: "Qualified",
            source: "Website",
            value: 12500,
        },
        {
            id: "lead-2",
            name: "Ben Cruz",
            company: "Cruz & Co.",
            email: "ben@cruz.co",
            phone: "09179876543",
            stage: "New",
            source: "Referral",
            value: 4800,
        },
    ],

    deals: [
        {
            id: "deal-1",
            name: "Acme renewal",
            company: "Acme Corp",
            value: 24000,
            stage: "Proposal",
            closeDate: "2026-09-15",
        },
        {
            id: "deal-2",
            name: "Northstar onboarding",
            company: "Northstar Studio",
            value: 8500,
            stage: "Qualified",
            closeDate: "2026-09-04",
        },
        {
            id: "deal-3",
            name: "Cruz website package",
            company: "Cruz & Co.",
            value: 4200,
            stage: "New",
            closeDate: "2026-09-28",
        },
        {
            id: "deal-4",
            name: "Harbor analytics",
            company: "Harbor Labs",
            value: 18000,
            stage: "Negotiation",
            closeDate: "2026-09-20",
        },
        {
            id: "deal-5",
            name: "Summit retainer",
            company: "Summit Group",
            value: 9600,
            stage: "Won",
            closeDate: "2026-08-08",
        },
        {
            id: "deal-6",
            name: "Orchid migration",
            company: "Orchid Systems",
            value: 6400,
            stage: "Lost",
            closeDate: "2026-08-01",
        },
    ],

    tasks: [
        {
            id: "task-1",
            title: "Send Acme proposal",
            description: "Email the revised renewal proposal.",
            assignedTo: "Lawrence",
            priority: "High",
            status: "In Progress",
            dueDate: "2026-08-20",
        },
        {
            id: "task-2",
            title: "Qualify Northstar lead",
            description: "Confirm budget and decision timeline.",
            assignedTo: "Mia Santos",
            priority: "Medium",
            status: "Todo",
            dueDate: "2026-08-16",
        },
        {
            id: "task-3",
            title: "Call John Smith",
            description: "Follow up about the proposal.",
            assignedTo: "Lawrence",
            priority: "High",
            status: "Todo",
            dueDate: "2026-08-15",
        },
        {
            id: "task-4",
            title: "Log referral details",
            description: "Record the Cruz & Co. referral source.",
            assignedTo: "Ben Cruz",
            priority: "Low",
            status: "Completed",
            dueDate: "2026-08-12",
        },
    ],

    events: [
        {
            id: "event-1",
            title: "Sales team standup",
            date: "2026-08-18",
            type: "Event",
        },
    ],

    settings: {
        profile: {
            name: "Lawrence",
            email: "lawrence@salesflow.com",
            role: "Sales Manager",
        },

        preferences: {
            theme: "System",
            notifications: true,
            defaultView: "Dashboard",
        },
    },
};

/*
 * =========================================================
 * CLONE DEMO DATA
 * =========================================================
 */

function cloneDemoData() {
    return JSON.parse(JSON.stringify(initialData));
}

/*
 * =========================================================
 * LOAD LOCAL STORAGE
 * =========================================================
 */

function loadStoredData() {
    const demoData = cloneDemoData();

    if (typeof window === "undefined") {
        return demoData;
    }

    try {
        const storedValue =
            window.localStorage.getItem(STORAGE_KEY);

        const savedData = storedValue
            ? JSON.parse(storedValue)
            : null;

        if (
            !savedData ||
            typeof savedData !== "object"
        ) {
            return demoData;
        }

        return {
            ...demoData,

            contacts: Array.isArray(savedData.contacts)
                ? savedData.contacts
                : demoData.contacts,

            leads: Array.isArray(savedData.leads)
                ? savedData.leads
                : demoData.leads,

            deals: Array.isArray(savedData.deals)
                ? savedData.deals
                : demoData.deals,

            tasks: Array.isArray(savedData.tasks)
                ? savedData.tasks
                : demoData.tasks,

            events: Array.isArray(savedData.events)
                ? savedData.events
                : demoData.events,

            settings:
                savedData.settings &&
                typeof savedData.settings === "object"
                    ? {
                          profile: {
                              ...demoData.settings.profile,
                              ...savedData.settings
                                  .profile,
                          },

                          preferences: {
                              ...demoData.settings
                                  .preferences,
                              ...savedData.settings
                                  .preferences,
                          },
                      }
                    : demoData.settings,
        };
    } catch {
        window.localStorage.removeItem(STORAGE_KEY);

        return demoData;
    }
}

/*
 * =========================================================
 * GENERATE ID
 * =========================================================
 */

function makeId(type) {
    return `${type}-${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`;
}

/*
 * =========================================================
 * CRM PROVIDER
 * =========================================================
 */

export function CRMProvider({ children }) {
    const [data, setData] = useState(loadStoredData);

    /*
     * =====================================================
     * SAVE DATA TO LOCAL STORAGE
     * =====================================================
     */

    useEffect(() => {
        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(data)
            );
        } catch {
            /*
             * The CRM continues to work even when
             * localStorage is unavailable.
             */
        }
    }, [data]);

    /*
     * =====================================================
     * CONTEXT VALUE
     * =====================================================
     */

    const value = useMemo(
        () => ({
            ...data,

            /*
             * =================================================
             * SAVE RECORD
             * =================================================
             *
             * If the record already has an ID:
             *
             *     UPDATE existing record
             *
             * If the record does not have an ID:
             *
             *     CREATE new record
             *
             * Every saved record also receives updatedAt.
             */

            saveRecord(type, record) {
                setData((currentData) => {
                    const hasId = Boolean(record.id);

                    const now =
                        new Date().toISOString();

                    /*
                     * Existing record
                     */

                    if (hasId) {
                        const updatedRecord = {
                            ...record,
                            updatedAt: now,
                        };

                        return {
                            ...currentData,

                            [type]: currentData[type].map(
                                (item) =>
                                    item.id === record.id
                                        ? updatedRecord
                                        : item
                            ),
                        };
                    }

                    /*
                     * New record
                     */

                    const newRecord = {
                        ...record,
                        id: makeId(type),
                        updatedAt: now,
                    };

                    return {
                        ...currentData,

                        [type]: [
                            ...currentData[type],
                            newRecord,
                        ],
                    };
                });
            },

            /*
             * =================================================
             * DELETE RECORD
             * =================================================
             */

            deleteRecord(type, id) {
                setData((currentData) => ({
                    ...currentData,

                    [type]: currentData[type].filter(
                        (item) => item.id !== id
                    ),
                }));
            },

            /*
             * =================================================
             * SAVE SETTINGS
             * =================================================
             */

            saveSettings(settings) {
                setData((currentData) => ({
                    ...currentData,
                    settings,
                }));
            },

            /*
             * =================================================
             * RESET DEMO DATA
             * =================================================
             */

            resetDemoData() {
                setData(cloneDemoData());
            },
        }),
        [data]
    );

    return (
        <CRMContext.Provider value={value}>
            {children}
        </CRMContext.Provider>
    );
}

/*
 * =========================================================
 * USE CRM HOOK
 * =========================================================
 */

// This hook intentionally shares the provider module's
// context value.
// eslint-disable-next-line react-refresh/only-export-components

export function useCRM() {
    const context = useContext(CRMContext);

    if (!context) {
        throw new Error(
            "useCRM must be used inside CRMProvider"
        );
    }

    return context;
}
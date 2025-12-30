"use client";
import { configureStore } from "@reduxjs/toolkit";
import accountsReducer from "./slices/accountsSlice";
import authReducer from "./slices/authSlice";
import backupsReducer from "./slices/backupSlice";
import paymentsReducer from './slices/paymentsSlice';
import logsReducer from "./slices/logsSlice";
import systemMonitoringReducer from "./slices/systemMonitoringSlice";
import universitiesReducer from "./slices/universitiesSlice";
import techUpdatesReducer from "./slices/techUpdatesSlice";
import technicalFaultsReducer from "./slices/technicalFaultsSlice";
import coursesReducer from "./slices/coursesSlice";
import supportReducer from "./slices/supportSlice";
import reportsReducer from "./slices/reportsSlice";
import auditReducer from "./slices/auditSlice";
import casesReducer from "./slices/casesSlice";
import appointmentsReducer from "./slices/appointmentsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import evaluationsReducer from "./slices/evaluationsSlice";
import communityReducer from "./slices/communitySlice";
import attachmentsReducer from "./slices/attachmentsSlice";
import aiReducer from "./slices/aiSlice";
import messagingReducer from "./slices/messagingSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        accounts: accountsReducer,
        backups: backupsReducer,
        payments: paymentsReducer,
        logs: logsReducer,
        SystemMonitoring: systemMonitoringReducer,
        universities: universitiesReducer,
        techUpdates: techUpdatesReducer,
        technicalFaults: technicalFaultsReducer,
        courses: coursesReducer,
        support: supportReducer,
        reports: reportsReducer,
        audit: auditReducer,
        cases: casesReducer,
        appointments: appointmentsReducer,
        notifications: notificationsReducer,
        evaluations: evaluationsReducer,
        community: communityReducer,
        attachments: attachmentsReducer,
        ai: aiReducer,
        messaging: messagingReducer,
    },
});

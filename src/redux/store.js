"use client";
import { configureStore } from "@reduxjs/toolkit";
import accountsReducer from "./slices/accountsSlice";
import backupsReducer from "./slices/backupSlice";
import paymentsReducer from './slices/paymentsSlice';
import logsReducer from "./slices/logsSlice";
import systemMonitoringReducer from "./slices/systemMonitoringSlice";
import universitiesReducer from "./slices/universitiesSlice";
import techUpdatesReducer from "./slices/techUpdatesSlice";
import technicalFaultsReducer from "./slices/technicalFaultsSlice";
import coursesReducer from "./slices/coursesSlice";

export const store = configureStore({
    reducer: {
        accounts: accountsReducer,
        backups: backupsReducer,
        payments: paymentsReducer,
        logs: logsReducer,
        SystemMonitoring: systemMonitoringReducer,
        universities: universitiesReducer,
        techUpdates: techUpdatesReducer,
        technicalFaults: technicalFaultsReducer,
        courses: coursesReducer,
    },
});

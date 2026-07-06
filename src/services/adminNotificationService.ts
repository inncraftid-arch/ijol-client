import { clientEnv } from '../config/env';
import { invokeSupabaseFunction } from './clientSupabase';

type AdminNotificationEvent = 'item_uploaded' | 'swap_requested' | 'swap_approved';

export const notifyAdmin = async (
  eventType: AdminNotificationEvent
) => {
  if (!clientEnv.adminEmailNotificationsEnabled) {
    return;
  }

  try {
    await invokeSupabaseFunction<{ ok: boolean }>(clientEnv.adminNotificationFunction, {
      eventType,
    });
  } catch (error) {
    console.warn('Admin email notification failed', error);
  }
};

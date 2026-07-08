export const GOOGLE_ADS_ID = 'AW-18225375992';

export const GOOGLE_ADS_PURCHASE_CONVERSION =
  'AW-18225375992/mKMICO6L2LscEPjVxPJD';

export const GOOGLE_ADS_APPOINTMENT_CONVERSION =
  'AW-18225375992/m9nECIyl17scEPjVxPJD';

type GtagFn = (...args: unknown[]) => void;

function gtag(...args: unknown[]) {
  if (typeof window === 'undefined') return;
  const fn = (window as Window & { gtag?: GtagFn }).gtag;
  if (typeof fn === 'function') {
    fn(...args);
  }
}

export function trackGoogleAdsOrderConversions(options: {
  transactionId: string;
  isScheduled: boolean;
}) {
  const { transactionId, isScheduled } = options;

  gtag('event', 'conversion', {
    send_to: GOOGLE_ADS_PURCHASE_CONVERSION,
    transaction_id: transactionId
  });

  if (isScheduled) {
    gtag('event', 'conversion', {
      send_to: GOOGLE_ADS_APPOINTMENT_CONVERSION,
      transaction_id: transactionId
    });
  }
}

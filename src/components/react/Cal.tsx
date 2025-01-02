import { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';

export default function Cal() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: 'consultation' });
      cal('floatingButton', {
        calLink: 'ody-spatial/consultation',
        config: { layout: 'month_view' },
        buttonText: 'Book Me Now',
      });
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' });
    })();
  }, []);
}

export type SubscriptionHandler<Event> = (event: Event) => void;

type Subscription<Event> = {
  handler: SubscriptionHandler<Event>;
};

export function createSubscriptionRegistry<Event>() {
  const subscriptions: Subscription<Event>[] = [];

  return {
    subscribe(handler: SubscriptionHandler<Event>) {
      const subscription = { handler };
      subscriptions.push(subscription);
      let subscribed = true;
      return () => {
        if (!subscribed) return;
        subscribed = false;
        const index = subscriptions.indexOf(subscription);
        if (index >= 0) subscriptions.splice(index, 1);
      };
    },
    dispatch(event: Event) {
      // The dispatch snapshot fixes listener order for this event.
      // New subscriptions wait for the next event; removed subscriptions finish this event.
      subscriptions.slice().forEach(({ handler }) => {
        handler(event);
      });
    },
  };
}

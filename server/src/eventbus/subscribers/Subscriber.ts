abstract class Subscriber {
  protected off: (() => void) | undefined;

  abstract subscribe(): void;
  abstract unsubscribe(): void;
}

export default Subscriber;

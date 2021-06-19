import Async from "crocks/Async";

export const ensureAsync = <T>(promise: Promise<T>): Async<Error, T> => Async<T>((reject, resolve) => promise.then(resolve, reject));

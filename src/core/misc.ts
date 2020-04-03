export type Loadable<T> = {
    loading: true,
} | ({
    loading?: false,
} & T);

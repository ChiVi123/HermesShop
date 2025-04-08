import type { Express, RequestHandler } from 'express';

type Method = keyof Express;
type Path = string;

export type MapperExpressMethods = Map<Method, Map<Path, RequestHandler[]>>;

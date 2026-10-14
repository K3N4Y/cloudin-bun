import * as landingService from './landing.service'
import { Hono } from "hono";

export const landingRoutes = new Hono()
    .get("*", landingService.serveLanding);

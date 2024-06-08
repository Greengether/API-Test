import { IEvent } from "../models/event";

declare module "express-serve-static-core" {
    interface Response {
        event?: IEvent;
    }
}

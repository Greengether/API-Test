import express, { Response } from "express";
import type { IEvent } from "../models/event";
import Event from "../models/event";
const router = express.Router();

type MiddlewareResponse = Response & { event?: IEvent };

interface EventUpdate {
    title?: any;
    description?: any;
    date?: any;
}

// Middleware function to get event by id on every request to /:id path
router.use("/:id", async (req, res: MiddlewareResponse, next) => {
    const { id } = req.params;
    try {
        const event = await Event.findById(id);
        if (event == null)
            return res.status(404).json({ message: "Event can't be found." });
        res.event = event;
        next();
    } catch (error: any) {
        return res.status(500).json({ message: error?.message });
    }
});

/* HTTP endpoints relative to /event path */
// Get all
router.get("/", async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error: any) {
        res.status(500).json({ message: error?.message });
    }
});

// Get one
router.get("/:id", (req, res: MiddlewareResponse) => {
    res.send(res.event);
});

// Create one
router.post("/", async (req, res) => {
    const { title, description, date } = req.body;
    const event = new Event({ title, description, date });

    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (error: any) {
        res.status(400).json({ message: error?.message });
    }
});

// Update one
router.patch("/:id", async (req, res: MiddlewareResponse) => {
    const { id } = req.params;
    const { title, description, date } = req.body;
    try {
        let update: EventUpdate = {}

         if (title != null) update.title = title;
         if (description != null) update.description = description;
         if (date != null) update.date = date;
        
        const updatedEvent = await Event.findByIdAndUpdate(id, update, {
            new: true, // Return the updated document
            runValidators: true, // Run schema validators on the update
        });

        res.json(updatedEvent)
    } catch (error: any) {
        res.status(500).json({ message: error?.message });
    }
});

// Delete one
router.delete("/:id", async (req, res: MiddlewareResponse) => {
    const {id} = req.params
    try {
        await Event.findByIdAndDelete(id);
        res.json({ message: "Event deleted sucessfully." });
    } catch (error: any) {
        res.status(500).json({ message: error?.message });
    }
});

export default router;
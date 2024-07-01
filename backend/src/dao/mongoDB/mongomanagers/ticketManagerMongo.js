import { ticketsModel } from "../models/tickets.models.js";


export async function createTickete(ticket) {
    return await ticketsModel.create(ticket)
}

export async function getLastOneTicket(email) {
    return await ticketsModel
        .find({ purchaser: email })
        .sort({ purchase_datetime: -1 });
}

export async function getTicketById(id) {
    return await ticketsModel.findOne({ _id: id })
}

export async function deleteTicketById(id) {
    return await ticketsModel.findByIdAndDelete(id)
}
'use server';

import { sql } from "@vercel/postgres";
import { stat } from "fs";
import { revalidatePath } from "next/cache";
import { redirect, usePathname } from "next/navigation";
import { z } from "zod";

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});


const CreateInvoiceSchema = FormSchema.omit({ id: true, date: true });

export const createInvoice = async (formData: FormData) => {

    const { customerId, amount, status } = CreateInvoiceSchema.parse(
        Object.fromEntries(formData)
    );

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export const updateInvoice = async (invoiceId: string, formData: FormData) => {

    const { customerId, amount, status } = CreateInvoiceSchema.parse(Object.fromEntries(formData));
    const amountInCents = amount * 100;

    await sql`
        UPDATE invoices
        SET customer_id=${customerId}, amount=${amountInCents}, status=${status}
        WHERE id = ${invoiceId}
    `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export const deleteInvoice = async (invoiceId: string) => {

    await sql`DELETE FROM invoices WHERE id = ${invoiceId}`;

    revalidatePath('/dashboard/invoices');
}
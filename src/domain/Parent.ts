import z from 'zod'
import { AddressSchema, Serializable } from './types.js'
import { randomUUID } from 'node:crypto'

export const ParentCreationSchema = z.object({
    id: z.uuid().optional(),
    firstName: z.string(),
    surname: z.string(),
    phones: z.array(z.string()).nonempty(),
    emails: z.array(z.email()).nonempty(),
    address: z.array(AddressSchema).nonempty(),
    document: z.array(z.string()),
})

export type ParentCreationType = z.infer<typeof ParentCreationSchema>

export const ParentUpdateSchema = ParentCreationSchema.partial().omit({id: true});
    
export type ParentUpdateType = z.infer<typeof ParentUpdateSchema>;

export class Parent implements Serializable {
    firstName: ParentCreationType['firstName'];
    surname: ParentCreationType['surname'];
    phones: ParentCreationType['phones'];
    emails: ParentCreationType['emails'];
    address: ParentCreationType['address'];
    document: ParentCreationType['document'];
    readonly id: string;

    constructor(data: ParentCreationType) {
        this.firstName = data.firstName;
        this.surname = data.surname;
        this.phones = data.phones;
        this.emails = data.emails;
        this.address = data.address;
        this.document = data.document;
        this.id = data.id ?? randomUUID();
    }
    static fromObject(data: ParentCreationType) {
        const parsedData = ParentCreationSchema.parse(data);
        return new Parent(parsedData);
    }

    toObject(){
        return {
            id:this.id,
            firstName:this.firstName,
            surname:this.surname,
            phones:this.phones,
            emails:this.emails,
            address:this.address,
            document:this.document
        }
    }

    toJSON(){
        return JSON.stringify(this.toObject())
    }
}
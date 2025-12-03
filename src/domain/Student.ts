import z from 'zod'
import { id } from 'zod/locales'
import { Serializable } from './types.js'
import { randomUUID } from 'crypto'

export const StudentCreationSchema = z.object({
    id: z.uuid(),
    firstName: z.string().min(2).max(100),
    surname: z.string().min(2).max(100),
    document: z.string(),
    bloodType: z.string(),
    birthDate: z.string().refine((date: string) => !isNaN(new Date(date).getTime())),
    allergies: z.string().array().optional(),
    medications: z.string().array().optional(),
    startDate: z.string().refine((date: string) => !isNaN(new Date(date).getTime())),
    parents: z.uuid().array().nonempty(),
    class: z.uuid(),
})

export type StudentCreationType = z.infer<typeof StudentCreationSchema>;
export const StudentUpdateSchema = StudentCreationSchema.partial().omit({id: true, parents: true});

export type StudentUpdateType = z.infer<typeof StudentUpdateSchema>;


export class Student implements Serializable {
    firstName: StudentCreationType['firstName'];
    surname: StudentCreationType['surname'];
    document: StudentCreationType['document'];
    bloodType: StudentCreationType['bloodType'];
    birthDate: Date;
    allergies?: StudentCreationType['allergies'];
    medications?: StudentCreationType['medications'];
    startDate: Date;
    #parents: StudentCreationType['parents'];
    class: StudentCreationType['class'];
    readonly id: string;

    constructor(data: StudentCreationType) {
        const parsedData = StudentCreationSchema.parse(data);
        this.firstName = parsedData.firstName;
        this.surname = parsedData.surname;
        this.document = parsedData.document;
        this.bloodType = parsedData.bloodType;
        this.birthDate = new Date(parsedData.birthDate);
        this.allergies = parsedData.allergies;
        this.medications = parsedData.medications;
        this.startDate = new Date(parsedData.startDate);
        this.#parents = parsedData.parents;
        this.class = parsedData.class;
        this.id = parsedData.id ?? randomUUID()        
    }

    get parents(): StudentCreationType['parents'] {
        return this.#parents;
    }

    set parents(parentsIds) {
        this.#parents = parentsIds;
    }

    static fromObject (obj: Record<string, unknown>): Student {
        const parsedData = StudentCreationSchema.parse(obj);
        return new Student (parsedData);
    }
    
    toJSON (): string {
        return JSON.stringify(this.toObject())
    }
    toObject () {
        return {
            firstName: this.firstName,
            surname: this.surname,
            document: this.document,
            bloodType: this.bloodType,
            birthDate: this.birthDate.toISOString(),
            allergies: this.allergies,
            medications: this.medications,
            startDate: this.startDate.toISOString(),
            parents: this.parents,
            class: this.class,
            id: this.id
        };
    }
}
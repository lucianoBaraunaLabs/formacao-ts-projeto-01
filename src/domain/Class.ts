import z from 'zod'
import { Serializable } from './types.js'
import { randomUUID } from 'crypto'

export const ClassCreationSchema = z.object({
  id: z.uuid().optional(),
  teacher: z.uuid().nullable(),
  code: z.regex(/^[0-9]{1}[A-H]{1}-[MTN]$/),
});

export type ClassCreationType = z.infer<typeof ClassCreationSchema>;

export const ClassUpdateSchema = ClassCreationSchema.partial().omit({id: true});

export type ClassUpdateType = z.infer<typeof ClassUpdateSchema>;

export class Class implements Serializable {
    code: ClassCreationType['code'];
    accessor teacher : ClassCreationType['teacher'];
    readonly id: string;

    constructor(data: ClassCreationType) {
        const parsedData = ClassCreationSchema.parse(data);
        this.code = parsedData.code;
        this.teacher = parsedData.teacher;
        this.id = parsedData.id ?? randomUUID();
    }

    static fromObject (obj: Record<string, unknown>): Class {
        const parsedData = ClassCreationSchema.parse(obj);
        return new Class(parsedData);
    }
    
    toJSON (): string {
        return JSON.stringify(this.toObject())
    }
    toObject () {
        return {
            id: this.id,
            teacher: this.teacher,
            code: this.code,
        }
    }
}
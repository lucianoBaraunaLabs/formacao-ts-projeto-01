import z from 'zod'
import { Serializable } from './types.js'
import { randomUUID } from 'crypto'

export const TeacherCreationSchema = z.object({
  firstName: z.string().min(2).max(100),
  surname: z.string().min(2).max(100),
  email: z.email(),
  phone: z.string(),
  document: z.string(),
  salary: z.number().min(1),
  hiringDate: z.string().refine((date: string) => !isNaN(new Date(date).getTime())),
  major: z.string(),
  id: z.string().uuid().optional(),
});

export type TeacherCreationType = z.infer<typeof TeacherCreationSchema>;
export const TeacherUpdateSchema = TeacherCreationSchema.partial().omit({id: true});
export type TeacherUpdateType = z.infer<typeof TeacherUpdateSchema>;

export class Teacher implements Serializable {
  firstName: TeacherCreationType['firstName'];
  surname: TeacherCreationType['surname'];
  email: TeacherCreationType['email'];
  phone: TeacherCreationType['phone'];
  document: TeacherCreationType['document'];
  salary: TeacherCreationType['salary'];
  hiringDate: Date;
  major: TeacherCreationType['major'];
  readonly id: string;

  constructor(data: TeacherCreationType) {
    const parsedData = TeacherCreationSchema.parse(data);
    this.firstName = parsedData.firstName;
    this.surname = parsedData.surname;
    this.email = parsedData.email;
    this.phone = parsedData.phone;
    this.document = parsedData.document;
    this.salary = parsedData.salary;
    this.hiringDate = new Date(parsedData.hiringDate);
    this.major = parsedData.major;
    this.id = parsedData.id ?? randomUUID();
    }

    static fromObject (obj: Record<string, unknown>): Teacher {
        const parsedData = TeacherCreationSchema.parse(obj);
        return new Teacher(parsedData);
    }
    
    toJSON (): string {
        return JSON.stringify(this.toObject())
    }
    toObject () {
        return {
            firstName: this.firstName,
            surname: this.surname,
            email: this.email,
            phone: this.phone,
            document: this.document,
            salary: this.salary,
            hiringDate: this.hiringDate.toISOString(),
            major: this.major,
            id: this.id
        };
    }

}
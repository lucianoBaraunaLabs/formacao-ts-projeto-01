import { z } from "zod";

export const AddressSchema = z.object({
  line1: z.string(),
  line2: z.string().optional(),
  zipCode: z.string(),
  city: z.string(),
  country: z.string(),
}); 

export type Address = z.infer<typeof AddressSchema>;

// É dessa forma que criamos uma classe estática que pode ser usada para tipar construtores
export interface SerializableStatic {
  // Criando um tipo para o construtor em typescript
  new (...args: any[]): Serializable;
  fromObject(obj: Record<string, unknown>): InstanceType<this>;
}

export interface Serializable {
  id: string;
  toJSON(): string;
  toObject(): Record<string, unknown>;
}
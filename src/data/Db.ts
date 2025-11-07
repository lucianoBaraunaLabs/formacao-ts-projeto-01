import { fileURLToPath } from 'node:url'
import { Serializable, SerializableStatic } from '../domain/types.js'
import { dirname, resolve } from 'node:path'
import { en } from 'zod/locales'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

export abstract class Database {
    protected readonly dbPath: string;

    // Todas as classes tem que ser serializáveis.
    protected dbData: Map<string, Serializable> = new Map();

    readonly dbEntity: SerializableStatic;

    constructor(entity: SerializableStatic) {
        this.dbEntity = entity;
        const filePath = fileURLToPath(import.meta.url);
        this.dbPath = resolve(dirname(filePath), `.data/${entity.name.toLowerCase()}.json`);
        this.#initialize();
    }

    #initialize() {
        if(!existsSync(dirname(this.dbPath))) {
            // se existir outras partes do caminho, cria elas também
            mkdirSync(dirname(this.dbPath), { recursive: true })
        }

        if (existsSync(this.dbPath)) {
            const data: [string, Record<string, unknown>][] = JSON.parse(readFileSync(this.dbPath, 'utf-8'));

            for (const [key, value] of data) {
                this.dbData.set(key, this.dbEntity.fromObject(value));
            }

            return
        }

        this.#updateFile();


    }
    #updateFile() {
        // Como o Map não é serializável diretamente, precisamos converter para um array de arrays
        const data = [...this.dbData.entries()].map(([key, value]) => [key, value.toObject()]);
        writeFileSync(this.dbPath, JSON.stringify(data));
        return this
    }

    list(): Serializable[] {
        return [...this.dbData.values()];
    }

    remove(id: string): this {
        this.dbData.delete(id);
        return this.#updateFile();
    }

    save(entity: Serializable): this {
        this.dbData.set(entity.id, entity);
        return this.#updateFile();
    }

    listById(property: string, value:any) {
        const allData = this.list();
        return allData.filter((data) => {
            let comparable = (data as any)[property] as unknown
            let comparison = value as unknown

            if(typeof comparable === 'object') {
                [comparable, comparison] = [JSON.stringify(comparable), JSON.stringify(comparison)]
            }

            return comparable === comparison;
        })
    }

    findById(id: string) {
        return this.dbData.get(id);
    }
}
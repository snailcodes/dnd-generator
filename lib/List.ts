import * as Generic from "../interfaces/generic";
import { NPC } from "./NPC";

export interface ListItem {
    [property: string]: any;
    value: string;
}

export interface ListItemRaw extends ListItem {
    weight?: number | string;
}

export class List {
    items: false | ListItem[];
    weighted: boolean;

    constructor(items?: ListItem[]) {
        this.weighted = false;
        this.items = items || false;
    }

    static pickRandom<Type>(list: Type[]) {
        return list[Math.floor(Math.random() * list.length)];
    }

    getItems() {
        if (this.items && !this.weighted) {
            this.items.forEach((item: ListItemRaw) => {
                if (!Object.prototype.hasOwnProperty.call(item, "weight")) {
                    item.weight = 1;
                }

                item.weight = parseInt(String(item.weight), 10);

                if (this.items) {
                    this.items = this.items.concat(
                        new Array(item.weight).fill(item)
                    );
                }
            });

            this.weighted = true;
        }

        return this.items as ListItem[];
    }

    getFiltered(filter?: Generic.Object) {
        let list = this.getItems();

        if (filter && Object.values(filter).length > 0) {
            let filter_json = JSON.parse(JSON.stringify(filter));

            return list.filter(item => {
                return !Object.keys(filter_json).some(property => {
                    if (!Array.isArray(filter_json[property])) {
                        filter_json[property] = [filter_json[property]];
                    }

                    if (Object.prototype.hasOwnProperty.call(item, property)) {
                        if (!Array.isArray(item[property])) {
                            item[property] = [item[property]];
                        }

                        return item[property].every((option: any) => {
                            return filter_json[property].indexOf(option) === -1;
                        });
                    }

                    return false;
                });
            });
        }

        return list;
    }

    pickRandom(filter?: Partial<NPC>): string {
        let item = List.pickRandom(this.getFiltered(filter));

        if (item) {
            if (Array.isArray(item.value)) return List.pickRandom(item.value);
        } else {
            if (filter) {
                delete filter.place;
            }

            throw new Error(
                `Unable to use ${this.constructor.name} for: ${JSON.stringify(
                    filter
                )}`
            );
        }

        return item.value;
    }
}

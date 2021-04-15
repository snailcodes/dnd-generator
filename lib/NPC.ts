import { Gender } from "./gender/gender";
import { getPronoun } from "./language/common";
import { NameList } from "./name/name";
import { Place } from "./Place";
import { Sex } from "./sex/sex";
import { ucfirst } from "./utils";

const TRANSGENDER_CHANCE = 50;
const NON_BINARY_CHANCE = 50;

export class NPC {
    place: Place;

    // name
    forename: string;
    surname: string;

    sex: Sex;
    gender: Gender;

    age: string;
    alignment: string;
    armor: string;
    class: string;
    motivation: string;
    nobility: string;
    profession: string;
    race: string;
    title: string;
    weapons: string[];

    // physical
    hair: string;
    eye: string;

    constructor(place?: Place, properties: Partial<NPC> = {}) {
        this.place = place instanceof Place ? place : new Place();

        /**
         * born as...
         */
        if (properties && properties.sex) {
            this.sex = properties.sex;
        } else {
            this.sex = this.place.lists.sex.pickRandom(
                Object.assign({}, properties || {}, this)
            ) as Sex;
        }

        /**
         * identify as...
         */
        if (properties && properties.gender) {
            this.gender = properties.gender;
        } else {
            this.gender = this.sex;
            if (Math.floor(Math.random() * TRANSGENDER_CHANCE) === 1) {
                this.gender = this.place.lists.sex.pickRandom(
                    Object.assign({}, properties || {}, this)
                ) as Gender;
            } else if (Math.floor(Math.random() * NON_BINARY_CHANCE) === 1) {
                this.gender = "Non-Binary";
            }
        }

        if (properties && properties.age) {
            this.age = properties.age;
        } else {
            this.age = this.place.lists.age.pickRandom(
                Object.assign({}, properties || {}, this)
            );
        }

        if (properties && properties.race) {
            this.race = properties.race;
        } else {
            this.race = this.place.lists.race.pickRandom(
                Object.assign({}, properties || {}, this)
            );
        }

        if (properties && properties.class) {
            this.class = properties.class;
        } else {
            this.class = this.place.lists.class.pickRandom(
                Object.assign({}, properties || {}, this)
            );
        }

        if (properties && properties.nobility) {
            this.nobility = properties.nobility;
        } else {
            this.nobility = this.place.lists.nobility.pickRandom(
                Object.assign({}, properties || {}, this)
            );
        }

        if (properties && properties.title) {
            this.title = properties.title;
        } else if (this.nobility === "Knighted") {
            this.title = this.gender === "Male" ? "Sir" : "Dame";
        } else {
            this.title = this.place.lists.title.pickRandom(
                Object.assign({}, properties || {}, this)
            );
        }

        if (properties && properties.alignment) {
            this.alignment = properties.alignment;
        } else {
            this.alignment = this.place.lists.alignment.pickRandom(
                Object.assign({}, properties || {}, this)
            );
        }

        if (properties && properties.motivation) {
            this.motivation = properties.motivation;
        } else {
            this.motivation = this.place.lists.motivation.pickRandom(
                Object.assign({}, properties || {}, this)
            );
        }

        if (properties && properties.profession) {
            this.profession = properties.profession;
        } else {
            this.profession = this.place.lists.profession.pickRandom(
                Object.assign({}, properties || {}, this)
            );
        }

        this.surname = "";
        if (properties && properties.forename) {
            this.forename = properties.forename;

            if (properties.surname) this.surname = properties.surname;
        } else {
            let [forename, surname] = new NameList().pickRandom().split(" ");

            if (properties && properties.surname) surname = properties.surname;

            this.forename = (forename || "").trim();
            this.surname = (surname || "").trim();
        }

        if (properties && properties.hair) {
            this.hair = properties.hair;
        } else {
            this.hair = this.place.lists.hair.pickRandom(
                Object.assign({}, properties || {}, this)
            );
        }

        if (properties && properties.eye) {
            this.eye = properties.eye;
        } else {
            do {
                this.eye = this.place.lists.eye.pickRandom(
                    Object.assign({}, properties || {}, this)
                );
            } while (this.eye === this.hair);
        }

        if (properties && properties.armor) {
            this.armor = properties.armor;
        } else {
            this.armor = this.place.lists.armor.pickRandom(
                Object.assign({}, properties || {}, this)
            );
        }

        if (properties && properties.weapons) {
            this.weapons = properties.weapons;
        } else {
            this.weapons = new Array(Math.floor(Math.random() * 2) + 1)
                .fill(null)
                .map(() => {
                    return this.place.lists.weapon.pickRandom(
                        Object.assign({}, properties || {}, this)
                    );
                });

            if (this.weapons[1] && this.weapons[1] === this.weapons[0]) {
                this.weapons.splice(1, 1);
            }
        }
    }

    getName() {
        return [this.forename, this.surname].filter(name => name).join(" ");
    }

    getDescription() {
        return `${this.getName()} (${this.profession}): ${ucfirst(this.age)} ${
            this.race
        } ${this.class}, ${this.alignment}. ${
            this.forename
        } is {physical detail} with ${this.hair} hair and ${
            this.eye
        } eyes. ${ucfirst(getPronoun("third", this.gender, "subject"))} wears ${
            this.armor
        } and wields a ${this.weapons.join(" and a ")}. ${
            this.forename
        } seeks ${this.motivation}.`;
    }
}

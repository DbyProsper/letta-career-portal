import type { Practitioner } from "../data/catalog";
import { useLanguage } from "../lib/language";

export function PractitionerIdentity({ person }: { person: Practitioner }) {
  const { t } = useLanguage();
  return (
    <>
      <img
        className="practitioner-photo"
        src={"/images/practitioners/" + person.id + ".webp"}
        alt={
          person.founder
            ? person.name
            : t("Illustrative portrait for {name}", { name: person.name })
        }
      />
      <small>
        {t(person.founder ? "Founder and team leader" : "Sample practitioner")}
      </small>
      <h3>{person.name}</h3>
      <p>{t(person.area)}</p>
    </>
  );
}

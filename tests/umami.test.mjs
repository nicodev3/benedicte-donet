import { test } from "node:test";
import assert from "node:assert/strict";
import { getConversionDestination, UMAMI_EVENTS } from "../src/lib/umami.ts";

const baseUrl = "https://www.benedictedonet-psyenligne.com/article/";
const email = "donetbenedicte@gmail.com";

test("classe les étapes du parcours vers une consultation", () => {
  assert.deepEqual(getConversionDestination("/psychotherapie/", baseUrl, email), {
    event: UMAMI_EVENTS.CONSULTATION,
    destination: "/psychotherapie/",
  });
  assert.deepEqual(getConversionDestination("/en/psychotherapie/#tarifs", baseUrl, email), {
    event: UMAMI_EVENTS.CONSULTATION,
    destination: "/en/psychotherapie/",
  });
  assert.deepEqual(getConversionDestination("/infos-pratiques/#contact", baseUrl, email), {
    event: UMAMI_EVENTS.CONTACT_INFOS,
    destination: "/infos-pratiques/",
  });
});

test("reconnaît Doctolib sans conserver ses paramètres", () => {
  assert.deepEqual(
    getConversionDestination(
      "https://www.doctolib.fr/psychologue/l-etang-sale/benedicte-donet?source=site",
      baseUrl,
      email,
    ),
    { event: UMAMI_EVENTS.DOCTOLIB, destination: "doctolib" },
  );
});

test("reconnaît uniquement l’adresse email du site", () => {
  assert.deepEqual(getConversionDestination(`mailto:${email}`, baseUrl, email), {
    event: UMAMI_EVENTS.EMAIL,
    destination: "email",
  });
  assert.equal(
    getConversionDestination("mailto:other@example.com", baseUrl, email),
    undefined,
  );
});

test("ignore les destinations externes sans rapport", () => {
  assert.equal(
    getConversionDestination("https://example.com/psychotherapie/", baseUrl, email),
    undefined,
  );
  assert.equal(getConversionDestination("#section", baseUrl, email), undefined);
});

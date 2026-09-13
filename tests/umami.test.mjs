import { test } from "node:test";
import assert from "node:assert/strict";
import {
  doctolibEventFor,
  getConversionDestination,
  UMAMI_EVENTS,
} from "../src/lib/umami.ts";

const baseUrl = "https://www.benedictedonet-psyenligne.com/article/";
const email = "donetbenedicte@gmail.com";
const rdvUrl = "https://www.doctolib.fr/psychologue/l-etang-sale/benedicte-donet";
const messageUrl =
  "https://www.doctolib.fr/psychologue/l-etang-sale/benedicte-donet/patient-request?category=message";

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

test("distingue prise de rendez-vous et message Doctolib", () => {
  assert.deepEqual(
    getConversionDestination(`${rdvUrl}?source=site`, baseUrl, email),
    { event: UMAMI_EVENTS.DOCTOLIB, destination: "doctolib" },
  );
  assert.deepEqual(getConversionDestination(messageUrl, baseUrl, email), {
    event: UMAMI_EVENTS.DOCTOLIB_MESSAGE,
    destination: "doctolib-message",
  });
  assert.equal(doctolibEventFor(rdvUrl), UMAMI_EVENTS.DOCTOLIB);
  assert.equal(doctolibEventFor(messageUrl), UMAMI_EVENTS.DOCTOLIB_MESSAGE);
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

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { localizedPath } from '../src/lib/i18n.ts';

test('les liens de contact et tarifs conservent leurs fragments', () => {
  assert.equal(localizedPath('/infos-pratiques/#contact', 'en'), '/en/infos-pratiques/#contact');
  assert.equal(localizedPath('/psychotherapie/#tarifs', 'fr'), '/psychotherapie/#tarifs');
  assert.equal(localizedPath('/en/psychotherapie/#tarifs', 'fr'), '/psychotherapie/#tarifs');
});

test('les paramètres restent intacts, même avec un chemin dans leur valeur', () => {
  assert.equal(localizedPath('/infos-pratiques?next=/services/#contact', 'en'), '/en/infos-pratiques/?next=/services/#contact');
  assert.equal(localizedPath('/?source=blog#contact', 'en'), '/en/?source=blog#contact');
});

test('la langue est retirée uniquement pour un segment complet', () => {
  assert.equal(localizedPath('/en/', 'fr'), '/');
  assert.equal(localizedPath('/en', 'fr'), '/');
  assert.equal(localizedPath('/en/psychotherapie/', 'en'), '/en/psychotherapie/');
  assert.equal(localizedPath('/energie/', 'fr'), '/energie/');
});

test('les liens externes, email et ancres locales sont préservés', () => {
  for (const href of ['https://www.doctolib.fr/', '//example.com/path', 'mailto:donetbenedicte@gmail.com', '#contact']) {
    assert.equal(localizedPath(href, 'en'), href);
  }
});

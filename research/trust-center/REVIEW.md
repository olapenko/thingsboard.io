# Trust Center draft: structure analysis and UX review

> **Revision 1, kept for reference.** The living review, with the decisions taken since, is the
> artifact **Trust Center Review**: https://claude.ai/artifact/FCqgipQ6VgyRcaiDVCrc97. Since this
> revision: navigation is added from the start, edits are surgical (repetitions only; §5 is parked),
> UX findings move to the build, and the PE finding below was wrong (see §4, row 1).

Reviewed 2026-10-09 against the draft captured in [CONTENT.md](CONTENT.md) (draft dated 1 Oct 2026)
and against the site on `handoff` (59aea93ec). This covers structure, flows and content. It leaves
the draft's visual design out: the rebuild should use the site's UI kit, not the mock.

## Verdict

The content is strong. It is specific, sourced and honest about scope (the ISO 27001 page says the
certificate does not cover the product or your installation). The structure is what needs work:

1. **One fact is repeated in four to seven places, and it already drifts.** The draft is organised
   three ways at once: by security domain, by deployment model and by document type. The hub then
   summarises all three. Backups, regions, encryption, staff access, uptime and the certificates
   are each restated on four to seven pages. Four of those statements already disagree with each other,
   and three more disagree with the rest of the site (§2.4).
2. **The most common task is the hardest one.** A vendor assessor who wants the SoA, the pentest
   summary and a questionnaire needs four or five clicks per document. The labels promise a request
   but lead to a detail page. The questionnaires sit on a Documents page nothing links to (§3.1).
3. **Some claims need sign-off before anything ships.** Four statements contradict other
   statements in the draft or in the DPA (§4). *(Revision 1 also listed three features as PE-only;
   that was wrong, see §4 row 1.)*
4. **The page set is wide and shallow.** There are 17 views plus 17 document pages. Several are 2–4
   rows long (CCPA, ISO 9001, Product security), and the hub carries about 1,500 words, 18 document
   rows and 23 FAQs. Seven pages plus a hub would hold the same content with less repetition (§5).

## 1. Inventory

| | Count |
|---|---|
| Views | 17: hub, Compliance + 4 certificate/regulation pages, Documents, 4 topic pages, Sub-processors, Cloud and Private Cloud, On-premises, Commitment and responsibility, contact form, vulnerability report |
| Document pages | 17 (one per document that has no page of its own) |
| Documents | 20: 5 public, 13 NDA, 2 planned (CAIQ Lite, SIG Lite) |
| Topic rows | 32 across Product (4), Data (11), Access (8), Dev (9) |
| FAQ | 23 in 5 categories; 10 visible, 13 behind "Load more FAQ" |
| Forms | 3: hub inline (mailto), contact form (8 subjects), vulnerability report (16 fields) |
| Hub | about 1,500 words in 9 blocks, plus 18 document rows rendered by script |

## 2. Structure analysis

### 2.1 The map as built

```
Trust Center (hub)
├─ [panel] Overview · [panel] Certifications (not links)
├─ [tiles] Compliance · Data security · Product security · Access control · Dev security · Commitment and responsibility
├─ [cards] Cloud and Private Cloud · On-premises
├─ [list]  Documents (18, grouped) ──────────────► document pages
├─ [form]  Contact us (mailto)
├─ [banner] Report a vulnerability ──────────────► report form
└─ [FAQ]   23 questions

Compliance ─ ISO 27001 · ISO 9001 · GDPR · CCPA
Documents (orphan) ─ document pages ─ "Request via NDA" ─► contact form
Product security · Data security · Access control · Dev security      (tile-only entry)
Sub-processors
Cloud and Private Cloud · On-premises
Commitment and responsibility                                           (tile-only entry)
Contact form · Report a vulnerability
```

### 2.2 Three axes crossed

| Axis | Pages |
|---|---|
| Security domain | Compliance, Data security, Product security, Access control, Dev security |
| Deployment model | Cloud and Private Cloud, On-premises, Commitment and responsibility (matrix) |
| Artifact | Documents, Sub-processors, certificate pages |

A reader's question cuts across all three. Take "how are backups handled on Private Cloud?". The
answer sits on the hub card, in the FAQ, in the Data security row "Backups", in the Cloud table and
in the Commitments matrix. None of these is the canonical answer, so none can be linked as "the"
answer, and every edit has to be made five times.

### 2.3 Where each fact lives

| Fact | Places stated |
|---|---|
| Certificates, issuer, dates | promo strip, hub panel, hub tile, FAQ, Compliance, ISO 27001, ISO 9001, two document rows (8) |
| Encryption in transit (ports) | hub tile, hub Cloud card, FAQ, Data security, Product security, Cloud table (6) |
| Hosting regions | hub tile, hub Cloud card, FAQ, Data security, Cloud table, Sub-processors, Commitments (7) |
| Backups | hub Cloud card, FAQ, Data security, Cloud table, Commitments (5) |
| Staff access | hub Cloud card, FAQ, Data security, Cloud table ×2 (5) |
| 2FA / SSO / RBAC | hub tile, hub On-prem card, FAQ, Access control, On-premises, Commitments ×2 (7) |
| Leaving / export / deletion | hub tile, FAQ, Data security ×2, Cloud table, Commitments (6) |
| Private Cloud SLA | hub tile, FAQ, Cloud table, Commitments (4) |
| NDA in two business days | hub tile, FAQ, Documents, document pages, Commitments, contact form (6) |
| Release support (LTS 18 / std 6) | hub On-prem card, On-premises, Dev security (3) |
| Pentest | hub tile, hub documents intro, Compliance, Dev security, document row (5) |

### 2.4 Drift already in the draft

| Topic | One page says | Another says |
|---|---|---|
| Cloud regions | Hub tile (Data security): "Region of your choice: North America, EU or APAC" | ThingsBoard Cloud is North America or EU only; APAC is Private Cloud (hub card, FAQ, Cloud table) |
| SOC 2 for Private Cloud | Compliance and Data security: Private Cloud data centers hold "ISO 27001, PCI DSS and SOC 2" | Cloud table: Private Cloud is "ISO 27001 and PCI DSS certified data centers" (no SOC 2) |
| Universal features | Overview: "the same security features" on Cloud, Private Cloud and on-premises | Edition-dependent in fact; see §4 |
| Backup retention | Cloud table and FAQ: "7 days by default (longer on Enterprise)" | Data security: "kept 7 days by default" (no Enterprise note) |

Against the rest of the site:

| Topic | Draft | Site |
|---|---|---|
| Private Cloud SLA | 99.9% / 99.95% / custom ("up to 99.95%") | Pricing plan cards agree; the Private Cloud **pricing FAQ** says "99.9%–99.99%" (`src/data/pricing/faq/tb-private-cloud.ts`) |
| Pentest frequency | "Annual external penetration test", "every year" | The homepage trust card deliberately states no frequency: its source removed "every year" (`src/data/home-trust.ts` header) |
| Private Cloud rate limits | "50 requests per second and 500 per minute per source IP" | Pricing FAQ: per-tenant, device and user limits "published on the Private Cloud subscription page" |
| Security entry point | — | The homepage security card links "Security overview" to the docs (`/docs/pe/user-guide/security/`); the footer has no security or trust link |

### 2.5 Navigation and reachability

There is no local navigation. A reader moves between Trust Center pages only through the hub, the
breadcrumb, in-text links and back links, and the back links are inconsistent:

| Back link | Pages |
|---|---|
| "← Trust Center" | Access control, Dev security, Cloud and Private Cloud, On-premises |
| "← Compliance" | ISO 27001, ISO 9001, GDPR, CCPA |
| "← Documents" | document pages |
| none | Compliance, Documents, Product security, Data security, Sub-processors, Commitments, contact form, report form |

- **Orphans.** The Documents page is linked only from a document page's back link. It is the only
  place that lists the questionnaires (CAIQ Lite, SIG Lite) and the Planned filter. The contact form
  has no link from the hub: the hub's "Contact us" sends an email instead.
- **Dead ends.** Commitments, Sub-processors and Product security end without an onward step: no
  request, no related section, no next page.
- **False affordances.** The hub's two certification cards look like the Compliance page's cards,
  which are links, but they are not links. The deployment cards are not clickable as a whole, while
  the topic tiles are.
- **Second search.** "Search this page" duplicates the site search in the header. Its ⌘K shortcut
  collides with the site search's ⌘K. It also names some results by their element id (`deployment`,
  `documents`, `faq`).

### 2.6 Page weight

| Too heavy | Too thin |
|---|---|
| Hub: 9 blocks, ~1,500 words, 18 document rows, 23 FAQs; it tries to be both a landing page and the whole site | CCPA (2 rows), ISO 9001 (4 rows), Product security (4 rows), Documents (27 words + list), each document page (4 table rows and a button) |

The thin pages read better as sections of their parents, with anchors. The 17 document pages add
one click between a reader and the request; their content (description, version, owner) fits in
an expandable row.

### 2.7 Semantics

- The topic rows' titles are bold text, not headings. They cannot be linked to or reached by
  heading navigation, and the FAQ cannot point at "Backups" on the Data security page.
- The six tiles have no visible section heading (only a hidden name, "Security highlights"). The
  vulnerability banner's title is not a heading.
- Emails are plain text in the FAQ, GDPR and CCPA. They are linked only on On-premises,
  Commitments and the report form.

## 3. UX review

Priority: **P1** blocks a task or risks trust; **P2** costs effort or clarity; **P3** is polish.

### 3.1 P1 — Requesting NDA documents

Path today, from the hub: **Request 🔒** (opens the document page, not a request) → **Request via
NDA** → contact form with 6 required fields, one document pre-ticked → back to the list for the next
document. The hub and the Documents page cannot select several documents. Multi-select exists only
inside the form, and the form never shows where a document is described.

**Fix:** request straight from the library. Tick documents in the list (the tick on each NDA row is
the request), with one "Request N documents" action that opens the form with them already listed.
Drop the document pages and show the description in the row. Ask only what the NDA needs: name, work
email, company and, optionally, the reason.

### 3.2 P1 — Contact routes

- The hub's inline "Contact us" opens a `mailto:`. Nothing happens without a mail client, nothing is
  tracked, and it skips the structured form the draft also has.
- One security form carries 8 subjects of different kinds. They include a **data subject request**,
  which requires *Company* and a *Work email*. That blocks the private individuals GDPR and CCPA
  requests come from. They also include **sub-processor change notifications**, which is a
  subscription, not a question.

**Fix:** one contact form, linked from the hub. Route privacy requests to their own short form
(name, email, request type, account) under Privacy. Make sub-processor notifications a subscribe
control on the Sub-processors page. The site already posts its Contact us form through Formspree
(`src/data/formspree.ts`). Wire both Trust Center forms the same way before launch; the draft says
neither is connected.

### 3.3 P1 — Vulnerability disclosure is a form, not a policy

The report page is good on process: timelines, rules before testing, a structured form, a
confidentiality pledge. It lacks what researchers look for first:

- a **safe-harbor** statement
- in-scope and out-of-scope assets
- a **PGP key** or another encrypted channel (the form takes proof-of-concept attachments with no
  end-to-end encryption)
- `/.well-known/security.txt`
- a list of published **advisories**: fixed CVEs live only in the release notes

Also, "Credit me by the name above" can be chosen while the name is left empty.

### 3.4 P2 — Too many routes, no local navigation

There are 17 views and no persistent navigation. Back links are inconsistent and pages are orphaned
(§2.5). Add a Trust Center navigation that is the same on every page: a sidebar on desktop and a
section menu on phones. Then drop the ad-hoc back links and keep the breadcrumb.

### 3.5 P2 — Status chips say the wrong thing

- **Configurable** is drawn in the warning amber, so *Encryption in transit: Configurable* reads as
  a caution. The text beside it ("Unencrypted device connection is available by default for testing
  or PoC purposes and can be disabled") is accurate but alarming without a recommendation. Say what
  to do: "Turn plain connections off in production".
- **Self-declared** (GDPR, CCPA) is drawn in the same green as **Certified** (ISO). A self-declaration
  should not look like a certification.
- **Depends on deployment** is grey, which reads as "unavailable".

Use neutral tones for kind (built in, configurable, depends on deployment) and keep green for
verified states only.

### 3.6 P2 — Labels that misdescribe the action

| Label | What it does |
|---|---|
| Download ↓ (ISO certificates) | Opens a Google Drive viewer |
| Request 🔒 (hub) | Opens a document page |
| Docs ↗, Open ↗ | Opens a page on this site, in the same tab once ported (↗ means off-site) |
| Read the section → | Opens a separate page |
| Download ↓ / Open ↗ (Private Cloud SLA, License server network requirements, EULA, Support policy) | Nothing: dead links. The EULA exists at `/legal/license-agreement/` |

### 3.7 P2 — Naming

- **Dev security** is jargon; the industry term is **Secure development**. The route is `appsec`.
- **Commitment and responsibility** mixes two things. The matrix is a **shared responsibility
  model**, which buyers search for by that name, and the commitments are service terms.
- Two documents are both called **Privacy Policy**: the public Cloud policy and the NDA "Privacy
  Policy (Product Data Protection Policy)". Name the second **Data Protection Policy**.
- Readable slugs: `product`, `data`, `access`, `appsec` and `onprem` should become words.

### 3.8 P2 — The responsibility matrix

In 13 of 14 rows the Cloud and Private Cloud columns say the same thing, and the table carries 27
"✓ ThingsBoard" chips. The matrix also sits apart from the deployment pages it explains. Merge it
into a single three-column deployment comparison (Cloud · Private Cloud · On-premises), with "who
handles it" as rows next to the hosting, backup and uptime facts.

### 3.9 P2 — FAQ

Most of the 23 answers restate a page. "Load more" hides two whole categories (On-premises, Data
security), so a reader scanning the category headings never sees they exist. Keep the questions no
page answers (SOC 2, AI training, internet access for on-premises), and link the rest to the
canonical section.

### 3.10 P2 — Missing pieces a trust center usually has

Linked status pages: `status.thingsboard.cloud` is named but not linked. Also missing: a
subscribe-for-updates option, security advisories, incident communication, an "as of" date beside
the pentest and audit facts, and an entry point from the site. Today nothing links to the Trust
Center: the footer's legal row holds only the Cloud terms and privacy policy, and the homepage
security card links to the docs.

### 3.11 P3

- Certificates live on Google Drive. Host them on the site, or link the certification body's
  validator. Show the **certification body's** mark, not ISO's (see the note in
  `src/data/home-trust.ts`).
- Internal document control is printed publicly: "Owner: IMS Manager", "Reviewed at least every six
  months", and each document's owner (CTO, Legal Counsel). Keep "Last updated" and drop the rest.
- The three-column tables need a phone layout, not a 560px horizontal scroll.
- The On-premises guide list (14 links) duplicates the docs' Security section. Link the section once
  and keep 4–5 key guides.

## 4. Facts to sign off before publishing

| # | Claim | Where | Problem | Owner |
|---|---|---|---|---|
| 1 | ~~"the same security features" on every deployment~~ | Overview, On-premises | **Withdrawn.** From 4.4, CE and PE are one source-available ThingsBoard and advanced security is free in every deployment (blog, 29 Sep 2026). The stale text is the docs' `peFeature` banner ("available in ThingsBoard Professional and ThingsBoard Cloud only", 62 CE pages): a definite fix on the site | Site |
| 2 | "Production data is never used in tests" | Dev security | Sub-processors lists **netcup** for "Development instances for Private Cloud", and the list's lede says vendors on it "may have access to customer or personal data" | Security |
| 3 | "Customer data never goes into public AI services" | FAQ | OpenAI, Google (Gemini) and Anthropic are listed as sub-processors that "may have access to customer or personal data". State which data reaches them and on what terms | Security / Legal |
| 4 | "We notify customers of material changes to this list, as set out in the DPA" | Sub-processors | The DPA (`/products/paas/dpa/`, §5.1) says the processor shall not appoint a subprocessor unless the Company authorizes it. It has no notification clause | Legal |
| 5 | Weak spots are shared under NDA only | Hub documents intro | Public text names the partial control (A.8.12, data leakage prevention) and the audit outcome ("3 minor nonconformities") | IMS |
| 6 | Annual pentest, vendor named (DataArt) | Compliance, Dev security, tile | The homepage card dropped the frequency on purpose. Confirm frequency and whether to name the vendor | Security |
| 7 | Private Cloud SLA "up to 99.95%" | Tile, FAQ, Cloud, Commitments | The pricing FAQ says "99.9%–99.99%". Align the pricing FAQ | Sales / Product |
| 8 | Data center attestations per model | Compliance, Data security, Cloud table | SOC 2 for Private Cloud: yes on two pages, no on the third | Security |
| 9 | Cloud "Region of your choice: … or APAC" | Hub tile | Cloud has no APAC region | Product |
| 10 | Data subject requests to `security@` | GDPR, CCPA, FAQ | Check that it matches the contact named in the Cloud privacy policy | Legal |
| 11 | Rate limits "50 rps / 500 per minute per source IP" | Cloud table | The pricing FAQ describes per-tenant, device and user limits instead | Product |

## 5. Proposed structure

Seven pages and a hub, each with one job, and every fact stated once and linked from elsewhere:

```
/trust-center/                     Hub: three actions (Request documents · Report a vulnerability · Contact),
                                   a verification strip (certificates + validator, last pentest, status pages),
                                   a card per section, 6–8 FAQs
├─ /trust-center/compliance/       ISO 27001 and ISO 9001 (anchors), scope and what it does not cover,
│                                  verification, data center attestations, using our certificates in your audit
├─ /trust-center/privacy/          GDPR, CCPA, DPA, sub-processors table (+ subscribe), AI services,
│                                  data subject requests (own short form)
├─ /trust-center/platform-security/ Product + Access + the platform half of Data security, grouped with anchors,
│                                  each control tagged by edition (CE / PE / Cloud)
├─ /trust-center/secure-development/ Dev security, pentest, release support, security fixes, CVEs/advisories
├─ /trust-center/deployment/       Cloud · Private Cloud · On-premises side by side: hosting, residency,
│                                  isolation, backups, HA, uptime, retention, access, leaving,
│                                  shared responsibility, documents per model
├─ /trust-center/documents/        The one library: all 20, filters by access and type (incl. questionnaires),
│                                  tick to request, one request form
└─ /trust-center/vulnerability-disclosure/ Policy (scope, rules, safe harbor, timelines), PGP / security.txt,
                                   report form, advisories
```

| Draft | Goes to |
|---|---|
| Hub Overview, Certifications | Hub intro + verification strip |
| Compliance, ISO 27001, ISO 9001 | Compliance (two anchored sections) |
| GDPR, CCPA, Sub-processors | Privacy |
| Product security, Access control | Platform security |
| Data security | Split: platform controls → Platform security; residency, backups, retention, deletion, staff access → Deployment |
| Dev security | Secure development |
| Cloud and Private Cloud, On-premises, Commitments matrix | Deployment (one three-column comparison) |
| Commitments: NDA turnaround, questionnaires | Documents |
| Commitments: support tiers, SLA, leaving | Deployment |
| Documents, 17 document pages | Documents (rows expand; no detail pages) |
| Contact form | One form (a page or a dialog), linked from the hub; NDA requests via Documents; DSR via Privacy |
| Report a vulnerability | Vulnerability disclosure |
| Hub page search | Dropped (site search) |

### Journeys against the proposal

| Reader | Goal | Draft | Proposed |
|---|---|---|---|
| Vendor assessor | SoA + pentest summary + CAIQ | 4–5 clicks per document; CAIQ only on an orphan page | Hub → Documents → tick 3 → one form |
| Evaluator | "Who does what if we pick Private Cloud?" | Cloud page + Commitments matrix + Data security | Deployment, one table |
| Researcher | Report a bug safely | Hub → form (good) | Same, plus scope, safe harbor and an encrypted channel |
| Data subject | Delete my data | Security form requiring company and work email | Privacy → short DSR form |
| Admin | Harden an on-premises install | On-premises → 14 docs links | Platform security (edition-tagged) → docs |

## 6. Fit with the site

- **Entry points.** Add the Trust Center to the footer: the legal row (`FOOTER_LEGAL` in
  `src/data/footer-map.ts`) or Company. Point the homepage security card's link at it instead of the
  docs. Link it from the Cloud, On-premises and Pricing pages' security answers. Making the ISO
  announcement a `PromoBanner` slide is a site-wide call.
- **Build on the kit** (`src/components/ui/`): Chip for statuses, Segmented/Tabs for the library
  filters, Field for forms, Card. Use the `--page-measure` (1040) column, not the draft's 1180.
- **One data module for the facts** (regions, backups, SLA, retention, rate limits), read by the
  Trust Center and by the pricing FAQ, so §2.4's drift cannot recur.
- **Search.** Drop the page search; the site search covers it, and ⌘K is taken.
- **Indexing.** Keep the pages `noindex` until §4 is signed off.

## 7. Next steps

1. Content owners settle §4: product, security and legal.
2. Agree the structure in §5: page list, slugs and what merges where.
3. Build on `feat/trust-center`, in order: data module → Documents with tick-to-request (the main
   task) → hub → Deployment → the rest. Wire the forms through Formspree.
4. Add the entry points (footer, homepage card) once it is live.

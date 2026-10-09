# Trust Center draft: content and structure

Source: the shared artifact "Trust Center Draft"
(https://claude.ai/artifact/LWPY3jDmFwJGe47WKrfMW4), captured 2026-10-09. The draft's footer says
**Last updated 1 Oct 2026**, **Owner: IMS Manager**, **Reviewed at least every six months**.

This file keeps the draft's words and page structure, not its UI. Text is verbatim, including the
draft's straight apostrophes. Where the draft linked `https://thingsboard.io/...`, the path is given
as a site path. The structure analysis and UX review are in [REVIEW.md](REVIEW.md).

## How the draft is built

- One HTML page with 17 views switched by the URL hash (`#/compliance`, `#/documents/<slug>`…). No
  persistent navigation inside the Trust Center: views link to each other through the hub's tiles,
  breadcrumbs, a few "←" back links and in-text "Related" links.
- It mocks the site around it: a promo strip and a copy of the site header (logo, GitHub stars,
  main menu, Pricing, **Try it now** → `#/contact`). Those are mock chrome, not Trust Center content,
  except the promo strip's message (below).
- Every view shares a breadcrumb trail (`Trust Center › …`) and a footer line.
- Both forms are drafts: their thank-you states say "Draft: this form isn't connected yet, so
  nothing was sent." The hub's small "Contact us" form opens the reader's mail app instead.
- 20 documents, 4 topic catalogs, the contact subjects and the vulnerability form's options live in
  script data; they are listed under [Datasets](#datasets).

## Page map

| # | View (hash) | Page | Reached from |
|---|---|---|---|
| 1 | `#/` | **Trust Center** (hub) | Breadcrumb root; Access control and Dev security back links |
| 2 | `#/compliance` | Compliance | Promo strip; hub tile; back links on 2a–2d |
| 2a | `#/compliance/iso-27001` | ISO/IEC 27001:2022 | Compliance |
| 2b | `#/compliance/iso-9001` | ISO 9001:2015 | Compliance |
| 2c | `#/compliance/gdpr` | GDPR | Compliance |
| 2d | `#/compliance/ccpa` | CCPA | Compliance |
| 3 | `#/documents` | Documents (library) | Only the back link and breadcrumb of a document page |
| 3a | `#/documents/<slug>` | A document (17 pages, one per document without a page of its own) | Hub document rows; Documents rows; ISO 27001 "Related"; page search |
| 4 | `#/product` | Product security | Hub tile; Cloud page lede |
| 5 | `#/data` | Data security | Hub tile |
| 6 | `#/access` | Access control | Hub tile |
| 7 | `#/appsec` | Dev security | Hub tile |
| 8 | `#/subprocessors` | Sub-processors | Hub documents intro; FAQ; GDPR; Data security; Cloud documents; "Sub-processor list" document |
| 9 | `#/cloud` | ThingsBoard Cloud and Private Cloud | Hub deployment card (title + link) |
| 10 | `#/onprem` | On-premises | Hub deployment card (title + link) |
| 11 | `#/commitments` | Commitment and responsibility | Hub tile |
| 12 | `#/contact` (+ `/<subject>/<doc>`) | Trust Center contact form | Report page; "Request" links (Cloud page, document pages); mock header's Try it now |
| 13 | `#/report-vulnerability` | Report a vulnerability | Hub banner; FAQ; Dev security; contact form |

## Shared elements

**Promo strip** (above the mocked header, on every view)
- Tag: `✦ Compliance`
- Text: **ISO/IEC 27001:2022 & ISO 9001:2015** — certified since 9 September 2026
- Link: `Details ⟶` → Compliance

**Breadcrumb:** `Trust Center` › section › item. Names: Compliance, Documents, Product security,
Data security, Access control, Dev security, Cloud and Private Cloud, On-premises, Sub-processors,
Commitment and responsibility, Contact form, Report a vulnerability; certificate pages add
`ISO 27001`, `ISO 9001`, `GDPR`, `CCPA`; document pages add the document's name.

**Footer line:** © 2026 ThingsBoard Inc · Owner: IMS Manager · Reviewed at least every six months —
Last updated 1 Oct 2026

---

## 1. Trust Center (hub) — `#/`

Sections in order: title, page search, Overview + Certifications, six topic tiles, Cloud and
on-premises, Documents, Contact us, Found a vulnerability?, FAQ.

### 1.1 Title and page search
- H1: **Trust Center**
- Search field: placeholder "Search this page", shortcut hint `⌘K` (the draft binds ⌘K to it).
  Typing two or more characters shows a line under the field, never hides content:
  - "N section(s) match "q" — jump to: …" (up to 6 section links; sections are named by their
    `data-name`, their inner H2, or else their id: `deployment`, `documents`, `faq`)
  - "Documents: …" (up to 3 matching document links)
  - Or: "Nothing on this page matches "q"."

### 1.2 Overview (panel)
> Security is built into every layer of ThingsBoard, from device connections to the way we develop
> and run the platform. Your data stays isolated, encrypted in transit and under your control.
>
> Whether you use ThingsBoard Cloud, Private Cloud or run the platform on-premises, you get the same
> security features and the same engineering practices behind every release.

### 1.3 Certifications (panel, beside Overview; cards are not links)
- **ISO/IEC 27001:2022** — Information security management system — Certified · Reg. 372-02-270-00460
- **ISO 9001:2015** — Quality management system — Certified · Reg. 372-02-100-02170

### 1.4 Six topic tiles (each tile is one link; footer "Read the section →")

| Tile | Subtitle | Checklist | Links to |
|---|---|---|---|
| **Compliance** | Independently verified security | ISO/IEC 27001:2022 — certified · ISO 9001:2015 — certified · Annual surveillance audits · GDPR and CCPA, self-declared | Compliance |
| **Data security** | Your data stays protected | Tenant isolation by architecture · Encrypted in transit with TLS · Region of your choice: North America, EU or APAC · Export anytime via API, no lock-in | Data security |
| **Product security** | Security built into the product | Encrypted transport for every device protocol · X.509 device credentials and mutual TLS · AES-256 encrypted secrets storage · Custom domains with automatic SSL | Product security |
| **Access control** | You decide who sees what | 2FA enforceable for all users · SSO with OAuth 2.0 and OpenID Connect · Role-based access with entity groups · Password, lockout and session policies | Access control |
| **Dev security** | Built through a secure process | Mandatory code review before merge · Weekly code and dependency scanning · Annual external penetration test · Fixed CVEs listed in release notes | Dev security |
| **Commitment and responsibility** | What we promise and what we handle | NDA documents within two business days · Support response times for every plan · Private Cloud uptime SLA up to 99.95% · What ThingsBoard handles in each deployment model | Commitment and responsibility |

### 1.5 Cloud and on-premises (H2, two cards; the titles and a bottom link go to the detail pages)

**ThingsBoard Cloud and Private Cloud** — We host and run the platform, so you can focus on your solution.

| | |
|---|---|
| Hosting | We host and operate everything: infrastructure, patching, upgrades, monitoring and backups. |
| Isolation | Cloud: every request is confined to its own tenant. / Private Cloud: a dedicated single-tenant cluster. |
| Region | Cloud: North America or EU. / Private Cloud: North America, EU or APAC. |
| Encryption | TLS in transit: HTTPS on 443, MQTTS on 8883. |
| Backups | Cloud: daily, with point-in-time recovery. / Private Cloud: nightly, in a separate cloud region. |
| Staff access | Authorized engineers only, and only to handle your request; role-based and logged. |

Link: Cloud and Private Cloud in detail →

**On-premises** — You run the platform; we provide the product code, security fixes and guides.

| | |
|---|---|
| You run | Infrastructure, network, patching, backups and recovery. |
| Built in | 2FA, SSO, RBAC, an audit log, and X.509 with mutual TLS for devices. |
| Guides | Step-by-step security configuration for every feature in the documentation. |
| Security fixes | Patch releases with no environment or database changes; fixed CVEs listed in release notes. |
| Release support | LTS releases: 18 months. Standard releases: 6 months. |

Link: On-premises in detail →

### 1.6 Documents (H2)
> Public documents are open to everyone. Documents that describe our weak spots, such as the
> Statement of Applicability and the pentest summary, are shared under a mutual NDA. See also the
> list of sub-processors.

- Filter field "Filter documents…" and access buttons **All · Public · Under NDA**.
- 18 documents in four groups, each headed with its count: *Governance & compliance*, *Security &
  development*, *Legal & privacy*, *Reports & resilience* (membership in [Datasets](#documents)).
  Questionnaires are not shown here.
- Row action labels: public with a file → **Download ↓** (opens the file); public with a page →
  **View ↗** (opens that page); NDA → **Request 🔒** (opens the document's page, not the form).
- Empty state: "Nothing matches that filter."

### 1.7 Contact us (small inline form)
Fields: **Name** (placeholder "Jane Reviewer"), **Work email** ("jane@company.com"), **Your
question** ("e.g. SoA and the pen-test report for a vendor assessment"); button **Contact us**.
The button opens a `mailto:security@thingsboard.io` with subject "Trust Center inquiry" and the
three fields in the body. It does not go to the contact form page.

### 1.8 Found a vulnerability? (banner)
> Report it to us privately instead of opening a public issue, so we can fix it before anyone can
> exploit it. We reply within three business days with an investigation plan and keep you updated
> until the fix is out.

Button: **Report a vulnerability** → Report a vulnerability page.

### 1.9 Trust Center FAQs (H2)
Ten questions show; **Load more FAQ** reveals the other 13 (and the last two category headings).

**General**
- **How do I contact ThingsBoard about security?** Email security@thingsboard.io for security,
  compliance and privacy questions, document requests and vulnerability reports.
- **How quickly can we get documents under NDA?** Within two business days after we sign a mutual
  NDA. We can also give you the information you need to complete your own security questionnaire.
- **How do I report a security issue?** Use the vulnerability report form or email
  security@thingsboard.io. We reply within three business days with an investigation plan. Please
  don't open a public issue: it puts other users at risk before a fix is available.

**Compliance**
- **What certifications does ThingsBoard hold?** ISO/IEC 27001:2022 and ISO 9001:2015. Swiss
  Approval North America issued both certificates on 9 September 2026; they are valid until
  8 September 2027, with an audit every year. You can verify them at
  swissapproval.ch/certificate-validator.
- **What does your ISO/IEC 27001 certificate cover?** Our management system: how we design,
  develop, maintain and support the software, our cloud services, QA testing and licensing. It
  covers how we build and run ThingsBoard, not a customer's own installation.
- **Can I certify my own solution built on ThingsBoard?** Yes. You can use our ISO certificates as
  supplier evidence in your own audit, for example for ISO/IEC 27001, and under NDA we share the
  Statement of Applicability and audit reports. The platform already covers many of the controls,
  such as access control, the audit log and the choice of data region, so you don't need to build
  them from scratch.
- **Do you have a SOC 2 report?** ThingsBoard is certified to ISO/IEC 27001 and ISO 9001. The data
  centers behind ThingsBoard Cloud and Private Cloud hold SOC 2, ISO 27001 and PCI DSS attestations;
  AWS publishes them in AWS Artifact.
- **Do you comply with GDPR and CCPA?** Yes. We meet both through our own privacy program and
  declare our compliance. When we process data on your behalf, the Data Processing Addendum
  applies. Send data subject requests to security@thingsboard.io.

**ThingsBoard Cloud and Private Cloud**
- **Where is my data hosted?** ThingsBoard Cloud runs on AWS in two independent regions, North
  America (thingsboard.cloud) and the EU (eu.thingsboard.cloud), and data never moves between them.
  Private Cloud runs on AWS by default, or on Azure or GCP on request, in North America, the EU or
  APAC.
- **How is my data separated from other customers?** In ThingsBoard Cloud, every request is
  confined to its own tenant, and customers and entity groups narrow access further. Private Cloud
  is a dedicated single-tenant cluster.
- *(more)* **How are backups handled?** ThingsBoard Cloud is backed up daily, with point-in-time
  recovery. Private Cloud takes nightly snapshots and stores them in a separate cloud region for
  7 days by default (longer on Enterprise).
- *(more)* **What uptime do you commit to?** Private Cloud has a contractual SLA: 99.9% on Launch
  and Growth, 99.95% on Scale, and a custom SLA on Enterprise. ThingsBoard Cloud status is live at
  status.thingsboard.cloud and status.eu.thingsboard.cloud.
- *(more)* **Can ThingsBoard staff see my data?** Only authorized ThingsBoard engineers can access
  the infrastructure, with regular audits and monitoring. They work with your tenant's data only to
  handle a request you raised, and that access is role-based and logged.
- *(more)* **Can Private Cloud connect to our network?** Yes. Depending on your plan, we set up a
  dedicated VPN tunnel to your systems. On request, we also provide read-only access to metrics and
  Kubernetes dashboards under an NDA.
- *(more)* **What happens to my data when I leave?** In ThingsBoard Cloud, you export your data
  through the REST API, and we delete your tenant after cancellation. In Private Cloud, we prepare a
  full encrypted PostgreSQL/Cassandra dump; you have 60 days to download it, and then we
  permanently delete all backups and cluster data.

**On-premises** *(all hidden until Load more)*
- **Who is responsible for security in an on-premises deployment?** You run the infrastructure,
  network, patching, backups and recovery, and you keep full control over them. We are responsible
  for the product code, security fixes and the guides that help you configure the platform
  securely.
- **How do I get security fixes?** Security fixes ship in patch releases that need no environment
  or database changes, so you can upgrade within the same maintenance line without downtime. Fixed
  CVE IDs are listed in the release notes. For production, use the latest LTS line and a three-part
  tag such as 4.2.1-latest to receive hotfixes automatically.
- **Does an on-premises installation need internet access?** Only for licensing: the platform
  checks its license every hour over an outbound connection to license.thingsboard.io. Perpetual
  licenses can use the offline licensing add-on instead.
- **Where do I find security configuration guides?** In the Security section
  (`/docs/pe/user-guide/security/overview/`) of the documentation: password and lockout policies,
  2FA, OAuth 2.0, API keys, TLS for every protocol, the audit log and secrets storage.

**Data security** *(all hidden until Load more)*
- **Is my data encrypted?** Users and devices connect over TLS (HTTPS on 443, MQTTS on 8883, DTLS
  for CoAP and LwM2M). The platform encrypts stored secrets with AES-256 and stores user passwords
  as BCrypt hashes.
- **Can we enforce 2FA and single sign-on?** Yes. 2FA supports authenticator apps (TOTP), email,
  SMS and backup codes, and from version 4.3 you can require it for all users, for system
  administrators or for tenant administrators. Single sign-on works over OAuth 2.0 and OpenID
  Connect with Google, Azure AD, Okta, Keycloak, Auth0 and others. SAML and LDAP are not supported.
- **Is my data used to train AI models?** No. We never use customer data to train models, and
  customer data never goes into public AI services. Our use of AI follows a dedicated policy
  aligned with GDPR, the EU AI Act and the NIST AI RMF.
- **Who are your sub-processors?** The full list, with purpose and location for each vendor, is on
  the sub-processors page.

---

## 2. Compliance — `#/compliance`

- H1: **Compliance** (no lede)
- Two link cards: **ISO/IEC 27001:2022** — Information security management system — Certified ·
  9 Sep 2026; **ISO 9001:2015** — Quality management system — Certified · 9 Sep 2026.
- Fact table:

| | |
|---|---|
| Certification body | Swiss Approval North America (IAS-accredited, IAF MLA). Both certificates were issued on 9 September 2026 and are valid until 8 September 2027, within a three-year cycle that runs to 8 September 2029, with a surveillance audit every year. Verify them at swissapproval.ch/certificate-validator (https://swissapproval.ch/certificate-validator/). |
| Certified scope | Software design and development, maintenance, training, IT consulting services, support services, integration services; cloud services; software QA testing; software licensing. |
| Penetration testing | An independent penetration test runs every year. The latest, by DataArt, took place in February 2026, with a retest in March 2026. |
| Data centers | ThingsBoard Cloud and Private Cloud run in data centers with ISO 27001, PCI DSS and SOC 2 attestations (AWS for ThingsBoard Cloud; AWS, Azure or GCP for Private Cloud). |

- H3: **Building a compliant solution on ThingsBoard** (boxed)
  > You can certify the solution you build on ThingsBoard, for example to ISO/IEC 27001. Our ISO
  > certificates count as supplier evidence in your audit, and under NDA we share the Statement of
  > Applicability and audit reports. The platform gives you the controls auditors look for: access
  > control, an audit log, encryption in transit and a choice of data region, so you don't need to
  > build them from scratch.
  >
  > We meet privacy regulations through our own data protection program and declare our
  > compliance, for example:

  Two link cards: **GDPR** — Applied to all personal data we process — Self-declared; **CCPA** —
  California residents' privacy rights — Self-declared.

### 2a. ISO/IEC 27001:2022 — `#/compliance/iso-27001`
Back link "← Compliance". Lede: Information security management system, including Amendment 1:2024.

| | |
|---|---|
| Status | *Certified.* Issued 9 September 2026 by Swiss Approval North America. |
| Registration No | 372-02-270-00460 |
| Validity | 9 September 2026 – 8 September 2027, within a three-year cycle running to 8 September 2029, with annual surveillance audits. Verify the certificate (swissapproval.ch). |
| Statement of Applicability | 93 Annex A controls: 91 implemented, 1 implemented partially (A.8.12) and 1 not applicable (A.8.30). Available under NDA. |
| What it covers | Our management system, meaning how we build, maintain and support the software. It doesn't certify the product itself, and it doesn't cover your own installation. |
| For your vendor assessment | You can use the certificate and its scope as supplier evidence in your own ISMS (A.5.19–A.5.23). We share the Statement of Applicability and audit reports under NDA. |

Related: Statement of Applicability · Internal audit report (document pages).

### 2b. ISO 9001:2015 — `#/compliance/iso-9001`
Back link "← Compliance". Lede: Quality management system, run as one integrated system together
with information security.

| | |
|---|---|
| Status | *Certified.* Issued 9 September 2026 by Swiss Approval North America. |
| Registration No | 372-02-100-02170 · IAF Code 33 |
| Validity | 9 September 2026 – 8 September 2027, within a three-year cycle running to 8 September 2029, with annual surveillance audits. Verify the certificate. |
| For procurement | Use it as supplier evidence under clause 8.4 of your own QMS. |

### 2c. GDPR — `#/compliance/gdpr`
Back link "← Compliance". Lede: We meet GDPR requirements through our own privacy program and
declare our compliance.

| | |
|---|---|
| Scope of application | We apply data minimization and storage limitation to all personal data we process, wherever the person lives. |
| Legal basis | When we process data on your behalf, the Data Processing Addendum applies. |
| Data subject requests | We handle requests to access, correct or delete data under a documented procedure. Write to security@thingsboard.io. |
| Breach notification | Breaches go through our incident process. We notify affected parties and regulators as the law and our contracts require. |

Related: DPA (`/products/paas/dpa/`) · Privacy Policy (`/products/paas/privacy-policy/`) · Sub-processors.

### 2d. CCPA — `#/compliance/ccpa`
Back link "← Compliance". Lede: We meet CCPA requirements through the same privacy program and
declare our compliance.

| | |
|---|---|
| Consumer rights | We handle requests to know, delete and correct personal information through the same procedure as GDPR requests. Write to security@thingsboard.io. |
| Sale of data | We do not sell personal information. |

---

## 3. Documents — `#/documents`

- H1: **Documents**. Lede: Public documents are available right away. Documents marked NDA are
  shared within two business days after we sign a mutual NDA.
- Filter field "Filter documents…" and buttons **All · Public · NDA · Planned · Questionnaires**
  (Questionnaires filters by category, the others by access).
- One flat list of all 20 documents: name, category, access chip, and "Details →" (or "View ↗"
  for a document that is a page). Empty state: "Nothing matches that filter."

### 3a. A document — `#/documents/<slug>`
Back link "← Documents". H1 = name; lede = description; table **Access** (chip, plus " — released
after a mutual NDA, usually within two business days" or " — not published yet"), **Category**,
**Version**, **Owner**. One button:
- Public: **Download** (the file, or a dead link if there is none)
- NDA: **Request via NDA** → contact form, subject "Request documents under NDA", that document ticked
- Planned: **Ask about it** → contact form, subject "Security questionnaire or vendor assessment"
  (questionnaires) or "Other security question", message prefilled "I'm interested in your
  <name>. When will it be available?"

---

## 4. Product security — `#/product`

H1: **Product security**. Lede: How the platform protects device connections, credentials and
secrets, so you don't have to build this layer yourself.

Rows (title, status chip, text, docs link) — see [Product security](#product-security-rows).

Note: Full documentation for every feature is in the Security section
(`/docs/pe/user-guide/security/overview/`) of the docs.

## 5. Data security — `#/data`

H1: **Data security**. Lede: What happens to the data your devices send to the platform, from the
moment it arrives until you delete it.

Rows — see [Data security](#data-security-rows). Related: Sub-processors → · Cloud and Private Cloud →

## 6. Access control — `#/access`

Back link "← Trust Center". H1: **Access control**. Lede: Who can sign in, what each user can see,
and a record of what they did. We built these controls into the platform; you decide how strictly
to apply them in your tenant.

Rows — see [Access control](#access-control-rows).

## 7. Dev security — `#/appsec`

Back link "← Trust Center". H1: **Dev security**. Lede: How we build, test and release the software
you run. These practices come from years of delivering production IoT solutions on our own
platform.

Rows — see [Dev security](#dev-security-rows). Note: Found a weakness in our software? Report it
privately, and we'll respond within three business days.

---

## 8. Sub-processors — `#/subprocessors`

H1: **Sub-processors**. Lede: These vendors may have access to customer or personal data. Each one
passes a security assessment before we start working with it, and we sign a DPA whenever personal
data is involved.

| Vendor | Purpose | Location |
|---|---|---|
| Amazon Web Services (AWS) | Hosting for ThingsBoard Cloud and Private Cloud | North America or EU for ThingsBoard Cloud; North America, EU or APAC for Private Cloud |
| Google Cloud | Private Cloud hosting, on request | The region you choose |
| Microsoft Azure | Private Cloud hosting, on request | The region you choose |
| netcup | Development instances for Private Cloud | Germany |
| Cloudflare | DNS, CDN and DDoS protection | Global network (USA) |
| Google Workspace | Email, documents, identity | USA |
| Microsoft 365 | Email, documents, identity | USA |
| Atlassian | Issue tracking | USA, Australia |
| Slack | Internal communication | USA |
| PeopleForce | HR management | United Kingdom |
| Pipedrive | CRM | Estonia |
| Stripe | Payments | USA, Ireland |
| QuickBooks (Intuit) | Accounting | USA |
| OpenAI | AI services under the AI Services Policy | USA |
| Google (Gemini) | AI services under the AI Services Policy | USA |
| Anthropic | AI services under the AI Services Policy | USA |

> Location means the hosting region for infrastructure providers and the country of the
> contracting entity for other vendors; exact data regions are set out in each vendor's DPA. We
> notify customers of material changes to this list, as set out in the DPA. Related: DPA

---

## 9. ThingsBoard Cloud and Private Cloud — `#/cloud`

Back link "← Trust Center" (to the hub's Cloud and on-premises section). H1: **ThingsBoard Cloud
and Private Cloud**. Lede:
> In both models, ThingsBoard runs the platform and the infrastructure under it. ThingsBoard Cloud
> is multi-tenant; Private Cloud is a dedicated single-tenant instance in the environment and
> region you choose. In both cases, you focus on your solution, and we take care of running it. Our
> certifications and everything under Product security apply to both.

| | ThingsBoard Cloud | Private Cloud |
|---|---|---|
| Who runs it | ThingsBoard: infrastructure, patching, upgrades, monitoring and backups. | ThingsBoard, with upgrades in a window agreed with you. |
| Hosting | AWS (EKS) in two independent regions: North America (thingsboard.cloud) and EU (eu.thingsboard.cloud). | AWS by default; Azure or GCP on request. |
| Data residency | North America or EU; data never moves between regions. | North America, EU or APAC, chosen during onboarding. |
| Isolation | Every request is confined to its own tenant, and customers and entity groups narrow access further. | A dedicated single-tenant cluster. |
| Encryption in transit | TLS preconfigured: HTTPS on 443, MQTTS on 8883. | TLS preconfigured: HTTPS on 443, MQTTS on 8883. |
| Network protection | Cloudflare DDoS protection, with rate limits set by plan. | Rate limits of 50 requests per second and 500 per minute per source IP. A dedicated VPN tunnel to your systems, depending on plan. |
| Backups | Daily, with point-in-time recovery. | Nightly snapshots in a separate cloud region, kept 7 days by default (longer on Enterprise). |
| High availability | Deployed across several availability zones: PostgreSQL in a multi-zone setup, Cassandra and Kafka with replication factor 3. | On Scale and Enterprise plans. Launch and Growth run as a single-node deployment. |
| Uptime | Live status at status.thingsboard.cloud and status.eu.thingsboard.cloud, also shown to tenant administrators in the UI. | Contractual SLA: 99.9% on Launch and Growth, 99.95% on Scale, custom on Enterprise. Monitored 24×7. |
| Data center certifications | AWS: ISO 27001, PCI DSS, SOC 2. | ISO 27001 and PCI DSS certified data centers. |
| Data retention (TTL) | 30 to 365 days, depending on plan. | 365 days by default; you can change it. |
| Infrastructure access | Authorized ThingsBoard engineers only, with regular audits and monitoring. They work with your tenant's data only to handle a request you raised; access is role-based and logged. | Same text, plus: You don't get a sysadmin account by default; read-only metrics and Kubernetes dashboards are available under NDA. |
| Leaving | You export your data through the REST API; we delete your tenant after cancellation. | We prepare a full encrypted PostgreSQL/Cassandra dump. You have 60 days to download it; then we permanently delete all backups and cluster data. |

**Documents for ThingsBoard Cloud** (H3; Document · Access · action)

| Document | Access | Action |
|---|---|---|
| Terms of Use (North America and EU) | Public | Open ↗ `/products/paas/terms-of-use/` |
| Privacy Policy (North America and EU) | Public | Open ↗ `/products/paas/privacy-policy/` |
| Data Processing Addendum (DPA) | Public | Open ↗ `/products/paas/dpa/` |
| Sub-processors | Public | Open → Sub-processors |
| AWS attestations (SOC 2, ISO 27001) | Public | Open ↗ https://aws.amazon.com/artifact/ |
| Business Continuity Plan | NDA | Request 🔒 → contact form (bcp-drp) |
| Backup policy (frequency, retention) | NDA | Request 🔒 → contact form (backup-policy) |

**Documents for Private Cloud** (H3). Intro: Same set as ThingsBoard Cloud, with its own SBOM,
privacy terms and DPA, and no tracking. Only the differences are listed.

| Document | Access | Action |
|---|---|---|
| Private Cloud SLA and service description (uptime formula, service credits, exclusions) | Public | Download ↓ (dead link) |
| DPA for Private Cloud | NDA | Request 🔒 → contact form (dpa-private-cloud) |
| Cluster architecture and read-only metrics | NDA | Request 🔒 → contact form (private-cloud-architecture) |
| Data center certifications (ISO 27001, PCI DSS) | Public | AWS ↗ https://aws.amazon.com/compliance/programs/ · Azure ↗ https://learn.microsoft.com/en-us/azure/compliance/ · GCP ↗ https://cloud.google.com/security/compliance |

---

## 10. On-premises — `#/onprem`

Back link "← Trust Center" (to the hub's Cloud and on-premises section). H1: **On-premises**. Lede:
> You run the platform on your own infrastructure and keep full control over it. We are
> responsible for the product code, security fixes and the guides below. Our certificates cover how
> we build and support the software; your installation is your own scope.

| | |
|---|---|
| You run | Infrastructure, network perimeter, OS and database patching, platform upgrades, TLS certificates, backups, high availability and recovery. |
| Built into the product | 2FA, OAuth 2.0 single sign-on, role-based access control, API keys, an audit log, AES-256 secrets storage, and X.509 certificates with mutual TLS for devices. |
| Security fixes | Patch releases with no environment or database changes, so you can apply them without downtime. Fixed CVE IDs are listed in the release notes. Pin a three-part tag such as 4.2.1-latest to receive hotfixes automatically. |
| Release support | LTS releases: 18 months. Standard releases: 6 months. For production, use the latest LTS line. |
| Network requirements | An outbound connection to license.thingsboard.io for the hourly license check. Perpetual licenses can use the offline licensing add-on instead. |

**Security configuration guides** (H3; 14 links, each labelled "Docs ↗")

| Guide | Docs path |
|---|---|
| Password, lockout and session settings | `/docs/pe/user-guide/security/` |
| Two-factor authentication | `/docs/pe/user-guide/security/two-factor-authentication/` |
| OAuth 2.0 single sign-on | `/docs/pe/user-guide/security/oauth-2-support/` |
| API keys | `/docs/pe/user-guide/security/api-keys/` |
| HTTPS for the web UI and REST API | `/docs/pe/reference/http-api/getting-connected/#https-tls` |
| Custom domains | `/docs/pe/user-guide/security/domains/` |
| MQTT transport security | `/docs/pe/reference/mqtt-api/getting-connected/` |
| HTTP transport security | `/docs/pe/reference/http-api/getting-connected/` |
| CoAP transport security | `/docs/pe/reference/coap-api/getting-connected/` |
| LwM2M transport security | `/docs/pe/reference/lwm2m-api/getting-started/` |
| SNMP transport security | `/docs/pe/reference/snmp-api/getting-connected/` |
| Audit log | `/docs/pe/user-guide/security/audit-log/` |
| Secrets storage | `/docs/pe/user-guide/security/secrets-storage/` |
| Security overview | `/docs/pe/user-guide/security/overview/` |

**Documents** (H3)

| Document | Access | Action |
|---|---|---|
| Installation guides (Docker, Kubernetes, Ubuntu, cloud marketplaces) | Public | Open ↗ `/docs/pe/installation/` |
| Release policy | Public | Open ↗ `/docs/pe/releases/release-policy/` |
| Release notes | Public | Open ↗ `/docs/pe/releases/releases-table/` |
| License server network requirements | Public | Open ↗ (dead link) |
| EULA and license terms | Public | Open ↗ (dead link) |
| Support policy | Public | Open ↗ (dead link) |

Note: ThingsBoard Edge, IoT Gateway, TBMQ, Trendz and the mobile apps split responsibility
differently. Write to security@thingsboard.io (mailto, subject "Per-product security breakdown")
for a breakdown by product.

---

## 11. Commitment and responsibility — `#/commitments`

H1: **Commitment and responsibility**. Lede: What we commit to, and what ThingsBoard handles in each
deployment model.

**Our commitments** (H3)

| | |
|---|---|
| Documents under NDA | Within **two business days** after we sign a mutual NDA. |
| Security questionnaires | We give you the information you need to complete your security questionnaire. |
| Support | **ThingsBoard Cloud:** community support on GitHub for Free and Prototype; help desk on Pilot; priority help desk on Startup and Business. Replies within 24 hours, 8:00–20:00 EET, Monday to Friday. **Private Cloud:** Support Portal on every plan; priority channel and engineering support on Scale and Enterprise; a dedicated customer success engineer on Enterprise. **On-premises:** community support on Maker and Prototype; help desk on Pilot; priority help desk on Startup (replies within 36 hours) and Business (within 12 hours). Perpetual licenses include the first year of support. |
| Uptime: Private Cloud | Contractual SLA: **99.9%** on Launch and Growth, **99.95%** on Scale, custom on Enterprise. |
| Leaving Private Cloud | A full encrypted export of your data. You have **60 days** to download it; then we permanently delete all backups and cluster data. |

**What ThingsBoard handles** (H3; matrix: ThingsBoard Cloud · Private Cloud · On-premises)

| | Cloud | Private Cloud | On-premises |
|---|---|---|---|
| ***Product*** | | | |
| Secure development, testing and product fixes | ✓ ThingsBoard | ✓ ThingsBoard | ✓ ThingsBoard |
| Security features: 2FA, SSO, RBAC, audit log, secrets storage | Built in, managed by you | Built in, managed by you | Built in, managed by you |
| ***Infrastructure and operations*** | | | |
| Data center security, through our cloud providers | ✓ ThingsBoard | ✓ ThingsBoard | You |
| Hosting region | ✓ ThingsBoard — North America or EU | ✓ ThingsBoard — The region you need | You |
| Network perimeter, firewall, DDoS protection | ✓ ThingsBoard | ✓ ThingsBoard | You |
| OS, Kubernetes and database patching | ✓ ThingsBoard | ✓ ThingsBoard | You |
| Platform upgrades and security patches | ✓ ThingsBoard | ✓ ThingsBoard | You |
| TLS certificates on platform endpoints | ✓ ThingsBoard | ✓ ThingsBoard | You |
| Capacity, scaling and high availability | ✓ ThingsBoard | ✓ ThingsBoard | You |
| Backups and restore | ✓ ThingsBoard | ✓ ThingsBoard | You |
| Disaster recovery and business continuity | ✓ ThingsBoard | ✓ ThingsBoard | You |
| Infrastructure monitoring and alerting | ✓ ThingsBoard | ✓ ThingsBoard | You |
| Platform sysadmin account and platform-wide security settings | ✓ ThingsBoard | ✓ ThingsBoard | You |
| Hardening the deployment | ✓ ThingsBoard | ✓ ThingsBoard | You |

**Built for you to configure** (box)
> We built these controls into the platform, so you can tune security to your own needs in every
> deployment instead of building it from scratch:
- Manage users, roles and access reviews in your tenant
- Turn on 2FA and single sign-on
- Issue API keys and integration credentials
- Choose device credentials, provisioning and transport security
- Decide what rule chains and integrations send to third parties
- Control which dashboards are public
- Choose which data you upload and how you classify it
- Set data retention within your plan limits
- Export your data at any time
- Follow activity in the audit log
- Meet your industry's requirements, such as HIPAA or 21 CFR Part 11

Note: the same per-product line as On-premises (Edge, IoT Gateway, TBMQ, Trendz, mobile apps →
security@thingsboard.io).

---

## 12. Trust Center contact form — `#/contact`

H1 (centered): **Trust Center contact form**. Lede: Ask about security, compliance or privacy, or
request documents under NDA. Note: Found a vulnerability? Use the vulnerability report form instead.

Fields (* = required):
- First name * · Last name *
- Work email * · Company *
- Subject * (select, "Select a subject") — options in [Datasets](#contact-subjects)
- **Documents you need *** (fieldset, only for "Request documents under NDA"): a checkbox per NDA
  document (13 from the library + "DPA for Private Cloud" + "Private Cloud cluster architecture and
  read-only metrics"). Hint: We send you our mutual NDA first. Once it's signed, you get the
  documents within two business days.
- Message * (optional for "Request documents under NDA" and "Sub-processor change notifications";
  its placeholder follows the subject)
- Button **Submit**. Beside it: We use these details only to answer your request. See our Privacy
  Policy (`/products/paas/privacy-policy/`).

Prefill: `#/contact/<subject>/<doc>` selects the subject; with `nda` it ticks that document, with
another subject it prefills the message "I'm interested in your <name>. When will it be available?"

Validation messages: "Please fill in the highlighted fields." · "Please enter a valid work email and
fill in any other highlighted fields." · "Choose at least one document."

Thank-you state: **Thank you, <first name>!** then one of:
- NDA: We'll send our mutual NDA to <email>. Once it's signed, you'll get the documents within two
  business days.
- Sub-processor notifications: We'll email <email> when our list of sub-processors changes.
- Otherwise: We'll reply to <email>.

Then "Draft: this form isn't connected yet, so nothing was sent." and **Send another request**.

---

## 13. Report a vulnerability — `#/report-vulnerability`

H1 (centered): **Report a vulnerability**. Lede: Found a security issue in a ThingsBoard product or
service? Tell us privately, so we can fix it before anyone can exploit it.

Two boxes:
- **What happens next** — 1. We reply within three business days with a plan to investigate.
  2. We keep you updated until the fix is released. 3. Fixed CVE IDs are listed in the release notes.
- **Before you test** — Use your own installation or your own Cloud account. · Don't access, change
  or delete other people's data. · Don't run denial-of-service or load tests against ThingsBoard
  Cloud. · Keep the details private until the fix is out.

Note: Not a security issue? Report other bugs on GitHub
(https://github.com/thingsboard/thingsboard/issues), and send security or compliance questions
through the contact form.

Form, in three groups:
- **About you** — Name or handle · Email * · Company or affiliation
- **The vulnerability** — Affected product * (select) · Version or URL * ("For example 4.2.1, or the
  Cloud URL") · Vulnerability type * (select) · Severity, in your view (Not sure / Critical / High /
  Medium / Low) · Summary * (max 160 characters; "For example: a customer user can read another
  customer's devices through the REST API") · Steps to reproduce * ("1. … 2. … Include requests,
  payloads, error messages and screenshots.") · Impact * ("What an attacker can do, and what access
  they need first: none, a customer user, a tenant administrator or device credentials.") · CVSS
  vector ("CVSS:3.1/AV:N/AC:L/…") · Attachments (multiple files; "Screenshots, proof-of-concept code
  or HTTP captures.")
- **Disclosure** — ☐ The issue is already public, for example in a blog post, a CVE or a forum
  thread · ☐ I've seen it exploited in the wild · Planned publication date (date; "Only if you plan to
  publish your findings.") · Credit (Credit me by the name above / Keep me anonymous) · ☐ * I'll keep
  this report confidential until the fix is released or we agree on a publication date.
- Button **Submit report**. Beside it: Prefer email? Write to security@thingsboard.io (mailto,
  subject "Vulnerability report").

Validation: "Please fill in the highlighted fields." · "Please enter a valid email and fill in any
other highlighted fields." · "Please confirm you will keep the report confidential."

Thank-you state: **Thank you[, <name>]!** We'll reply to <email> within three business days with a
plan to investigate, and keep you updated until the fix is released. Then the draft note and
**Report another issue**.

---

## Datasets

### Documents

`Group` is the hub group (G&C = Governance & compliance, S&D = Security & development, L&P = Legal &
privacy, R&R = Reports & resilience); `—` means the document appears only on the Documents page.

| Document | Category | Access | Version | Owner | Group | Opens |
|---|---|---|---|---|---|---|
| Information Security Policy | Governance | NDA | v1.2 | IMS Manager | G&C | detail page |
| ISO/IEC 27001:2022 certificate | Compliance | Public | 09.09.2026 | Swiss Approval North America | G&C | Google Drive file |
| ISO 9001:2015 certificate | Compliance | Public | 09.09.2026 | Swiss Approval North America | G&C | Google Drive file |
| Statement of Applicability | Compliance | NDA | v1.0 | IMS Manager | G&C | detail page |
| Risk assessment and treatment report | Compliance | NDA | v1.1 | IMS Manager | G&C | detail page |
| Secure Development Policy | Security | NDA | v1.0 | CTO | S&D | detail page |
| Change Management Procedure | Security | NDA | v1.0 | CTO | S&D | detail page |
| Incident Management Procedure | Security | NDA | v1.0 | IMS Manager | S&D | detail page |
| Supplier Security Policy | Security | NDA | v1.0 | Legal Counsel | S&D | detail page |
| AI Services Policy | Security | NDA | v1.0 | IMS Manager | S&D | detail page |
| Privacy Policy (ThingsBoard Cloud) | Legal | Public | current | Legal Counsel | L&P | `/products/paas/privacy-policy/` |
| Data Processing Addendum (DPA) | Legal | Public | current | Legal Counsel | L&P | `/products/paas/dpa/` |
| Sub-processor list | Legal | Public | living | IMS Manager | L&P | Sub-processors page |
| Privacy Policy (Product Data Protection Policy) | Legal | NDA | v1.0 | Legal Counsel | L&P | detail page |
| Penetration test executive summary | Reports | NDA | Mar 2026 | CTO | R&R | detail page |
| Internal audit report 2026 | Reports | NDA | Jul 2026 | IMS Manager | R&R | detail page |
| Business Continuity Plan | Resilience | NDA | v1.0 | IMS Manager | R&R | detail page |
| Backup Policy | Resilience | NDA | v1.0 | IMS Manager | R&R | detail page |
| CAIQ Lite | Questionnaires | Planned | — | IMS Manager | — | detail page |
| SIG Lite | Questionnaires | Planned | — | IMS Manager | — | detail page |

Descriptions (the detail page's lede):
- **Information Security Policy** — The policy behind our information security management system:
  objectives, roles, our approach to risk and the policy framework. Approved by the CEO and shared
  with all staff and contractors.
- **ISO/IEC 27001:2022 certificate** — Registration No 372-02-270-00460, issued 9 September 2026,
  valid to 8 September 2027. Verify at swissapproval.ch/certificate-validator.
- **ISO 9001:2015 certificate** — Registration No 372-02-100-02170 (IAF Code 33), issued
  9 September 2026, valid to 8 September 2027. Verify at swissapproval.ch/certificate-validator.
- **Statement of Applicability** — All 93 Annex A controls with their status and justification:
  91 implemented, 1 implemented partially (A.8.12, data leakage prevention) and 1 not applicable
  (A.8.30).
- **Risk assessment and treatment report** — The scoring method, every assessed risk, treatment
  decisions and each residual risk accepted by management.
- **Secure Development Policy** — Security across the engineering lifecycle: mandatory review,
  separate environments, weekly code and dependency scanning, and change control.
- **Change Management Procedure** — How a change reaches production: request, impact assessment,
  approval and tracking in Jira.
- **Incident Management Procedure** — Reporting channels, severity classification, registration and
  escalation timings, evidence handling.
- **Supplier Security Policy** — NDA before any access, security clauses in contracts, scored
  supplier evaluation with a minimum security rating, and annual supplier review.
- **AI Services Policy** — Which data may reach AI services and how we control it, aligned with
  GDPR, the EU AI Act and the NIST AI RMF.
- **Privacy Policy (ThingsBoard Cloud)** — What personal data ThingsBoard Cloud processes in North
  America and the EU, on what basis, for how long, and how you exercise your rights.
- **Data Processing Addendum (DPA)** — Contractual data protection terms: processor obligations,
  sub-processor rules, transfer mechanisms and breach notification.
- **Sub-processor list** — Every vendor that may access customer or personal data, with its purpose,
  location and assessment status.
- **Privacy Policy (Product Data Protection Policy)** — Our internal rules for protecting personal
  data, including privacy by design.
- **Penetration test executive summary** — Scope, methodology (OWASP, OSSTMM, NIST SP 800-115) and an
  overview of findings and remediation. We don't share the full report with anyone.
- **Internal audit report 2026** — Full-scope audit of both standards by an independent contractor
  (30 June – 1 July 2026): no major and 3 minor nonconformities, with corrective actions and
  deadlines.
- **Business Continuity Plan** — Continuity scenarios for ThingsBoard Cloud, the crisis team,
  recovery procedures and the measured results of the last exercise.
- **Backup Policy** — Encryption, separation from primary systems, archiving media and deadlines, and
  the annual restore test.
- **CAIQ Lite** — Our self-assessment against the Cloud Security Alliance's Consensus Assessment
  Initiative Questionnaire (Lite).
- **SIG Lite** — Our answers to the Standardized Information Gathering (Lite) questionnaire.

Chip labels by access: Public / NDA / Planned. Detail-page actions: Download / Request via NDA /
Ask about it.

### Topic rows

Status chips: **Built in** (green), **Configurable** (amber), **Depends on deployment** (grey).

#### Product security rows

| Row | Status | Text | Docs |
|---|---|---|---|
| Secrets storage | Built in | An AES-256 encrypted vault for API tokens, passwords and certificates used in integrations and rule chains, so credentials don't sit in plain configuration. | `/docs/pe/user-guide/security/secrets-storage/` |
| Device authentication | Built in | **MQTT:** access token, MQTT Basic credentials or X.509 certificate. **HTTP:** access token. **CoAP:** access token or X.509 certificate. **LwM2M:** pre-shared key, raw public key or X.509 certificate. **SNMP:** community string (v1/v2c) or USM credentials (v3). **Mutual TLS:** on MQTT, CoAP and LwM2M, both the device and the server authenticate with X.509 certificates. For a device fleet, we recommend X.509 with a certificate chain. | `/docs/pe/user-guide/security/overview/` |
| Encrypted device transport | Configurable | MQTT over TLS on port 8883, HTTP over TLS on 443, CoAP over DTLS on 5684, LwM2M over DTLS on 5686 and 5688, and SNMPv3 with USM authentication and encryption. | `/docs/pe/reference/mqtt-api/getting-connected/` |
| Custom domains with automatic SSL | Built in | Bind your own domain name; the platform provisions the SSL certificate automatically. | `/docs/pe/user-guide/security/domains/` |

#### Data security rows

| Row | Status | Text |
|---|---|---|
| Data ownership | Built in | Customer data belongs to the customer. We process it on your behalf under the DPA and never use it to train AI models. |
| Tenant isolation | Built in | **ThingsBoard Cloud:** every request is confined to its own tenant; customers and entity groups narrow access further. **Private Cloud:** a dedicated single-tenant cluster. **On-premises:** your own installation. |
| Encryption in transit | Configurable | Users and devices connect over TLS: HTTPS on 443, MQTTS on 8883, DTLS for CoAP and LwM2M. Unencrypted device connection is available by default for testing or PoC purposes and can be disabled. |
| Secrets and passwords | Built in | Stored secrets are encrypted with AES-256, and user passwords are stored as BCrypt hashes in every deployment. |
| Storage region | Depends on deployment | **ThingsBoard Cloud:** North America or EU; data never moves between regions. **Private Cloud:** North America, EU or APAC. **On-premises:** wherever you deploy. |
| Backups | Depends on deployment | **ThingsBoard Cloud:** daily, with point-in-time recovery. **Private Cloud:** nightly snapshots in a separate cloud region, kept 7 days by default. **On-premises:** you run backups. |
| Data retention | Configurable | **ThingsBoard Cloud:** 30 to 365 days, depending on plan. **Private Cloud:** 365 days by default; you can change it. **On-premises:** you set it. |
| Export | Built in | **Every deployment:** telemetry, entities and dashboards are available through the REST API at any time. **Private Cloud:** when you leave, we prepare a full encrypted PostgreSQL/Cassandra dump of your data. |
| Deletion | Depends on deployment | **ThingsBoard Cloud:** we delete your tenant after cancellation. **Private Cloud:** 60 days after cancellation, we permanently delete all backups and cluster data. GDPR erasure requests are completed within 30 days. **On-premises:** you control deletion. |
| Access by ThingsBoard staff | Depends on deployment | **ThingsBoard Cloud and Private Cloud:** only authorized ThingsBoard engineers can access the infrastructure, with regular audits and monitoring. They work with your tenant's data only to handle a request you raised; access is role-based and logged. **On-premises:** we have no access to your installation. |
| Data center certifications | Built in | ThingsBoard Cloud and Private Cloud run in data centers with ISO 27001, PCI DSS and SOC 2 attestations. |

#### Access control rows

| Row | Status | Text | Docs |
|---|---|---|---|
| Two-factor authentication | Built in | TOTP authenticator apps, email, SMS and backup codes. System administrators set the platform policy, and tenant administrators can apply their own. From version 4.3, you can require 2FA for all users, for system administrators only, or for tenant administrators of selected tenants. Code lifetime, resend limits and lockout after failed attempts are configurable. | `/docs/pe/user-guide/security/two-factor-authentication/` |
| Single sign-on | Built in | OAuth 2.0 and OpenID Connect with Google, Auth0, Keycloak, Okta, Azure AD and other identity providers, so account lifecycle stays in your directory. SAML and LDAP are not supported. | `/docs/pe/user-guide/security/oauth-2-support/` |
| API keys | Built in | Long-lived credentials for integrations, scripts and automation, so you don't share a user's password. | `/docs/pe/user-guide/security/api-keys/` |
| Role-based access control | Built in | Roles and entity groups scope each user to their own devices, assets and dashboards: a customer, an operator and an analyst each see only what belongs to them. | — |
| Session lifetimes | Configurable | You set how long access and refresh tokens (JWT) stay valid. The defaults are 2.5 hours and 7 days; we recommend shortening both. | `/docs/pe/user-guide/security/` |
| Audit log | Built in | The platform records user actions, and you can send the log to an external system such as your SIEM. | `/docs/pe/user-guide/security/audit-log/` |
| Password and lockout policy | Configurable | Minimum length, complexity and lockout after failed attempts, set by the administrator. | `/docs/pe/user-guide/security/` |
| Password expiration | Configurable | You can make passwords expire after a set period if your policy requires it. NIST SP 800-63B advises against scheduled rotation, so we recommend it only where a regulator asks for it. | `/docs/pe/user-guide/security/` |

#### Dev security rows

| Row | Status | Text | Docs |
|---|---|---|---|
| Code review and protected branches | Built in | Every change is reviewed before merge, and branch protection keeps unreviewed code out. | — |
| Separate environments | Built in | Development, test and production run separately, and production data is never used in tests. | — |
| Code analysis (SAST) | Built in | Snyk Code scans LTS branches every week. | — |
| Dependency scanning | Built in | Snyk Open Source checks third-party dependencies every week. | — |
| Container scanning | Built in | Docker Scout and Snyk Container scan our container images. | — |
| Change management | Built in | Every change goes through a request, an impact assessment and an approval, tracked in Jira. | — |
| Independent penetration testing | Built in | An external tester checks the platform every year, following OWASP, OSSTMM and NIST SP 800-115. The latest test, by DataArt, ran in February 2026, with a retest in March 2026. | — |
| Security fixes and CVEs | Built in | Security fixes ship in patch releases that need no environment or database changes. Fixed CVE IDs are listed in the Security section of the release notes. | `/docs/pe/releases/releases-table/` |
| Release support | Built in | LTS releases are supported for 18 months, standard releases for 6 months. | `/docs/pe/releases/release-policy/` |

### Contact subjects

| Key | Label | Message placeholder |
|---|---|---|
| nda | Request documents under NDA | Optional: the project or vendor assessment you need them for. |
| questionnaire | Security questionnaire or vendor assessment | Which questionnaire or framework (for example CAIQ, SIG or your own) and your deadline. |
| compliance | Compliance and certifications | Your question about our ISO certificates, their scope or using them as supplier evidence. |
| privacy | Privacy and data protection (GDPR, CCPA, DPA) | Your question about personal data, the DPA, GDPR or CCPA. |
| dsr | Data subject request (access, correction, deletion) | Which account or data the request is about, and what you want us to do. |
| subprocessors | Sub-processor change notifications | Optional: anything else we should know. |
| cloud | ThingsBoard Cloud and Private Cloud security | Your question about hosting, data residency, backups, the SLA or network setup. |
| other | Other security question | How can we help? |

### Vulnerability form options

- **Affected product:** ThingsBoard (self-hosted) · ThingsBoard Cloud (thingsboard.cloud,
  eu.thingsboard.cloud) · ThingsBoard Private Cloud · ThingsBoard Edge · ThingsBoard IoT Gateway ·
  TBMQ · Trendz Analytics · ThingsBoard mobile apps · Website or another ThingsBoard service (for
  example thingsboard.io or the license server) · Not sure
- **Vulnerability type:** Authentication or session management · Access control or tenant isolation
  bypass · Injection (SQL, NoSQL, command or template) · Rule engine script sandbox escape (TBEL or
  JavaScript) · Cross-site scripting (XSS) · Cross-site request forgery (CSRF) · Server-side request
  forgery (SSRF) · Remote code execution · Device connectivity (MQTT, CoAP, LwM2M, HTTP or SNMP) ·
  Sensitive data exposure or weak cryptography · Denial of service · Vulnerable third-party
  dependency · Other
- **Severity:** Not sure · Critical · High · Medium · Low

## Off-site links in the draft

- https://swissapproval.ch/certificate-validator/ (Compliance, ISO 27001, ISO 9001)
- Google Drive files for the two ISO certificates
- https://aws.amazon.com/artifact/, https://aws.amazon.com/compliance/programs/,
  https://learn.microsoft.com/en-us/azure/compliance/, https://cloud.google.com/security/compliance
- https://github.com/thingsboard/thingsboard/issues (report page)
- Named in text without links: status.thingsboard.cloud, status.eu.thingsboard.cloud,
  license.thingsboard.io, security@thingsboard.io (linked only on On-premises, Commitments and the
  report form)

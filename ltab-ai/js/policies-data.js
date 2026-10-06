/* LTAB AI — regional legal data. Single source of truth for the consent
   banner, region-aware links, the Legal Center and the generated per-region
   source documents (tools/generate-policy-docs.js reads this file too).

   Every string here is a working template drafted in the site's plain-English
   voice, built from the regime facts listed per jurisdiction. Before going
   live, have it reviewed by qualified counsel in the relevant markets. */
(function(){
  const VERSION = '6 October 2026';

  /* site regions (same codes as common.js REGIONS) */
  const SITE_REGIONS = {
    US:'United States', CA:'Canada', UK:'Europe & UK', AE:'UAE',
    SG:'Singapore', MY:'Malaysia', AU:'Australia', NZ:'New Zealand',
  };

  /* site region code -> jurisdictions whose documents appear (first = default) */
  const REGION_JUR = { US:['US'], CA:['CA'], UK:['EU','UK'], AE:['AE'], SG:['SG'], MY:['MY'], AU:['AU'], NZ:['NZ'] };

  /* jurisdiction-specific facts and clauses */
  const JURISDICTIONS = {
    US: {
      label:'United States',
      laws:[
        ['State comprehensive privacy laws','California leads with the CCPA/CPRA; around twenty more states have their own versions (Virginia, Colorado, Connecticut, Texas, Oregon and others), each with access, deletion and correction rights.'],
        ['CCPA / CPRA (California)','Rights to know, delete, correct and opt out of sale or sharing; a right to limit the use of sensitive personal information; enforcement by the California Privacy Protection Agency and the state attorney general.'],
        ['COPPA','Parental consent before knowingly collecting data from children under 13. Our forms are not directed at children, and we do not knowingly collect their data.'],
        ['CAN-SPAM','Commercial email must be honest about who sent it, honest about the subject, and carry a working unsubscribe.'],
        ['State health-data laws','Laws such as Washington My Health My Data cover consumer health data. We do not request health data through this site.'],
      ],
      regulator:'Federal Trade Commission and your state attorney general; California matters may also go to the California Privacy Protection Agency.',
      regulatorUrl:'https://www.ftc.gov/',
      consentMode:'notice',
      rights:[
        'Know what personal information we hold and get a copy of it',
        'Delete personal information we hold about you, subject to legal record-keeping',
        'Correct inaccurate personal information',
        'Opt out of sale or sharing of personal information — we do not sell or share it today, and if that ever changes we will put a "Your Privacy Choices" link here',
        'Limit the use of sensitive personal information — we do not use it for this site',
        'No discrimination for exercising any of these rights',
      ],
      rightsTiming:'We answer verified requests within 45 days, free of charge.',
      transferNote:'Our engineering hub is in India. Transfers happen under the contract we sign with you, and we disclose below what leaves your browser.',
      retentionNote:'Enquiries: 24 months from our last contact, unless a services contract starts. Contracted work: the retention your contract sets. Consent records: while needed to honour your choice.',
      extras:{
        privacy:[
          'A single federal privacy law does not exist in the United States; obligations come from a patchwork of federal sector laws and state statutes. The strongest of them — the California Consumer Privacy Act as amended by the CPRA — is reflected in this policy so that California customers get California rights wherever in the US they are.',
        ],
        cookies:[
          'There is no federal cookie-consent law in the United States. Today this site sets only functional browser storage (your region choice, your form progress, your privacy choices) and no third-party advertising cookies. If we ever add cookies that qualify as a "sale" or "share" under California law, we will add a "Your Privacy Choices" opt-out link here first.',
        ],
        terms:[
          'Nothing in these terms limits any non-waivable right you have under your state\u2019s consumer laws, including California\u2019s.',
        ],
        declaration:[
          'Under California law, this notice lists the categories of personal information collected in the last twelve months: identifiers (name, email, phone number) and professional or enquiry information (your idea or product description, needs, timeline, budget). We do not sell or share personal information, and we have not sold or shared it.',
        ],
      },
    },
    CA: {
      label:'Canada',
      laws:[
        ['PIPEDA','The federal Personal Information Protection and Electronic Documents Act: meaningful consent, accountability for data that leaves the country, breach reporting to the Office of the Privacy Commissioner and to individuals where the breach creates a real risk of significant harm.'],
        ['Quebec Law 25','If you are in Quebec: your own transparency rights, portability in a structured format, de-indexing and erasure in some cases, and a privacy impact assessment before your data leaves Quebec.'],
        ['CASL','Canada\u2019s anti-spam law: we may send you commercial electronic messages only with express consent, or implied consent from an existing business relationship inside two years \u2014 every message carries who sent it and a working unsubscribe.'],
        ['Provincial laws','Alberta and British Columbia have their own private-sector statutes that substantially match PIPEDA.'],
      ],
      regulator:'Office of the Privacy Commissioner of Canada; in Quebec, the Commission d\u2019acc\u00e8s \u00e0 l\u2019information du Qu\u00e9bec.',
      regulatorUrl:'https://www.priv.gc.ca/en/',
      consentMode:'notice',
      rights:[
        'Access the personal information we hold about you',
        'Correct your personal information',
        'Withdraw your consent to future collection or use, subject to legal and contractual limits',
        'Add a written note where you disagree with a correction we declined',
        'In Quebec: a copy of your data in a structured, commonly used format; de-indexing or erasure in the cases the law names',
        'Complain to us first, then to the regulator named below \u2014 you never lose that right',
      ],
      rightsTiming:'We answer access and correction requests within 30 days, free of charge unless the request is manifestly excessive.',
      transferNote:'PIPEDA holds us accountable for personal information processed in our India engineering hub: the service provider must give comparable protection, and Quebec Law 25 requires an assessment before personal information leaves Quebec. Ask us for a copy of the assessment.',
      retentionNote:'Enquiries: 24 months from our last contact. Contracted work: the retention your contract sets, or as long as business records law requires.',
      extras:{
        privacy:[
          'If you interact with us from a business email address, some provincial private-sector statutes treat business-contact information more lightly; the protections in this policy apply in full anyway.',
        ],
        cookies:[
          'Canadian law does not regulate cookies directly; PIPEDA treats persistent identifiers as personal information when they identify you. Today this site sets only functional browser storage (your region choice, your form progress, your privacy choices) and no third-party advertising cookies.',
        ],
        terms:[],
        declaration:[
          'PIPEDA\u2019s form-of-consent model applies: this declaration is the information notice you read before deciding to send us anything. You can always refuse or withdraw \u2014 the form still works without optional fields, and withdrawal only stops future contact.',
        ],
      },
    },
    EU: {
      label:'Europe (EU/EEA)',
      laws:[
        ['GDPR','Regulation (EU) 2016/679: a lawful basis for every use, transparency, purpose limitation, data minimisation, accuracy, storage limits, integrity and accountability.'],
        ['ePrivacy Directive','Prior opt-in consent for any cookies or similar technologies that are not strictly necessary, plus rules for wsing electronic marketing.'],
        ['GDPR Chapter V transfer rules','Personal data may only leave the EEA under an adequacy decision, Standard Contractual Clauses, or another named safeguard. India holds no EU adequacy decision, so we rely on SCCs plus additional measures where the assessment requires them.'],
        ['EU AI Act transparency','From 2 August 2026, AI systems must be transparent to the people who interact with them. Where we produce interactive AI content for you, that content is labelled as required; we do not build systems that decide anything about you alone.'],
      ],
      regulator:'Your local Data Protection Authority \u2014 for example the Irish DPC, the French CNIL or the German state regulators \u2014 coordinated through the European Data Protection Board. A complaint to your authority is always available.',
      regulatorUrl:'https://www.edpb.europa.eu/about-edpb/about-edpb/members_en',
      consentMode:'opt-in',
      rights:[
        'Get a copy of your personal data (access)',
        'Have inaccurate data corrected',
        'Have your data erased ("right to be forgotten") where the law allows',
        'Restrict processing while we check a dispute',
        'Get your data in a portable, machine-readable format',
        'Object to processing based on our legitimate interests \u2014 we must stop unless we have compelling grounds',
        'Object at any time to direct marketing \u2014 we stop immediately',
        'Withdraw consent at any time, without affecting anything already lawfully done',
        'Not be subject to a decision made about you solely by automated means',
      ],
      rightsTiming:'We answer within one month, free of charge, and tell you within the same month if we need an extension.',
      transferNote:'Data is processed in our India engineering hub. The transfer relies on the European Commission\u2019s Standard Contractual Clauses (Module Three \u2014 controller to processor, or Module One where we receive directly), with a transfer impact assessment and supplementary measures. A copy of the clause set is available on request.',
      retentionNote:'Enquiries: 24 months from our last contact. Contracted work: the retention your contract sets. Consent records: three years, or until you withdraw, whichever is later.',
      extras:{
        privacy:[
          'For every processing activity we keep a lawful basis: sending a reply to your enquiry \u2014 our legitimate interest in answering you (GDPR art. 6(1)(f)) or consent where consent applies; delivering contracted services \u2014 performance of a contract (art. 6(1)(b)); improving this site \u2014 legitimate interests with balances documented; marketing where required \u2014 consent (art. 6(1)(a)).',
          'You will never lose a service because you chose not to give optional data. Only the fields marked as needed are needed.',
        ],
        cookies:[
          'GDPR and the ePrivacy Directive require prior, freely given, specific, informed opt-in consent for any non-essential cookie set in your browser \u2014 and withdrawal must be as easy as consent. Today this site sets only strictly necessary storage (your region choice, your form progress, your consent choice), so the banner asks one question and stores your answer. If we ever add analytics or marketing pixels, the banner will change to a full category choice and they will stay switched off until you switch them on.',
        ],
        terms:[],
        declaration:[
          'This is the "information to be provided" notice GDPR articles 13 and 14 refer to: it is given before or at the moment of collection, it names the purposes and lawful bases, and it travels with the data we hold.',
        ],
      },
    },
    UK: {
      label:'United Kingdom',
      laws:[
        ['UK GDPR','Regulation (EU) 2016/679 as retained and amended in UK law, applied by the Information Commissioner\u2019s Office (ICO).'],
        ['Data Protection Act 2018','The UK\u2019s own completion of the GDPR framework, including lawful-basis exemptions and law-enforcement processing.'],
        ['PECR','The Privacy and Electronic Communications Regulations: prior consent for non-essential cookies and rules for electronic marketing, including the "soft opt-in" for details collected during a sale.'],
        ['International transfers','From 21 March 2022 UK law allows the International Data Transfer Agreement (IDTA) or the UK Addendum to the EU SCCs plus a transfer risk assessment \u2014 that is what our India processing uses.'],
      ],
      regulator:'Information Commissioner\u2019s Office (ICO).',
      regulatorUrl:'https://ico.org.uk/make-a-complaint/',
      consentMode:'opt-in',
      rights:[
        'Get a copy of your personal data (access)',
        'Have inaccurate data corrected',
        'Have your data erased where the law allows',
        'Restrict processing while we check a dispute',
        'Get your data in a portable, machine-readable format',
        'Object to processing based on our legitimate interests',
        'Object at any time to direct marketing \u2014 we stop immediately',
        'Withdraw consent at any time, without affecting anything already lawfully done',
        'Not be subject to a decision made about you solely by automated means',
      ],
      rightsTiming:'We answer within one month, free of charge, and tell you within the same month if we need more time.',
      transferNote:'Data is processed in our India engineering hub under the UK Addendum to the EU Standard Contractual Clauses (or the IDTA) with a transfer risk assessment. Ask us for a copy.',
      retentionNote:'Enquiries: 24 months from our last contact. Contracted work: the retention your contract sets. Consent records: three years, or until you withdraw, whichever is later.',
      extras:{
        privacy:[
          'For every processing activity we keep a lawful basis: reply to your enquiry \u2014 legitimate interests, or consent where consent applies; deliver contracted services \u2014 performance of a contract; run this site \u2014 legitimate interests, documented and balanced; marketing \u2014 consent, or the PECR soft opt-in where your details were given in the course of a sale.',
        ],
        cookies:[
          'Under PECR, any cookie that is not strictly necessary needs your prior consent in Great Britain. Today this site sets only strictly necessary storage (region choice, form progress, consent choice), so the banner asks one question and stores the answer. Non-essential technologies stay switched off until you switch them on, and you can change your mind in one click.',
        ],
        terms:[],
        declaration:[
          'This is the information notice UK GDPR articles 13 and 14 require, given at the moment of collection, naming purposes and lawful bases.',
        ],
      },
    },
    AE: {
      label:'United Arab Emirates',
      laws:[
        ['Federal PDPL','Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL): consent-based processing, purpose limitation, breach notification duties and data-subject rights. The federal executive regulations have been in preparation since 2025, so some operational details await their publication.'],
        ['Free-zone regimes','Businesses in the Dubai International Financial Centre answer to the DIFC Data Protection Law 2020 (amended July 2025) and its Commissioner; those in Abu Dhabi Global Market answer to that regulator\u2019s Data Protection Regulations 2021 \u2014 both materially align with GDPR.'],
        ['Cross-border rules','PDPL Article 22: transfers need adequacy or another protective arrangement; the DIFC and ADGM versions are stricter and closer to the GDPR clause model.'],
      ],
      regulator:'UAE Data Office (federal) \u2014 or the Commissioner of Data Protection for DIFC entities.',
      regulatorUrl:'https://u.ae/en/information-and-services/justice-safety-and-the-law/data-protection',
      consentMode:'notice',
      rights:[
        'Access the personal data we hold about you',
        'Have inaccurate data corrected',
        'Have your data deleted where the law allows',
        'Object to processing and withdraw consent',
        'Have processing blocked while a dispute is checked',
      ],
      rightsTiming:'We answer within 30 days of a verified request.',
      transferNote:'Data is processed in our India engineering hub. The federal PDPL requires that the destination protects your data; our contracts carry that commitment in writing.',
      retentionNote:'Enquiries: 24 months from our last contact. Contracted work: the retention your contract sets.',
      extras:{
        privacy:[
          'UAE public-connectivity (onshore) data protection runs on consent and notification duties while the executive regulations are finalised; the two financial free zones already operate full GDPR-aligned regimes. If your business sits in a free zone, name it in your enquiry and the annex for that zone is what governs our processing of your people\u2019s data.',
        ],
        cookies:[
          'The PDPL treats persistent identifiers within personal data. Today this site sets only functional browser storage (region choice, form progress, consent choice) and no third-party advertising cookies.',
        ],
        terms:[],
        declaration:[],
      },
    },
    SG: {
      label:'Singapore',
      laws:[
        ['PDPA','The Personal Data Protection Act 2012 (as amended 2020): consent (express or deemed), purpose limitation, accuracy, protection, retention limitation, access and correction rights, and a Data Protection Officer who is contactable.'],
        ['Spam Control Act','Unsolicited commercial messages must carry labels, truthfulness and working unsubscribe routes.'],
        ['Transfer Limitation Obligation','Data may leave Singapore only where the recipient is bound to a standard of protection comparable to the PDPA \u2014 we meet it with contractual clauses (including the ASEAN Model Contractual Clauses).'],
      ],
      regulator:'Personal Data Protection Commission (PDPC).',
      regulatorUrl:'https://www.pdpc.gov.sg/complaints-and-reviews',
      consentMode:'opt-in',
      rights:[
        'Ask whether we hold your personal data and get a copy',
        'Ask us to correct an error or omission',
        'Withdraw consent to future collection, use or disclosure',
        'Receive a copy of your data on request where it is in electronic form',
        'Complain to the PDPC if we fail to meet the PDPA \u2014 we would rather hear it first',
      ],
      rightsTiming:'We answer access and correction requests within 30 days.',
      transferNote:'Data is processed in our India engineering hub under contractual clauses that bind the recipient to PDPA-comparable protection.',
      retentionNote:'Enquiries: 24 months from our last contact. Contracted work: the retention your contract sets. Consent records: while the consent remains relevant, then verifiable proof of withdrawal.',
      extras:{
        privacy:[
          'A Data Protection Officer is contactable at hello@ltab.ai for anything PDPA-related, including this policy.',
          'Under the PDPA we may also rely on legitimate interests for limited uses \u2014 notably security and business improvement \u2014 after balancing them against your expectations; you can ask us to explain any balance.',
        ],
        cookies:[
          'The PDPA treats persistent identifiers (including cookie identifiers) as personal data when they identify an individual. Today this site sets only functional browser storage (region choice, form progress, consent choice), so the banner asks before anything non-essential is ever switched on.',
        ],
        terms:[],
        declaration:[],
      },
    },
    MY: {
      label:'Malaysia',
      laws:[
        ['PDPA','The Personal Data Protection Act 2010 \u2014 as amended by the Personal Data Protection (Amendment) Act 2024, whose staged commencement finished through 2025. Key amendments now in force: mandatory appointment of a Data Protection Officer, mandatory data breach notification (from 1 June 2025), direct-consent and correction-rights changes, and tightened cross-border transfer rules under section 129 with new transfer guidelines (2025).'],
        ['Cross-border transfers','Under the amended section 129 and the 2025 guidelines, data may only leave Malaysia where the destination, or the safeguards in the guidelines, protect it to a standard not lower than the PDPA.'],
      ],
      regulator:'Personal Data Protection Department (JPDP / PDP Malaysia).',
      regulatorUrl:'https://www.pdp.gov.my/',
      consentMode:'opt-in',
      rights:[
        'Ask whether we hold your personal data and get a copy',
        'Ask us to correct an error or omission',
        'Withdraw consent to future processing',
        'Ask us to prevent processing likely to cause unwarranted damage or distress',
        'Complain to the regulator named below',
      ],
      rightsTiming:'We answer access and correction requests within 21 days as the amended PDPA provides.',
      transferNote:'Data is processed in our India engineering hub. The transfer relies on the safeguards permitted under the amended section 129 and the 2025 transfer guidelines (including contractual terms that keep protection no lower than the PDPA standard).',
      retentionNote:'Enquiries: 24 months from our last contact. Contracted work: the retention your contract sets.',
      extras:{
        privacy:[
          'A Data Protection Officer is contactable at hello@ltab.ai, as the amended PDPA requires.',
          'Where a security incident can cause harm, the amended PDPA obliges us to notify the regulator and affected individuals \u2014 we commit to doing both quickly, and to telling you the substance of the incident without hiding behind boilerplate.',
        ],
        cookies:[
          'The PDPA treats persistent identifiers as personal data. Today this site sets only functional browser storage (region choice, form progress, consent choice), and the banner asks before anything non-essential is switched on.',
        ],
        terms:[],
        declaration:[],
      },
    },
    AU: {
      label:'Australia',
      laws:[
        ['Privacy Act 1988 and the APPs','The Australian Privacy Principles: open and transparent management, collection only for a lawful purpose with consent or another APP basis, notice at collection, security, quality, and accountability any time data goes offshore (APP 8).'],
        ['Privacy and Other Legislation Amendment Act 2024','Stage one of the reform: a statutory tort for serious invasions of privacy commenced 10 June 2025 \u2014 you no longer need to rely on breach of confidence; civil penalties are up; an automated-decision transparency right commences 10 December 2026. Stage two (a full Privacy Act replacement) is in progress \u2014 this policy will be updated when it lands.'],
        ['Spam Act 2003','Every commercial message needs consent (express or inferred), a truthful sender identity and a working unsubscribe.'],
      ],
      regulator:'Office of the Australian Information Commissioner (OAIC).',
      regulatorUrl:'https://www.oaic.gov.au/privacy/privacy-complaints',
      consentMode:'notice',
      rights:[
        'Ask for access to the personal information we hold about you',
        'Ask us to correct it so it is accurate, complete and current',
        'Deal with us anonymously or under a pseudonym where it is practicable \u2014 an enquiry form is one of those cases; a services contract rarely is',
        'From 10 December 2026: meaningful information about automated decisions that significantly affect you',
        'Bring a claim for serious invasion of privacy under the statutory tort that commenced 10 June 2025',
        'Complain to the OAIC \u2014 and to us first, because a fixed problem is better than a fine received',
      ],
      rightsTiming:'We acknowledge within a reasonable time and answer within 30 days.',
      transferNote:'Under APP 8 we remain accountable for personal information disclosed to our India engineering hub: we take reasonable steps to bind the recipient to comparable protection.',
      retentionNote:'Enquiries: 24 months from our last contact. Contracted work: the retention your contract sets, or as long as business records law requires.',
      extras:{
        privacy:[
          'The Privacy Act applies to when businesses with annual turnover above its threshold \u2014 we comply voluntarily for everyone, whatever your size.',
        ],
        cookies:[
          'Australia has no dedicated cookie-consent statute; transparency under APP 1 is the rule. This notice plus the banner is that transparency. Today this site sets only functional browser storage (region choice, form progress, consent choice) and no third-party advertising cookies.',
        ],
        terms:[],
        declaration:[
          'APP 5 requires notice of the purposes and the overseas disclosure \u2014 this declaration is that notice, given before you type anything into a form.',
        ],
      },
    },
    NZ: {
      label:'New Zealand',
      laws:[
        ['Privacy Act 2020','Thirteen Information Privacy Principles (IPPs): lawful purpose, source and notification, collection manner, storage security, access, correction, accuracy, retention, use limits, disclosure limits, unique identifiers, and cross-border disclosure (IPP 12).'],
        ['Privacy Amendment Act 2024','Strengthened penalties and compliance order powers; disclosure of intimate images without consent is a criminal offence under the Act.'],
        ['Spam Act 2007','Commercial electronic messages need consent, accurate sender information and a working unsubscribe.'],
      ],
      regulator:'Office of the Privacy Commissioner (OPC).',
      regulatorUrl:'https://www.privacy.org.nz/your-rights/making-a-complaint/',
      consentMode:'notice',
      rights:[
        'Ask for access to your personal information \u2014 we answer within 20 working days',
        'Ask for a correction, and if we decline, have the disputed note attached',
        'Withdraw any consent and expect collection to stop for anything not legally required',
        'Expect IPP 12 discipline on any offshore disclosure',
        'Complain to the OPC if we fall short; a notifiable breach must reach them within 72 hours of us assessing it as notifiable',
      ],
      rightsTiming:'Access requests: 20 working days as the Act provides.',
      transferNote:'Under IPP 12 we disclose offshore only if the recipient is subject to comparable safeguards \u2014 our India engineering hub is bound by contract to the IPP-equivalent standard.',
      retentionNote:'Enquiries: 24 months from our last contact. Contracted work: the retention your contract sets, or as long as business records law requires.',
      extras:{
        privacy:[
          'The Privacy Act 2020 speaks to "agencies" \u2014 as the data agency for our forms, we owe you the IPPs in full, not a summary of them.',
        ],
        cookies:[
          'New Zealand has no dedicated cookie-consent statute; IPP 1 transparency and IPP 12 discipline cover them. Today this site sets only functional browser storage (region choice, form progress, consent choice) and no third-party advertising cookies.',
        ],
        terms:[],
        declaration:[
          'IPP 3 is the notification principle: you are told what is collected, why, who sees it, whether it is going offshore, and your rights \u2014 this declaration exists to satisfy exactly that, before you send anything.',
        ],
      },
    },
  };

  /* ---------- base documents (shared across regions; jurisdiction annexes are appended) ---------- */
  const DOCS = {
    privacy: {
      key:'privacy', slug:'privacy-policy', title:'Privacy Policy',
      tag:'Applies to this website and to enquiries sent from it',
      intro:'Short version before the details: this site takes almost nothing from you deliberately. We collect the details you type into a form so a real person can reply within one working day, we keep them for two years, we never sell them, and they are processed by our engineering team in India under safeguards written down in the section for your region. Everything below explains each of those sentences in plain words.',
      sections:[
        { h:'Who we are', body:[
          'LTAB AI is a software, AI and brand studio with its engineering hub in India and clients across eight markets: the United States, Canada, Europe and the UK, the UAE, Singapore, Malaysia, Australia and New Zealand. For this website we act as the data controller: we decide why and how the data collected here is used.',
          'Questions, requests, complaints \u2014 anything about your data \u2014 go to hello@ltab.ai. A human answers. If a regulator needs to be involved, the section for your region names them.',
        ]},
        { h:'What we collect', body:[
          'Only what a form asks for, only when you choose to send it:',
          '\u2022 The Freedom Lab enquiry (Home \u2192 "Start your idea"): what you want to build, the services you need, your region, your stage, optional timeline and budget, your name, your email and an optional phone or WhatsApp number.',
          '\u2022 The QA intake form (Software Testing page): what you are shipping, which services and packages interest you, platform and stack details, a release date and start window, your name, work email, role, optional company, country and an optional phone.',
          '\u2022 The subscribe box (Recent Developments): an email address and nothing else.',
          '\u2022 Routine technical context: your site region (guessed from your time zone, changeable once, changeable again), the page you came from, and the click that started a form \u2014 as UTM parameters when present.',
          'No special-category data (health, religion, politics and the rest), no payment card data and no advertising identifiers are collected here. Do not put sensitive details into a form: sentences like a medical diagnosis rarely help an engineering quote and always deserve better protection.',
        ]},
        { h:'Why we use it (the lawful basis)', body:[
          'To reply to you \u2014 that is the primary purpose, and in most regions our legitimate interest in answering the enquiry you sent (or your consent, where consent is required). To deliver services you bought \u2014 performance of a contract. To keep the site working and improve it \u2014 our legitimate interests, documented. To send you a newsletter or an offer \u2014 consent, where your region requires it, or an existing relationship where it does not.',
          'Each use is named per field in the Data Collection Declaration, which reads like the checklist version of this policy.',
        ]},
        { h:'What we do not do', body:[
          'We do not sell personal data. We do not share it with advertising platforms. We run no third-party analytics on this site today, so there is no cross-site tracking profile to give away.',
          'If either of those ever changes, this policy, the cookie notice and (where your region requires it) your consent will change first \u2014 the banner will come back, and non-essential tools stay off until you switch them on.',
        ]},
        { h:'Who sees it', body:[
          'The people who need it: the studio\u2019s leads and the engineers assigned to your enquiry. Service providers who run parts of the stack for us \u2014 email delivery, hosting, and the CRM that receives the form submission \u2014 under contracts that bind them to use it only for us. Today, while the CRM connection is being finalised, submissions are recorded in our own console and nowhere else.',
          'Nobody else. Not "trusted partners", not "carefully selected vendors". If a structure ever changes, the section for your region tells you first.',
        ]},
        { h:'Where it lives \u2014 cross-border transfers', body:[
          'The engineering hub is in India, so answering you well means your details are processed there. That is a cross-border transfer in every region that regulates them; the section for your region names the safeguard (clauses, agreements, comparable-protection rules) instead of a vague promise. A copy of the actual safeguard text is available on request at hello@ltab.ai.',
        ]},
        { h:'How long we keep it', body:[
          'The section for your region carries the exact limits; the studio default is 24 months from the last contact for enquiries, the length of any services contract for project data, and as long as needed for consent records \u2014 so that your choice is honoured for as long as it is relevant. Longer legal retention applies where local law requires us to keep invoices or similar records.',
        ]},
        { h:'Your rights', body:[
          'Every region gives you enforceable rights; the section for your region lists them in full. The practical form is the same everywhere: email hello@ltab.ai, from the address you used, say what you want (a copy, a correction, deletion, an opt-out, a complaint), and we verify and answer inside the deadline your region sets \u2014 never more than 45 days, and free of charge. We may ask one or two verifying questions when the request is unusual; that is protection for you, not friction.',
          'Nothing in this policy limits a mandatory right your local law gives you, and nothing in it asks you to waive one.',
        ]},
        { h:'Security', body:[
          'Least access (the team sees leads only when assigned), encrypted connections by default, secrets kept off this repository, and form submissions not logged beyond what submitting them requires. Compliance in QA engagements follows the client\u2019s agreed scope; we test your products, your data stays your data.',
        ]},
        { h:'Changes to this policy', body:[
          'Material changes are dated and the "Effective" line at the top changes with them. If you have sent us an enquiry we act on the policy as it stood when you sent it, unless the change protects you more \u2014 then the newer one applies. The version log lives in the repository alongside the site.',
        ]},
        { h:'How to contact us', body:[
          'hello@ltab.ai for everything, with "Privacy" in the subject line when it is a rights request \u2014 those get routed to the lead ahead of the queue. A postal address for formal notices is published with the final hosting details.',
        ]},
      ],
    },

    terms: {
      key:'terms', slug:'terms-of-service', title:'Terms of Service',
      tag:'Applies to this website; services are governed by their own contracts',
      intro:'These terms cover using the site itself. Enquiries, quotes, and testing or build work are governed by the specific contract we sign for that work \u2014 those contracts always take precedence over this page where they differ.',
      sections:[
        { h:'Agreement', body:[
          'By using this website you agree to these terms. If you do not agree, use the site as a reader and contact us by email instead of by form. If you are using the site for a business, you confirm you can bind that business.',
          'These terms are dated {version} and may change; the Effective line at the top of this document tells you which version you are reading.',
        ]},
        { h:'Who we are', body:[
          'LTAB AI, a software, AI and brand studio with its engineering hub in India and clients in the regions listed in the header. For this website we are the publisher and operator; comments about services on this page are marketing statements, not binding commitments \u2014 commitments live in the contract.',
        ]},
        { h:'Using the site', body:[
          'You may browse, share links and quote short passages. You may not scrape the site at scale, reverse-engineer its interactive demos for competitive reuse, submit false or spam enquiries, use forms for unlawful content, or interfere with the site\u2019s operation or its other users. The interactive demos (bug hunt, chat walkthrough, workflow) are illustrations of our work, not free tooling, and they are provided "as is" for demonstration.',
        ]},
        { h:'Content and intellectual property', body:[
          'The site\u2019s text, design, code, imagery and the LTAB brand are owned by LTAB AI or licensed to it. Client work shown is either placeholder (until real case studies are published) or shown with the client\u2019s consent. Nothing on this site grants you a licence to our brand.',
          'Sending us an idea does not transfer ownership to us and does not create an obligation on us to keep it secret \u2014 if you want confidentiality before sharing details, say so in the enquiry and we will sign the normal mutual NDA before the first call.',
        ]},
        { h:'Enquiries, quotes and services', body:[
          'Submitting a form starts a conversation, not a contract. Prices marked "starting from" are indicative and region-aware (the Software Testing page explains); any figure that binds us appears only in a written quote or contract. Work is defined by a scope the parties approve; the QA page\u2019s boundaries (what testing includes, what needs its own scope, what we do not promise) are contractual terms there too \u2014 the same honest language: we do not promise zero bugs, and you should be careful with vendors who do.',
        ]},
        { h:'Your responsibilities as a client', body:[
          'Where a scope is agreed, your side owes: a working build or test link, authorised access, sample data or permission to create it, an owner for the fixes, and timely answers to product questions. These duties come straight from the software-testing life cycle and are mirrored in every services contract.',
        ]},
        { h:'Ownership of deliverables', body:[
          'Unless your contract says otherwise, you own the custom deliverables we build for you \u2014 code, designs, content \u2014 paid in full, on handover. We keep our pre-existing tools, frameworks and know-how, plus the right to reuse the general skills; named references and case studies about you happen only with your consent.',
        ]},
        { h:'Payment', body:[
          'Fees, milestones and taxes are set by your contract. Where local law requires a withholding on cross-border payments, the contract says who handles it. Invoices unpaid inside their term pause the work rather than pile up fees \u2014 we would rather restart than charge late interest against a client relationship.',
        ]},
        { h:'Confidentiality', body:[
          'Neither side shares the other\u2019s confidential information beyond the people who need it, during the engagement and after it ends. NDAs are signed before technical or commercial details are exchanged; the enquiry form can carry a confidentiality flag.',
        ]},
        { h:'Limits and liability', body:[
          'To the extent the law allows, liability under these website terms is limited to direct losses up to a modest cap (set by your contract for services); nothing limits liability that cannot be limited \u2014 fraud, wilful misconduct, liability for death or personal injury from negligence, or statutory consumer rights. Nothing here excludes what the law never lets us exclude.',
        ]},
        { h:'Law, disputes and consumer rights', body:[
          'The governing law and forum for a services engagement is agreed in that contract; for this website, the section for your region states the working default, and mandatory consumer protections of your home country always continue to apply where they conflict. Disputes go to good-faith negotiation first; we commit to answering a formal notice within 14 days.',
        ]},
        { h:'Accessibility and availability', body:[
          'The site aims to be readable without JavaScript fully loaded, uses system fallbacks when the 3D layer is unavailable, and respects reduced-motion settings. No uptime promise is made for a marketing site \u2014 if something breaks, tell us; we fix the site before we talk about anything else.',
        ]},
        { h:'Changes', body:[
          'These terms change with the version date; continued use after a change means acceptance. The version log lives in the site repository.',
        ]},
        { h:'Contact', body:[
          'hello@ltab.ai for anything about these terms.',
        ]},
      ],
    },

    cookies: {
      key:'cookies', slug:'cookie-notice', title:'Cookie Notice',
      tag:'What this site sets in your browser, and when',
      intro:'This site runs without advertising cookies, without third-party analytics and without font requests to Google \u2014 everything is self-hosted. Your browser receives a handful of entries it needs to function (region choice, form progress, your consent choice). Any future tool that is not strictly necessary comes with an off switch and your region\u2019s consent rules, explained below.',
      sections:[
        { h:'What cookies and storage are', body:[
          'Cookies are small entries a website can store in your browser; local storage entries behave similarly but persist per origin. Both can remember choices and \u2014 in less careful sites \u2014 track you. That second use is what this site avoids entirely.',
        ]},
        { h:'What we set today', body:[
          '\u2022 ltab-region \u2014 your chosen or auto-detected region, so headings, prices and the legal documents match your market.',
          '\u2022 ltab-lab-step \u2014 your place in the Freedom Lab form, so a refresh does not destroy your answers.',
          '\u2022 ltab-consent \u2014 your privacy choice for this site, so we stop asking once you have answered.',
          '\u2022 ltab-jurisdiction \u2014 inside the Legal Center only: which document variant (Europe or UK) you picked when both apply to your region.',
          'All four are functional storage: no identifiers, no expiry tricks, no third parties reading them. Deleting them costs nothing except your place in a form.',
        ]},
        { h:'What we do not set', body:[
          'No advertising or retargeting pixels. No social-platform trackers. No third-party analytics \u2014 including Google Analytics, today. No web fonts fetched from Google: Bricolage Grotesque, Manrope and JetBrains Mono are served from this site itself, so no font vendor sees your visits.',
        ]},
        { h:'Your consent, by region', body:[
          'Regimes differ on when consent is needed. The banner respects each: where the law demands prior opt-in for non-essential technologies (Europe, UK, and our policy for Singapore and Malaysia), nothing non-essential is ever set before you switch it on. Where a notice is enough (United States, Canada, UAE, Australia, New Zealand), the banner tells you what is set and how to change it \u2014 the section for your region below has the detail.',
        ]},
        { h:'Managing your choices', body:[
          'The banner link reopens the choice; deleting the ltab-consent storage entry does the same. Browser settings always govern cookies your browser holds, whatever any site says. To remove everything this site set, use your browser\u2019s "clear site data" for this origin, or the banner\u2019s reset.',
        ]},
        { h:'If we add tooling later', body:[
          'Any future analytics, advertising or A/B tool will be listed here first, with its provider, purpose, region availability and lawful basis, and \u2014 in opt-in regions \u2014 it will wait for your consent category by category. We will not switch tools in silently.',
        ]},
        { h:'Questions', body:[
          'hello@ltab.ai answers cookie questions too \u2014 ask what an entry does and we will tell you plainly, entry by entry.',
        ]},
      ],
    },

    declaration: {
      key:'declaration', slug:'data-collection-declaration', title:'Data Collection Declaration',
      tag:'The short version you get when it matters most \u2014 before you send anything',
      intro:'This is the at-the-form declaration: exactly what a submission contains, exactly why it is needed, who receives it and what happens next. It is deliberately short; the Privacy Policy and the section for your region carry the law. If a field is unclear, ask hello@ltab.ai before you decide.',
      sections:[
        { h:'We are telling you this before you send', body:[
          'Every form on this site shows a note \u2014 "By sending, you agree we store these details to reply; the region link opens the full declaration" \u2014 and this document is what opens. Sending is consent to what is described here; not sending costs you nothing.',
        ]},
        { h:'Field by field', body:[
          '\u2022 Idea / product description \u2014 needed \u2014 why: without it there is nothing to reply to \u2014 basis: your enquiry, and contract performance once services start.',
          '\u2022 Needs, stage, timeline, budget \u2014 optional \u2014 why: route the enquiry to the right team and shape the first reply \u2014 basis: your instruction, or legitimate interests.',
          '\u2022 Region \u2014 pre-filled from your time zone, changeable \u2014 why: currency, time-zone overlap notes and which legal documents apply \u2014 basis: legitimate interests.',
          '\u2022 Name and email \u2014 needed \u2014 why: to reply \u2014 basis: your enquiry; marketing only with extra consent where required.',
          '\u2022 Phone / WhatsApp (country code included) \u2014 optional \u2014 why: reply by the channel you chose; the country code is stored so we dial correctly \u2014 basis: consent when you submit, withdrawable.',
          '\u2022 UTM parameters and source page \u2014 auto \u2014 why: know which link or campaign earned the reply, so we do not ask you \u2014 basis: legitimate interests.',
          '\u2022 QA intake extras (stack, platform, package, release date, access readiness, role, company, country) \u2014 needed or optional as marked \u2014 why: quote and schedule a test that fits your reality \u2014 basis: as marked; contract once agreed.',
        ]},
        { h:'Where the submission goes', body:[
          'Into a CRM webhook when the connection is live, and today, while it is finalised, only into the studio console \u2014 no third-party receives a copy at this stage. When the CRM connects it will be named here first, with its region of storage.',
        ]},
        { h:'Who reads it inside the studio', body:[
          'The lead, the testing lead or strategist for your enquiry, and the engineers assigned if your project starts. Sensitive content typo\u2019d into a form is not kept: tell us in the reply thread and it is removed from the record.',
        ]},
        { h:'How long', body:[
          'The region section sets the exact rule; 24 months from last contact is the default, shorter if you ask us to delete, longer only where a signed contract or law requires it.',
        ]},
        { h:'Your one-click control', body:[
          'The banner and the Legal Center re-open or reset every choice this site stores; hello@ltab.ai handles everything else (copy requests, corrections, deletion, complaints). The section for your region lists the rights your law gives you and the regulator who hears appeals.',
        ]},
        { h:'Automated processing, plainly', body:[
          'Submissions are read by humans. We may summarise or classify enquiries with AI tools to route them faster \u2014 no decision about you is ever made by a machine alone, and if a denial-like outcome ever resulted from automated processing it would carry a human review you can request. From 10 December 2026 Australia gives you a statutory right to the same transparency; we are applying that standard everywhere.',
        ]},
      ],
    },
  };

  /* ---------- document composer (shared by the Legal Center and the markdown generator) ----------
     Returns {doc, jur, meta:{title, tag, intro, version}, blocks:[{h}|{p}|{li}], extras:[...], annex:{...}} */
  function composeDoc(docKey, jurCode){
    const doc = DOCS[docKey]; const j = JURISDICTIONS[jurCode];
    if(!doc || !j) return null;
    const blocks = [];
    for (const s of doc.sections){
      blocks.push({h:s.h});
      s.body.forEach(b=>{
        if (b.startsWith('\u2022')) blocks.push({li:b.slice(1).trim()});
        else blocks.push({p:b.split('{version}').join(VERSION)});
      });
    }
    return {
      doc, jur: jurCode, jurLabel: j.label,
      meta: { title:doc.title, tag:doc.tag, intro:doc.intro.split('{version}').join(VERSION), version:VERSION },
      blocks,
      extras: (j.extras[docKey] || []).slice(),
      annex: {
        laws: j.laws.map(l=>({name:l[0], note:l[1]})),
        regulator: j.regulator, regulatorUrl: j.regulatorUrl,
        consentMode: j.consentMode,
        rights: j.rights.slice(), rightsTiming: j.rightsTiming,
        transferNote: j.transferNote, retentionNote: j.retentionNote,
      },
      contact: 'hello@ltab.ai',
    };
  }

  window.LTAB_LEGAL_DATA = { VERSION, SITE_REGIONS, REGION_JUR, JURISDICTIONS, DOCS, composeDoc };
})();

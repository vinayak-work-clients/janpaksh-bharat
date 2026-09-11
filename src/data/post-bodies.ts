import type { Block } from "@/types/content";

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

/**
 * Editorial bodies and standfirsts keyed by post id. Kept apart from the
 * post metadata so the seed list in mock-posts.ts stays scannable.
 * All copy is placeholder journalism — realistic in tone, fictional in fact.
 */
export const standfirsts: Record<string, string> = {
  p01: "The five-year plan is the largest single allocation to water infrastructure since Independence — and its success will depend on district engineers, not Delhi.",
  p02: "The Monetary Policy Committee left rates untouched for a fourth straight meeting but softened its language on inflation, opening the door to a cut before the fiscal year ends.",
  p03: "A pilot across forty villages in Sangrur suggests farmers will stop burning paddy residue if the alternative pays. So far, the machines arrive faster than the money.",
  p04: "Record September rain turned the ₹13,000-crore coastal road into a live stress test. Most of it passed. The Worli interchange did not.",
  p05: "New stone cladding has made the riverfront safer and, conservationists say, poorer. A city is arguing about what it means to preserve a place that was never still.",
  p06: "A 3.2-kilometre twin tunnel under the Delhi Ridge was bored without a single settlement complaint — a quiet engineering milestone for a city that rarely notices them.",
  p07: "A 19-year-old left-arm spinner from Jharkhand headlines a squad that trades experience for upside ahead of a home World Cup.",
  p08: "Tourist footfall in the walled city has doubled since the UNESCO listing. Residents say the havelis are being hollowed out into cafés and short-stay rentals.",
  p09: "Two years after the portal launched, not a single manufacturer has been penalised. The problem was never awareness. It is enforcement — and a law with no teeth.",
  p10: "Who pays, who qualifies, and why delivery riders in Bengaluru are still waiting for the first insurance card the code promised them.",
  p11: "A women's self-help group runs the maintenance cooperative. The average household's power bill has fallen to zero and stayed there for two summers.",
  p12: "We visited fourteen government schools across three states. Mother-tongue instruction is real, the no-detention rollback is uneven, and the vacancies are exactly where they were.",
  p13: "Remittances from the Gulf touch $20 billion a year. Making them instant means rewiring settlement between central banks — not shipping an app.",
  p14: "A six-minute film with the drivers, mechanics and commuters keeping a 150-year-old system alive against every odd.",
  p15: "Roads gone, relief slow. Our correspondent walks eleven kilometres to reach a village that had been cut off for nine days.",
  p16: "Purse caps, right-to-match cards and why a 21-year-old uncapped bowler can cost more than a World Cup winner — explained in four minutes.",
  p17: "Constitutional scholar Radhika Menon on why the next redrawing of Lok Sabha seats is the biggest political story nobody is covering.",
  p18: "Three engineers from Bengaluru, Gurugram and Pune on severance, silence, and what they built next.",
};

export const bodies: Record<string, Block[]> = {
  /* ------------------------------------------------------------ p01 */
  p01: [
    { type: "p", text: "The Union Cabinet on Friday approved the National Water Security Mission, a ₹1.2 lakh crore programme that will fund aquifer recharge, canal modernisation and piped supply across 240 districts classified as drought-prone or groundwater-stressed. The mission runs for five years and is the largest single allocation to water infrastructure in the country's history." },
    { type: "p", text: "Officials briefing reporters after the meeting said the first tranche of ₹18,000 crore would be released within the quarter, with a further ₹22,000 crore contingent on states signing a memorandum committing to metered supply in urban clusters. The remainder is back-loaded into the final three years, a structure critics say leaves the programme exposed to future budget pressure." },
    { type: "p", text: "The mission folds three existing schemes — the rural piped-water programme, the atal groundwater initiative and the command-area development fund — into a single line item with district-level dashboards. A senior ministry official said the consolidation would end the practice of states \"double-claiming\" the same borewell under two schemes." },
    { type: "h2", text: "What the money actually buys" },
    { type: "p", text: "Roughly 40 per cent of the outlay is earmarked for recharge structures: check dams, percolation tanks and the desilting of traditional ponds. Another 35 per cent goes to canal lining and pressurised distribution. The final quarter funds household connections, with a stated target of eliminating tanker dependence in every covered district by the fourth year." },
    { type: "image", src: img("1571536802807-30451e3955d8"), caption: "Boats on the Ganga at dusk. River-fed districts along the Gangetic plain account for nearly a third of the mission's first-year allocation.", alt: "Wooden boats moored on a river at dusk with a city on the far bank" },
    { type: "quote", text: "Delhi can sanction the money. Only a district engineer can decide whether it becomes a working canal or a plaque on a dry wall.", cite: "Former member, Central Water Commission" },
    { type: "p", text: "Hydrologists who reviewed the mission document for this newsroom broadly welcomed the emphasis on recharge over extraction but flagged the absence of a binding groundwater-extraction cap. Without one, they argue, new supply will simply be pumped out faster." },
    { type: "list", items: ["240 districts covered across 19 states", "₹18,000 crore released in the first quarter", "Tanker-free supply targeted by year four", "District dashboards to publish monthly extraction data"] },
    { type: "p", text: "State finance departments have until the end of the month to respond to the draft memorandum. Two large northern states have already indicated they will seek changes to the metering clause." },
  ],
  /* ------------------------------------------------------------ p02 */
  p02: [
    { type: "p", text: "The Reserve Bank of India left the repo rate unchanged at 5.5 per cent on Thursday, as widely expected, but shifted the tone of its statement in a way that markets read as the first clear signal of easing to come. The Monetary Policy Committee voted five to one to hold, with the lone dissenter arguing for an immediate quarter-point cut." },
    { type: "p", text: "The central bank trimmed its inflation projection for the second half of the fiscal year by 30 basis points, citing a better-than-expected monsoon and a sustained fall in vegetable prices. It kept its growth forecast unchanged but noted \"emerging softness\" in urban consumption and private capital expenditure." },
    { type: "h2", text: "Reading between the lines" },
    { type: "p", text: "The phrase that moved bond yields was a single sentence: the committee said it would \"remain watchful of the need to support growth as inflation aligns durably with the target\". In previous statements the emphasis had been the reverse. Ten-year yields fell six basis points within the hour." },
    { type: "image", src: img("1554224155-6726b3ff858f"), caption: "Household budgets have absorbed two years of elevated food prices. The MPC now expects headline inflation to sit inside its band through March.", alt: "Paper bills and a calculator laid out on a desk" },
    { type: "quote", text: "This is a hold that behaves like a cut. The guidance has done the work the rate did not.", cite: "Chief economist at a Mumbai brokerage" },
    { type: "p", text: "Banks, which have been slow to pass on earlier cuts to borrowers, face renewed pressure to move on lending rates. The RBI governor said transmission would be \"monitored closely\" and hinted at liquidity measures if it lagged." },
    { type: "p", text: "The next policy meeting is scheduled for early December. Most economists surveyed by this newsroom now expect a 25-basis-point cut at that meeting, with a second to follow in February if food prices hold." },
  ],
  /* ------------------------------------------------------------ p03 */
  p03: [
    { type: "p", text: "In the second week of October, when the sky over Sangrur usually turns the colour of weak tea, Gurmeet Kaur's four acres were green. Not the green of paddy — that had been harvested a fortnight earlier — but the pale, stubborn green of wheat seedlings pushing up through a mat of shredded straw." },
    { type: "p", text: "Kaur is one of roughly 1,100 farmers in forty villages across the district taking part in a pilot that pays them not to burn. The scheme combines in-situ decomposer sprays, subsidised access to happy seeders — machines that sow wheat directly into paddy residue — and a per-acre cash incentive routed through the panchayat." },
    { type: "h2", text: "The economics of not burning" },
    { type: "p", text: "The arithmetic has always been the problem. Burning costs a farmer nothing but a matchstick. Every alternative costs time, diesel or rent. The pilot tries to close that gap with ₹2,500 an acre, paid in two instalments — half after a satellite check confirms no fire, half after the wheat is sown." },
    { type: "image", src: img("1625246333195-78d9c38ad449"), caption: "Wheat seedlings emerging through paddy stubble on a pilot plot. Yields on residue-sown fields have matched conventional plots in the first season.", alt: "Close-up of young green crop seedlings in dark soil" },
    { type: "quote", text: "The machine came in three days. The money took three months. You tell me which one a farmer remembers.", cite: "Gurmeet Kaur, farmer, Sangrur" },
    { type: "p", text: "District officials concede that payments have lagged. Of the first instalment due to 1,100 farmers, roughly 60 per cent had been credited by the time this story went to press. The rest are held up by mismatched land records and bank details — the same paperwork that has stalled a dozen agricultural schemes before this one." },
    { type: "p", text: "Still, early results are striking. Satellite counts recorded 71 per cent fewer fire events across the pilot villages compared with the previous year, against a district-wide fall of 9 per cent. Wheat yields on residue-sown plots were statistically indistinguishable from conventional ones." },
    { type: "p", text: "The state government is weighing whether to extend the pilot to five more districts next season. Farmers' unions have said they will support it — on condition that the second instalment arrives before the first frost." },
  ],
  /* ------------------------------------------------------------ p04 */
  p04: [
    { type: "p", text: "For three days last week, the Worli interchange of Mumbai's coastal road looked less like a piece of infrastructure and more like a hypothesis under examination. Rain fell at a rate the city had not recorded in September for six decades. The tunnels stayed dry. The interchange did not." },
    { type: "p", text: "We spent those three days at the northern end of the ₹13,000-crore project, watching water arrive, pool and eventually drain. The picture that emerged is more nuanced than either the project's defenders or its critics have allowed: the road works, mostly, and its weakest point is exactly where the engineers said it would be." },
    { type: "h2", text: "What held and what flooded" },
    { type: "p", text: "The twin tunnels beneath Malabar Hill — the most expensive and most doubted section — carried traffic throughout, with pumps clearing seepage well within capacity. The reclaimed promenade above them drained as designed. The problem lay at the interchange, where the new road meets the city's century-old storm drains." },
    { type: "image", src: img("1566552881560-0be862a7c445"), caption: "Rain over south Mumbai. The city's Victorian-era drains, not the new road, proved to be the binding constraint.", alt: "A grand colonial-era building in Mumbai under heavy rain" },
    { type: "quote", text: "We built a twenty-first-century road and connected it to a nineteenth-century drain. The water knows which one is older.", cite: "Municipal engineer, speaking off the record" },
    { type: "p", text: "The civic body has announced a ₹340-crore upgrade to the Worli outfall, to be completed before the next monsoon. Residents' groups, who fought the project for a decade, say the interchange flooding vindicates their warnings about drainage. The project office says it vindicates the tunnels." },
    { type: "p", text: "Both are probably right. The coastal road has passed its first monsoon in the way most large Indian infrastructure eventually does: not cleanly, but well enough to keep arguing about." },
  ],
  /* ------------------------------------------------------------ p05 */
  p05: [
    { type: "p", text: "The steps at Dashashwamedh have been rebuilt so many times that no one can say with confidence which stone is original. That, conservationists argue, is precisely the point. Varanasi's ghats were never a monument. They were a working riverfront, patched and repatched by whoever used them last." },
    { type: "p", text: "The municipal corporation's ₹410-crore restoration has replaced that palimpsest with something more legible: uniform sandstone cladding, standardised balustrades, new lighting. The steps are safer. The drainage is better. And a section of the city's heritage community is furious." },
    { type: "h2", text: "Two ideas of preservation" },
    { type: "p", text: "The dispute turns on a genuine philosophical disagreement. The corporation understands heritage as a set of structures to be stabilised. Its critics understand it as a set of practices — the boatman's mooring, the priest's platform, the washerman's slab — that the structures merely accommodated." },
    { type: "image", src: img("1571536802807-30451e3955d8"), caption: "The restored stretch at dusk. New cladding has been laid over steps that were, in places, crumbling into the river.", alt: "Boats moored along a riverfront at dusk" },
    { type: "quote", text: "You cannot restore a place that was never finished. You can only decide what to freeze.", cite: "Architectural historian, Banaras Hindu University" },
    { type: "p", text: "The corporation's position is pragmatic. Sections of the old steps had genuinely become dangerous, and two deaths in the previous monsoon accelerated a project that had been in the planning stage for years. Officials point out that no shrine or platform has been removed and that the boatmen's cooperative signed off on the mooring design." },
    { type: "p", text: "The state heritage committee will hear objections next month. Whatever it decides, the ghats will go on being rebuilt — they always have been. The question is only whether the next layer is laid by an engineer or by the river." },
  ],
  /* ------------------------------------------------------------ p06 */
  p06: [
    { type: "p", text: "At 4.12 on Tuesday morning, a tunnel-boring machine named after a river broke through a concrete wall beneath the Delhi Ridge and completed the longest tunnel drive of the metro's fourth phase. There was no ceremony. A dozen engineers took photographs on their phones and went home to sleep." },
    { type: "p", text: "The 3.2-kilometre twin tunnel between Majlis Park and Azadpur passes under a protected forest, two arterial roads and several hundred homes. Over fourteen months of boring, the project recorded zero surface-settlement complaints — a figure the metro's chief engineer described as \"unusual anywhere, and unheard of here\"." },
    { type: "h2", text: "Why nobody noticed" },
    { type: "p", text: "The absence of complaints owes less to luck than to a monitoring regime borrowed from Singapore: settlement markers every twenty metres, read daily, with an automatic halt if movement exceeded two millimetres. The machine stopped eleven times. Each time, grout was injected and boring resumed within a shift." },
    { type: "image", src: img("1596176530529-78163a4f7af2"), caption: "The northern corridor at dusk. Phase 4 adds 65 kilometres to a network that already carries six million passengers a day.", alt: "Aerial view of a city at dusk with lit roads" },
    { type: "quote", text: "The best infrastructure story is the one where nothing happens to anybody on the surface.", cite: "Chief engineer, Delhi Metro Rail Corporation" },
    { type: "p", text: "Track-laying begins next month, with trial runs on the section scheduled for the middle of next year. The full corridor, which will link the north-west of the city to the airport line, is expected to open in phases from 2028." },
  ],
  /* ------------------------------------------------------------ p07 */
  p07: [
    { type: "p", text: "The selectors met for six hours on Sunday and emerged with a squad that tells a clear story: the future has been brought forward. Three uncapped players — a left-arm spinner, a wicketkeeper-batter and a seam-bowling all-rounder — will travel to a home World Cup that the team was, until recently, expected to contest with its most experienced core." },
    { type: "p", text: "The headline name is 19-year-old Anjali Munda from Jharkhand, whose domestic season produced 31 wickets at an economy rate under four. She has never played an international match. She will almost certainly play in the tournament's opening fixture." },
    { type: "h2", text: "A calculated gamble" },
    { type: "p", text: "The logic, explained by the chief selector, is that home conditions reward spin and that the team's spin resources had grown predictable. Munda offers a different angle and a different pace. Whether she offers composure under lights in front of 40,000 people is a question nobody can answer yet." },
    { type: "image", src: img("1531415074968-036ba1b575da"), caption: "A red ball on the pitch. Home conditions are expected to favour spin through the tournament's first fortnight.", alt: "A red cricket ball resting on a grass pitch" },
    { type: "quote", text: "You do not find out if a nineteen-year-old can handle a World Cup by leaving her at home.", cite: "Chief selector, at the squad announcement" },
    { type: "p", text: "Two senior players have been left out, including a former captain. Both were informed by phone on Saturday night. The board's statement thanked them for their service in language that suggested the decision is not temporary." },
    { type: "p", text: "The squad assembles in Bengaluru next week for a ten-day camp. The tournament begins in three weeks." },
  ],
  /* ------------------------------------------------------------ p08 */
  p08: [
    { type: "p", text: "The haveli on Chandpol Bazaar has been in Meenakshi Sharma's family for five generations. Two years ago she rented the ground floor to a café. Last year, the first floor became a short-stay rental. This year she is moving out." },
    { type: "p", text: "\"I am not being forced,\" she says, and pauses. \"I am being priced.\" Rents in the walled city have doubled since the UNESCO listing. So has tourist footfall. The two facts are connected, and everyone in the old city knows which one came first." },
    { type: "h2", text: "The cost of being admired" },
    { type: "p", text: "Jaipur's heritage economy is, by most measures, a success. Hotel occupancy is at record highs. Restoration grants have saved dozens of façades. Guided walks that once drew a handful of visitors now sell out. The trouble is that the thing being sold — a living, inhabited old city — is being consumed by its own success." },
    { type: "image", src: img("1524230507669-5ff97982bb5e"), caption: "The pink façades of the walled city. Restoration funding has favoured frontages visible from the street.", alt: "Ornate pink sandstone building façade with rows of windows" },
    { type: "quote", text: "A heritage city with no residents is a film set. Beautiful, and closed at night.", cite: "Urban planner and former member of the city's heritage cell" },
    { type: "p", text: "The state government has proposed a cap on short-stay licences inside the walls and a residents' rebate on property tax. Hoteliers argue the measures will strangle the very economy that funds restoration. Residents' groups say the alternative is a city preserved for everyone except the people who live in it." },
    { type: "p", text: "Sharma is moving to a flat in the new city, twenty minutes away. The café has offered to name a dish after her family. She has not decided whether to say yes." },
  ],
  /* ------------------------------------------------------------ p09 */
  p09: [
    { type: "p", text: "When the Right to Repair portal launched two years ago, it was described as a first step. The step has not been followed by a second. Not one manufacturer has been penalised for withholding spare parts, manuals or diagnostic tools. Not one complaint filed through the portal has resulted in a binding order." },
    { type: "p", text: "The portal itself is not the problem. It is a reasonably designed website that lists participating companies and lets consumers file grievances. The problem is that participation is voluntary and the grievance goes nowhere with authority." },
    { type: "h2", text: "What a real law would do" },
    { type: "p", text: "Jurisdictions that have made repair rights work share three features. They oblige manufacturers to sell parts to independent repairers at fair prices. They ban software locks that disable third-party components. And they give a regulator the power to fine companies that do not comply." },
    { type: "image", src: img("1581092160562-40aa08e78837"), caption: "A repair workbench. Independent technicians report that access to genuine parts, not skill, is the binding constraint.", alt: "A workbench with tools and technical drawings viewed from above" },
    { type: "quote", text: "A portal is a suggestion box. A law is a consequence. We were promised the second and given the first.", cite: "Founder, independent repairers' association" },
    { type: "list", items: ["Mandatory parts availability for seven years after last sale", "Ban on software pairing that blocks third-party components", "Statutory penalties enforced by a consumer regulator", "Repairability labelling at point of sale"] },
    { type: "p", text: "India generates more than three million tonnes of electronic waste a year, most of it devices that could have been fixed. The environmental argument for repair is well understood. The consumer argument is simpler still: people should be allowed to fix what they own." },
    { type: "p", text: "A draft bill has been circulating in the ministry for eighteen months. Officials say it is \"under active consideration\". Repairers say they have heard that phrase before." },
  ],
  /* ------------------------------------------------------------ p10 */
  p10: [
    { type: "p", text: "Ravi Kumar has delivered food in Bengaluru for four years. He has been hit by a car once, hospitalised once, and reimbursed for neither. Under the social security code that came into force last year, he is entitled to accident insurance. He has not seen the card." },
    { type: "p", text: "The code is, on paper, a landmark: the first legal recognition that gig workers are workers, with a right to social protection funded partly by the platforms that employ them. In practice, its rollout has been slow, uneven and — for the people it was written for — largely invisible." },
    { type: "h2", text: "Who pays, and how much" },
    { type: "p", text: "The mechanism is a levy of one to two per cent of each platform's turnover, paid into a fund administered by a national board. Workers register through a portal, receive a unique ID and become eligible for accident cover, health insurance and, eventually, a pension contribution." },
    { type: "image", src: img("1526367790999-0150786686a2"), caption: "A delivery rider on a city street. Registration for the social security fund has reached roughly a fifth of eligible workers, according to the board's own figures.", alt: "A delivery rider on a bicycle carrying an insulated backpack down a narrow street" },
    { type: "quote", text: "I registered in January. The app says 'processing'. It has said 'processing' for eight months.", cite: "Ravi Kumar, delivery rider, Bengaluru" },
    { type: "p", text: "Platforms say they have paid the levy on schedule. The board says it has received the money. Somewhere between the two, the insurance cards have not been printed. Officials blame a vendor dispute; workers' unions blame a system designed by people who have never waited for a payment." },
    { type: "list", items: ["Levy: 1–2% of platform turnover", "Registered workers: ~2.1 million of an estimated 10 million", "Accident cover: ₹5 lakh", "Cards issued to date: undisclosed"] },
    { type: "p", text: "A parliamentary committee will review the rollout next session. Kumar is not waiting. He has bought his own accident policy for ₹1,200 a year. \"It is cheaper than trusting a portal,\" he says." },
  ],
  /* ------------------------------------------------------------ p11 */
  p11: [
    { type: "p", text: "The village of Khajuraha Kalan has 300 rooftops and 300 solar arrays, and the woman who keeps them running is a 44-year-old former anganwadi worker who had never seen an inverter until three years ago. Sunita Devi now runs a maintenance cooperative of forty women that services every panel in the village and six others besides." },
    { type: "p", text: "The project began as a state pilot with a modest goal: reduce the village's dependence on a grid that supplied power for six hours a day, on a good day. It has ended up doing something more interesting. The average household's electricity bill is zero. It has been zero for two summers." },
    { type: "h2", text: "How the cooperative works" },
    { type: "p", text: "Each household paid ₹4,000 towards its array, with the state and a development bank covering the rest. Surplus power flows to the grid under a net-metering agreement. The cooperative takes a fixed monthly fee of ₹60 per rooftop, from which it pays its members and buys spare parts." },
    { type: "image", src: img("1473341304170-971dccb5ac1e"), caption: "Transmission lines at sunset. Surplus solar from the village now flows back to a grid that once supplied it six hours a day.", alt: "Electricity transmission towers silhouetted against a sunset sky" },
    { type: "quote", text: "The men said the panels would break in a year. Then they asked us to fix their fans.", cite: "Sunita Devi, cooperative president" },
    { type: "p", text: "Not everything has gone smoothly. Two inverters failed in the first monsoon; the vendor replaced them after a three-month dispute. Net-metering payments from the distribution company have arrived late in four of the last twelve months. And the cooperative's success has attracted the attention of a private operator who wants to buy it." },
    { type: "p", text: "Devi is not selling. The cooperative has just signed an agreement to service a further eleven villages. \"We were told to wait for electricity,\" she says. \"Now electricity waits for us.\"" },
  ],
  /* ------------------------------------------------------------ p12 */
  p12: [
    { type: "p", text: "Five years after the National Education Policy promised to reshape Indian schooling, we went looking for the reshaping. Over six weeks we visited fourteen government schools in three states — hill, plain and coastal — and asked one question in each: what is actually different?" },
    { type: "p", text: "The honest answer is: some things, unevenly. The policy's most visible commitment, instruction in the mother tongue through the primary years, has genuinely taken hold in most of the schools we visited. Its most contested one, the rollback of the no-detention rule, is being applied in ways that vary from district to district." },
    { type: "h2", text: "What has changed in the classroom" },
    { type: "p", text: "In a primary school in Uttarakhand's Chamoli district, first-standard children were learning to read in Garhwali before Hindi — something their teacher said would have been unthinkable a decade ago. Textbooks had arrived. Training had not; she had taught herself from a state video series." },
    { type: "image", src: img("1497486751825-1233686d5d80"), caption: "Children outside a government school. Enrolment has held steady; the shortage is of teachers, not pupils.", alt: "A group of smiling children standing together outside" },
    { type: "quote", text: "The policy is written for a school with a full staffroom. Show me one.", cite: "Headteacher, Bundelkhand" },
    { type: "list", items: ["Mother-tongue instruction observed in 11 of 14 schools", "Teacher vacancy rate unchanged at roughly 18%", "Foundational literacy assessments conducted in 9 of 14", "Vocational exposure at middle-school level in 3 of 14"] },
    { type: "p", text: "The vacancy figure is the one that recurs. Every structural change the policy proposes — smaller classes, multidisciplinary teaching, continuous assessment — assumes teachers who are not there. In three of the schools we visited, a single teacher was handling three grades in one room." },
    { type: "p", text: "The policy's authors would say five years is early. The headteacher in Bundelkhand would say her students do not have another five." },
  ],
  /* ------------------------------------------------------------ p13 */
  p13: [
    { type: "p", text: "Every month, roughly ₹14,000 crore leaves the Gulf for India in the form of remittances — money sent home by drivers, nurses, engineers and cooks. Most of it arrives in two to three days and loses between two and five per cent along the way. UPI's next act is to make it arrive in seconds and lose almost nothing." },
    { type: "p", text: "The ambition is not new. What is new is that the first bilateral link, with the UAE's instant payments system, is live for a small set of banks and a smaller set of users. The early numbers are promising. The path from here to a mass-market product is not an app problem. It is a central-bank problem." },
    { type: "h2", text: "Where the friction lives" },
    { type: "p", text: "A domestic UPI transfer is simple because both ends settle in rupees at the same central bank. A cross-border transfer involves two currencies, two regulators and a foreign-exchange conversion that someone has to guarantee in real time. Today that someone is a chain of correspondent banks, each taking a cut." },
    { type: "image", src: img("1604594849809-dfedbc827105"), caption: "Coins and paper. The cost of sending money home from the Gulf still averages over three per cent — well above the UN's target.", alt: "A stack of coins with a small figure sitting on top" },
    { type: "quote", text: "The technology has been ready for five years. The treaties have not.", cite: "Former payments regulator" },
    { type: "p", text: "The proposed solution is a pre-funded settlement pool, held jointly by the two central banks, that nets out flows in both directions at the end of each day. It is elegant on a whiteboard and fiendish in practice: it requires each side to trust the other's liquidity, and both to agree on a rate." },
    { type: "p", text: "Talks with two further Gulf states are under way. If they succeed, the corridor could carry a fifth of India's inbound remittances within three years. If they stall, the app will keep working beautifully for a few thousand people." },
  ],
  /* ------------------------------------------------------------ p14 */
  p14: [
    { type: "p", text: "Kolkata's trams began running in 1873, pulled by horses. Today three routes survive, worked from a single depot at Nonapukur where a staff of 61 keeps thirty cars in service with parts that are, in many cases, older than the mechanics who fit them." },
    { type: "p", text: "This film spends a day with them: the driver who has worked the Esplanade line for thirty-one years, the apprentice who joined last spring, and the commuters — fewer each year — who choose the slowest vehicle in the city on purpose." },
    { type: "image", src: img("1558431382-27e303142255"), caption: "The Victoria Memorial from the Maidan. Tram Route 36 skirts its northern edge and is the last to run a full timetable.", alt: "A white marble memorial building under a blue sky with clouds" },
    { type: "p", text: "The state has repeatedly floated plans to retire the system and repeatedly reversed them. A heritage designation is pending. The workers at Nonapukur have heard all of it before. They are, as one of them says on camera, \"keeping the wheels turning until somebody decides\"." },
  ],
  /* ------------------------------------------------------------ p15 */
  p15: [
    { type: "p", text: "The road to Jhakri ended, on the ninth day, in a wall of mud twenty feet high. Beyond it lay a village of 340 people who had not been reached by a relief vehicle since the cloudburst. Our correspondent walked the remaining eleven kilometres with a district health worker and two porters carrying rice." },
    { type: "p", text: "What she found was not the catastrophe the early reports suggested — no deaths, three injuries — but something slower and in its way harder to fix: a village with food for four more days, no power, no phone signal, and a school building that had become a shelter for six families whose homes were gone." },
    { type: "image", src: img("1626621341517-bbf3d9990a23"), caption: "The trail above the landslide. Helicopter drops resumed on day ten; road access is not expected for a month.", alt: "Hikers on a snowy mountain trail beneath a bright sky" },
    { type: "p", text: "This is the film of that walk, and of the conversations at the end of it: with the pradhan who has been rationing kerosene, the teacher who is running the shelter, and the boy who wants to know when the mobile tower will be back so he can finish a game." },
  ],
  /* ------------------------------------------------------------ p16 */
  p16: [
    { type: "p", text: "An IPL auction is a stock market with a two-day trading window, ten buyers and a hard cap on how much anyone can spend. Understanding why prices move the way they do requires understanding three rules — the purse, the right-to-match card and the uncapped-player category — and one psychological fact: fear of missing out is stronger than arithmetic." },
    { type: "p", text: "This explainer walks through all four in under four minutes, using last season's most surprising sale as a case study: a 21-year-old bowler with no international caps who went for more than a World Cup-winning all-rounder. The reason is not that anyone thought he was better. It is that he was cheaper to keep." },
    { type: "image", src: img("1540747913346-19e32dc3e97e"), caption: "A floodlit stadium. Franchise valuations have tripled since the media-rights deal, and the auction table has followed.", alt: "A cricket stadium lit up at night" },
    { type: "p", text: "The film closes with a look at what next year's rules are likely to change — and why the uncapped-player loophole may not survive the next round of negotiations." },
  ],
  /* ------------------------------------------------------------ p17 */
  p17: [
    { type: "p", text: "In this episode, constitutional scholar Radhika Menon explains why the next delimitation of Lok Sabha constituencies — frozen since 1976 and due to be unfrozen after the next census — is the most consequential political decision of the decade, and why almost nobody outside a small circle of demographers is talking about it." },
    { type: "p", text: "The arithmetic is stark. Population growth has been uneven across states for fifty years. Redrawing seats to reflect it would shift dozens of constituencies from the south and west to the north. Not redrawing them means a vote in one state counts for less than a vote in another, and the gap is growing." },
    { type: "h2", text: "In this episode" },
    { type: "list", items: ["Why the freeze happened in 1976 and what it was meant to protect", "Three models for unfreezing — and who wins under each", "What the new Parliament building's seating capacity tells us", "The federal bargain: fiscal transfers, seats and the price of consent"] },
    { type: "image", src: img("1495020689067-958852a7765e"), caption: "Reading the morning paper. Menon argues delimitation will dominate headlines by 2028 — and that the groundwork is being laid now.", alt: "A person seated on a bench reading a newspaper that hides their face" },
    { type: "quote", text: "Every democracy eventually has to decide whether a person or a state is the unit of representation. India has postponed that decision for fifty years. The postponement is about to expire.", cite: "Radhika Menon" },
    { type: "p", text: "The conversation runs to 49 minutes. A full transcript will be published alongside the episode." },
  ],
  /* ------------------------------------------------------------ p18 */
  p18: [
    { type: "p", text: "Between them, the three guests on this episode have been laid off four times in three years. One got six months' severance and a farewell email. One got two weeks and a Slack message. One found out from a journalist." },
    { type: "p", text: "We asked them to talk about what nobody covers: the months after the headline. The silence from former colleagues. The LinkedIn post drafted and deleted. The parents who did not understand why a good job at a famous company could simply stop." },
    { type: "h2", text: "In this episode" },
    { type: "list", items: ["Severance in India: what the law requires versus what startups pay", "The 'notice period' that became a bargaining chip", "Building again — a co-op, a consultancy and a company with no VC money", "What they would tell someone who got the email this morning"] },
    { type: "image", src: img("1543269865-cbf427effbad"), caption: "Colleagues around a laptop. Two of our three guests now run businesses with fewer than ten people, by choice.", alt: "Several people working together around a laptop at a wooden table" },
    { type: "quote", text: "The company said it was a restructuring. My mother asked whether I had done something wrong. I didn't have an answer for either of them.", cite: "Guest, Ep. 11" },
    { type: "p", text: "The conversation runs to 43 minutes. Guests' names have been changed at their request." },
  ],
};

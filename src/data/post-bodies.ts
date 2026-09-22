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
  /* ---------------------------------------------------- Phase 4.5 */
  p19: "Pilgrims for Kedarnath and Badrinath are being held at Sonprayag and Joshimath after the Met office forecast extremely heavy rain over the upper valleys through Thursday.",
  p20: "The Doon valley once sent lychees to Lahore and Lucknow. Fewer than 900 acres remain under fruit, and the arithmetic of a plot on the Sahastradhara road no longer favours a tree.",
  p21: "Forty cameras and a control room will estimate footfall on the ghats every minute before the 2027 Kumbh. The pandas and boatmen want to know who sees the number first.",
  p22: "The Naini lake fell to its lowest pre-monsoon level in two decades this year. A town's water, tourism and property market depend on a number nobody is measuring properly.",
  p23: "Sixteen kilometres from Gaurikund to the shrine, on foot, with the mule operators, porters and engineers who keep the route open — and the one stretch they still fear.",
  p24: "A ₹120-crore cluster scheme promises design studios and export fairs. In the mohallas of old Lucknow, a kurta still earns the woman who embroidered it forty rupees.",
  p25: "The first 230 acres of the film city along the Yamuna Expressway were inaugurated on Tuesday. Enhanced compensation for six villages has been in litigation since 2019.",
  p26: "The common effluent plant runs at a third of capacity, the Ganga downstream still fails the bathing standard, and forty thousand jobs sit in the gap between the two.",
  p27: "Piling for the Old Gurugram loop began this month. Residents along the route want to know how 27 stations will sit on roads that already flood every July.",
  p28: "The graded response plan has not been rewritten since 2023. The stubble map, the truck count and the number of monitors have — and that is where the winter will be decided.",
  p29: "Urban planner Meenakshi Sahni on the 1,700 unauthorised colonies, the regularisation that never finishes, and the four million people living inside the paperwork.",
  p30: "Factories supplying Indian and European brands are cutting shifts to absorb the new wage floor. On the factory floor in Savar, take-home pay has barely moved.",
  p31: "A 35-year terminal concession, a debt swap and a clause about warships. The fine print of the Colombo deal matters more than the headline — for both Delhi and Beijing.",
  p32: "Nepal built a second international gateway to bring in tourists from India and China. Five months after opening, most flights still land at the old one.",
  p33: "Exchange houses in Deira are replacing tellers with machines that read an Emirates ID and a UPI handle. The Friday-night crowd has opinions about the trade-off.",
  p34: "The Election Commission now asks parties to cost their promises. We read all 41 manifestos filed so far for the six state polls. Four did the maths.",
  p35: "A five-year rights agreement values the kabaddi league at ₹1,100 crore. The players, most of them from villages in Haryana and western UP, will see a fraction of it.",
  p36: "Indore, Kochi and Dehradun each sold out a half-marathon this season. Sports-injury clinics outside the metros can still be counted on one hand.",
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
  /* ============================================ Phase 4.5 ===== */
  /* ------------------------------------------------------------ p19 */
  p19: [
    { type: "p", text: "The Char Dham yatra was suspended for 48 hours from 6 am on Wednesday after the India Meteorological Department issued a red alert for Rudraprayag and Chamoli districts, forecasting extremely heavy rainfall over the Mandakini and Alaknanda valleys through Thursday night." },
    { type: "p", text: "Pilgrims headed for Kedarnath are being held at Sonprayag and Sitapur; those bound for Badrinath are stopped at Joshimath and Pandukeshwar. District officials said roughly 11,000 people were in the two valleys when the order came into force, with helicopter services from Phata and Guptkashi grounded until visibility improves." },
    { type: "h2", text: "What the alert covers" },
    { type: "list", items: ["Rudraprayag and Chamoli under red alert until Thursday midnight", "Kedarnath trek closed beyond Sonprayag; Badrinath highway closed beyond Joshimath", "Gangotri and Yamunotri remain open under an orange alert", "Helicopter shuttles from Phata, Guptkashi and Sersi suspended"] },
    { type: "p", text: "The State Disaster Response Force has moved two additional teams to Gaurikund and one to Govindghat. The Rishikesh–Badrinath highway was already blocked at two points near Pipalkoti by slips from earlier rain this week." },
    { type: "quote", text: "We would rather hold ten thousand people for two days than move one bus on a wet slope.", cite: "District Magistrate, Rudraprayag" },
    { type: "p", text: "The yatra is expected to resume in stages on Friday, subject to a road survey by the Border Roads Organisation. This is a developing story and will be updated." },
  ],
  /* ------------------------------------------------------------ p20 */
  p20: [
    { type: "p", text: "Somewhere behind the new boundary wall on the Sahastradhara road, four lychee trees are still standing. Ram Prasad Dangwal planted them in 1979, the year his father sold the neighbouring plot to a retired colonel. The colonel's plot is now a block of twelve flats. Dangwal's four trees will not see another harvest: the survey pegs went in last month." },
    { type: "p", text: "Dehradun's lychee is not a metaphor. It is a variety — the Dehradun Rose Scented — that once travelled by rail to Lahore and Lucknow and was, for a few weeks each June, the reason the town existed in the national imagination. Horticulture department records show 3,200 acres under the fruit in 1990. The most recent survey counts fewer than 900, and the officer who compiled it said that figure was generous." },
    { type: "h2", text: "The arithmetic of a tree" },
    { type: "p", text: "A mature lychee tree earns its owner between ₹8,000 and ₹15,000 a season, depending on the year and the broker. A hundred square metres of the same land, on the same road, lists for ₹35 lakh. No policy can close that gap, and the state has not tried; the 2019 land-use amendment that allowed conversion of orchard land to residential use passed with no debate." },
    { type: "image", src: img("1500382017468-9049fed747ef"), caption: "Late light over what was, until 2022, a fifteen-acre orchard on the Raipur road. The colony that replaced it is called Lychee Greens.", alt: "A golden field at sunset under a wide sky" },
    { type: "quote", text: "My grandfather's lychees went to Lahore by train. Mine go to a builder by cheque.", cite: "Orchard owner, Sahastradhara road" },
    { type: "p", text: "A group of remaining growers has petitioned for a heritage-orchard designation modelled on the one that protects mango groves around Malihabad. The proposal has been with the district administration since March. Meanwhile the Doon valley's rain, which the orchards once soaked up, now runs off concrete into a river that floods the same colonies every August." },
    { type: "p", text: "Dangwal says he will take the money. He would like it recorded that he did not want to." },
  ],
  /* ------------------------------------------------------------ p21 */
  p21: [
    { type: "p", text: "The control room sits on the second floor of a building that used to store boats. Six screens show Har Ki Pauri from angles that tourists never see: straight down on the Brahmakund, along the clock tower, across the bridge to Malviya Dwip. A number in the corner of each screen changes every sixty seconds. On a Tuesday afternoon in September it reads 4,180." },
    { type: "p", text: "The system, installed by the state police with a Bengaluru vendor, uses forty cameras and a crowd-density model to estimate how many people are on the ghats at any moment. Its purpose is the 2027 Kumbh, when the figure on a single evening may pass a million. Its immediate effect has been to start an argument about who owns the number." },
    { type: "h2", text: "A number with many claimants" },
    { type: "p", text: "The Ganga Sabha, which administers the ghats, wants the live count displayed publicly so that its volunteers can manage the evening aarti crowd. The boatmen's union wants it because it would settle a long dispute over how many pilgrims actually cross to the island. The pandas, whose registers have recorded arrivals for generations, are less enthusiastic about a camera that counts faster than a ledger." },
    { type: "image", src: img("1433086966358-54859d0ed716"), caption: "The Ganga leaving the hills at Haridwar. The 2027 Kumbh will be the first with a live crowd-density feed on every ghat.", alt: "A river cascading over rocks between wooded banks" },
    { type: "quote", text: "The camera can count heads. It cannot tell you who has come for the last time.", cite: "Panda, Har Ki Pauri" },
    { type: "p", text: "Police say the feed will be shared with the Sabha and the district administration but not published, citing the risk that a live figure could itself cause a rush. A dashboard for the 2027 mela, with fifteen-minute delayed figures, is under discussion." },
    { type: "p", text: "The vendor's engineer, who has spent a month calibrating the model against manual counts, offered one observation: the machine overestimates on aarti evenings, when everybody stands still and close, and underestimates on ordinary mornings, when they move. Haridwar, he said, is harder than a stadium." },
  ],
  /* ------------------------------------------------------------ p22 */
  p22: [
    { type: "p", text: "There is a white line painted on the wall of the boat stand at Mallital. It marks the level of the Naini lake on the day the town's water supply was designed, in 1955. In late May this year the water stood eleven feet below it. The boatmen had to move their jetty twice." },
    { type: "p", text: "Nainital is a town built around a lake that is also its reservoir, its main tourist attraction and the foundation, in a literal sense, of its property market. When the lake falls, all three fall with it. This year's pre-monsoon low was the deepest in twenty years of records that the Kumaon Jal Sansthan is willing to share, and the monsoon that followed refilled it only to the previous year's mark." },
    { type: "h2", text: "Where the water goes" },
    { type: "p", text: "The lake is fed by rain and by a set of springs on the Sukhatal side that have been progressively built over since the 1980s. It is drained by evaporation, by a sluice that the irrigation department opens in August, and by the pumps that supply the town — roughly 8 million litres a day in season, against an inflow that a 2018 study put at 3 million on a dry day." },
    { type: "list", items: ["Pre-monsoon low: 11 ft below the 1955 datum, the deepest in 20 years", "Daily extraction in peak season: about 8 million litres", "Sukhatal recharge basin: 60 per cent built over since 1985", "Last full bathymetric survey of the lake: 2004"] },
    { type: "image", src: img("1506744038136-46273834b3fb"), caption: "A hill lake at dawn. Nainital's last full depth survey was done two decades ago; nobody knows how much silt has arrived since.", alt: "A calm mountain lake reflecting forested slopes and sky" },
    { type: "quote", text: "We have a hundred hotels measuring their occupancy every night and not one instrument measuring the lake every day.", cite: "Retired hydrologist, Kumaon University" },
    { type: "p", text: "The district has proposed a cap on new construction in the Sukhatal catchment and a ban on borewells within 500 metres of the shore. Both proposals have been proposed before. What is new is that the hoteliers' association, which fought the last cap, has this time asked for a meeting." },
    { type: "p", text: "The white line at Mallital will be repainted next spring. The boatmen would like it to mean something again." },
  ],
  /* ------------------------------------------------------------ p23 */
  p23: [
    { type: "p", text: "Sixteen kilometres separate Gaurikund from the Kedarnath shrine. After the 2013 flood the route was rebuilt twice; after last year's landslides it was rebuilt again, in sections, by the same men who had built it before. This film walks the whole distance with them." },
    { type: "p", text: "We spent two days on the trail with a mule operator from Sitapur who has made the climb four thousand times, a porter from Nepal in his first season, and an engineer with the Public Works Department who can name every retaining wall by the year it failed. The stretch they all fear is the same one: the 400 metres below Rambara, where the mountain has not stopped moving." },
    { type: "image", src: img("1464822759023-fed622ff2c3b"), caption: "The upper Mandakini valley. Rambara, the tea stop washed away in 2013, was never rebuilt; the new trail crosses the river 300 metres upstream.", alt: "A snow-capped mountain range above a rocky alpine valley" },
    { type: "p", text: "The film ends at the shrine, at six in the morning, with the engineer measuring a crack in a wall he built in 2022. He says it is fine. He says he will come back and measure it again next month." },
  ],
  /* ------------------------------------------------------------ p24 */
  p24: [
    { type: "p", text: "Shabnam Bano can embroider a kurta front in a day if the pattern is simple and her eyes hold out. For that day's work the contractor pays ₹40. The kurta, finished and starched, will sell in a Hazratganj showroom for ₹2,400, and in a Delhi boutique with a designer's label for four times that. Between Shabnam and the label are five hands, and none of them belong to her." },
    { type: "p", text: "This month the state government announced a ₹120-crore programme for the chikankari cluster: a common design studio, a raw-material bank, an annual export fair and a scheme to register the craft's geographical indication on every authentic piece. The announcement was made in a hotel. The embroiderers, an estimated 250,000 of them across Lucknow and the surrounding districts, were represented by a photograph." },
    { type: "h2", text: "What the cluster scheme does and does not do" },
    { type: "p", text: "The scheme funds infrastructure and marketing. It does not touch the piece-rate system through which nearly all of the work is commissioned, and it does not include a minimum wage for home-based workers, who fall outside the factory laws. A 2023 survey by a Lucknow university found the median embroiderer earning ₹3,200 a month for around 200 hours of work." },
    { type: "image", src: img("1524230572899-a752b3835840"), caption: "Old Lucknow. The chikankari trade is organised through contractors who distribute cut cloth to homes in Chowk, Thakurganj and Daliganj.", alt: "An ornate historic building with arches and a domed roof" },
    { type: "quote", text: "The GI tag will tell the buyer the kurta is genuine. It will not tell her what I was paid.", cite: "Shabnam Bano, embroiderer, Daliganj" },
    { type: "p", text: "A self-help federation of around 6,000 women has asked to be recognised as a supplier under the raw-material bank, which would let them buy cloth directly and sell finished pieces to the design studio without a contractor. The department has said the request is under consideration. The federation's president said she has heard the phrase before." },
    { type: "p", text: "The export fair is scheduled for February. Shabnam has not been invited and did not expect to be. She has a wedding order to finish." },
  ],
  /* ------------------------------------------------------------ p25 */
  p25: [
    { type: "p", text: "The bulldozers arrived at Sector 21 on Tuesday morning, an hour before the ministers. By noon the first 230 acres of what will be called the International Film City had a foundation stone, a laser show scheduled for the evening and, along its eastern boundary, a line of men from Kanarsi village holding photocopies of a 2019 court order." },
    { type: "p", text: "The order directs the Yamuna Expressway authority to pay enhanced compensation — 64.7 per cent above the original award — to landholders in six villages whose fields were acquired in 2009 and 2011. Some of that land is now under the film city. The authority has paid a portion, appealed the rest, and lost the appeal twice. The farmers say roughly ₹340 crore is still outstanding." },
    { type: "h2", text: "A studio on contested ground" },
    { type: "p", text: "The project's developer, a Mumbai production house in partnership with a construction firm, has committed ₹1,500 crore to the first phase: eight sound stages, a film school and a 3,000-seat auditorium. The authority insists the compensation dispute is a separate matter from the lease. The farmers' lawyer argues that the land cannot be leased while its acquisition is under challenge." },
    { type: "image", src: img("1486406146926-c627a92ad1ab"), caption: "Towers along the expressway corridor. The film city's first phase is scheduled to open in 2028; the compensation case has its next hearing in November.", alt: "Modern glass skyscrapers seen from below against a blue sky" },
    { type: "quote", text: "They will make films here about villages like ours. We will be in the audience, if we can afford the ticket.", cite: "Farmer, Kanarsi" },
    { type: "p", text: "The chief minister's office said the outstanding payments would be \"resolved on priority\". The authority's finance wing, asked for a timeline, said it would depend on the appeal. The appeal, asked about, has been listed for November." },
  ],
  /* ------------------------------------------------------------ p26 */
  p26: [
    { type: "p", text: "In 2023 the tanneries of Jajmau were given a deadline. Connect to the upgraded common effluent treatment plant by December, meet the chromium standard at the outlet, or close. It was the fourth such deadline since 1994. The tanners, who have outlived three, did what they have learned to do: they applied for an extension, and they got one." },
    { type: "p", text: "Three years later the picture is roughly what it was. The treatment plant, upgraded at a cost of ₹630 crore, runs at about a third of its capacity because the tanneries it serves are themselves running at a third of theirs — the result of a cap on production imposed during the last extension. The Ganga below the Jajmau outfall still fails the standard for bathing, which is the standard the river is meant to meet. And around 40,000 people who cut, soak and finish leather are employed, in a precise sense, by the deadlock." },
    { type: "h2", text: "Why neither outcome happened" },
    { type: "p", text: "Closure would have removed Kanpur's second-largest industry, a fact no government has been willing to own. Compliance would have required the tanneries to pre-treat their effluent on site, which most of the 260 units cannot afford and the largest 20 have chosen not to. The plant in the middle was built for a volume and a chemistry that neither side has delivered." },
    { type: "list", items: ["Registered tanneries in Jajmau: about 260, of which around 90 are operating", "Common plant capacity: 20 million litres a day; current inflow: about 7", "Chromium at the outfall, last board reading: 3.4 times the limit", "Deadlines issued since 1994: four; deadlines enforced: none"] },
    { type: "image", src: img("1513828583688-c52646db42da"), caption: "Industrial pipework. Chrome tanning produces an effluent that must be treated separately before it reaches a common plant; most Jajmau units send it straight in.", alt: "A tangle of metal pipes and valves at an industrial site" },
    { type: "quote", text: "Everyone wants the river clean and the factories open. Nobody wants to pay for the difference.", cite: "Member, Uttar Pradesh Pollution Control Board, speaking off the record" },
    { type: "p", text: "The state has floated a relocation of the cluster to a new leather park at Ramaipur, twenty kilometres south, with a plant designed for the actual effluent. The tanners' association supports the move in principle and opposes every version of it that has been costed. The next deadline is in March." },
  ],
  /* ------------------------------------------------------------ p27 */
  p27: [
    { type: "p", text: "The first pile for the Gurugram metro's Old City loop went into the ground on the Sheetla Mata road on the second of the month, three years after the project was approved and a decade after it was first promised. The corridor will run 28.5 kilometres from Millennium City Centre through the old town to Cyber City, with 27 stations, and is to open in 2028." },
    { type: "p", text: "Residents along the route have a question that the alignment drawings, the station renders and the ₹5,450-crore sanction letter do not answer: where will the water go? The old city's roads flood every monsoon, in some sectors to a metre. An elevated line puts a pillar every thirty metres down the middle of them." },
    { type: "h2", text: "A plan that exists, somewhere" },
    { type: "p", text: "The metro corporation says a storm-water plan was prepared with the municipal authority and forms part of the detailed project report. The municipal authority says it has seen a summary. Two councillors who asked for the full document under the right-to-information law received the alignment map and a letter saying the drainage design was \"under finalisation by the consultant\"." },
    { type: "image", src: img("1449824913935-59a10b8d2000"), caption: "A city grid from above. Gurugram's old town drains, where they exist, into a network that was designed for a population one-fifth the size.", alt: "Aerial view of a dense city with roads and buildings in a grid" },
    { type: "quote", text: "In July the road outside my shop is a river. Now it will be a river with pillars in it.", cite: "Trader, Sadar Bazaar" },
    { type: "p", text: "Engineers who have worked on elevated corridors elsewhere in the region say the question is legitimate but solvable: pile caps can be raised, drains re-routed, and the corridor itself can carry a storm-water line. Whether the design does any of this is exactly what the residents have asked and not been told." },
    { type: "p", text: "The metro corporation has promised a public consultation \"before the monsoon\". Piling continues meanwhile at four sites." },
  ],
  /* ------------------------------------------------------------ p28 */
  p28: [
    { type: "p", text: "Every October the Commission for Air Quality Management publishes Delhi's winter plan, and every October the plan is the same document with the year changed. The Graded Response Action Plan has four stages, each triggered by a threshold of the air-quality index, each with a list of measures that range from mechanised sweeping to a ban on construction. It has not been substantively rewritten since 2023, and reading it this year will not tell you anything about this year." },
    { type: "p", text: "Three things that are not in the plan will decide the winter. The first is the stubble map: satellite fire counts over Punjab and Haryana in the second week of October, which set the baseline that everything else sits on. The second is the truck count at the city's borders, which the plan restricts but which nobody has published in two years. The third is the number of working monitors, which determines what the index says and therefore which stage the plan is in." },
    { type: "h2", text: "What changed" },
    { type: "list", items: ["Fire counts in Punjab through the first half of October are 38 per cent below last year's, the second fall in a row", "Delhi has 40 continuous monitors; 31 were reporting on the day of writing, up from 24 a year ago", "The truck-entry restriction now runs on a number-plate reader at seven of thirteen entry points, up from none", "Two of last year's four Stage IV triggers were reached on days when fewer than 20 monitors were reporting"] },
    { type: "image", src: img("1480714378408-67cf0d13bc1b"), caption: "A city at night. Delhi's index is an average of its working monitors; when the ones in the worst-hit east go offline, the average improves.", alt: "City street at night with light trails from moving vehicles" },
    { type: "quote", text: "The plan is a thermostat. The argument every year is about whether the thermometer works.", cite: "Atmospheric scientist, IIT Delhi" },
    { type: "p", text: "None of this makes the winter clean. It makes it, for the first time, partly measurable, which is a smaller thing and a more useful one. The plan will be reissued next October. The numbers around it are the thing to watch." },
  ],
  /* ------------------------------------------------------------ p29 */
  p29: [
    { type: "p", text: "Delhi has around 1,700 colonies that the state does not officially recognise and about four million people who live in them. Most were built between the 1970s and the 2000s on agricultural land, on village commons, or on plots the government had acquired and never used. Most have electricity, water and a councillor. Almost none have a title deed that a bank would accept." },
    { type: "p", text: "In this episode, urban planner Meenakshi Sahni explains how the colonies came to exist, why every government since 1977 has promised to regularise them, and why the promise has been kept in law three times and in practice never. The 2019 scheme that was supposed to end the question has issued conveyance deeds to fewer than one in twenty applicants." },
    { type: "h2", text: "In this episode" },
    { type: "list", items: ["The 1977 cut-off and the four that followed it", "What 'regularised' actually confers — and what it withholds", "Why the 2019 scheme stalled at the survey stage", "The election arithmetic: 30 to 35 assembly seats decided by colony voters"] },
    { type: "image", src: img("1524492412937-b28074a5d7da"), caption: "The capital's monuments are mapped to the metre. Its unauthorised colonies were surveyed, in most cases, for the first time in 2019.", alt: "A grand white marble monument with domes under a hazy sky" },
    { type: "quote", text: "The state knows exactly where these colonies are. It has been collecting their electricity bills for forty years. What it will not do is write the address down.", cite: "Meenakshi Sahni" },
    { type: "p", text: "The conversation runs to 46 minutes. A map of the colonies discussed will be published alongside the episode." },
  ],
  /* ------------------------------------------------------------ p30 */
  p30: [
    { type: "p", text: "The wage board's decision was announced on a Thursday and celebrated in the streets of Savar on the Friday. The minimum monthly wage for a garment worker in Bangladesh would rise from 8,000 taka to 12,500 — a 56 per cent increase, the largest since the industry began, and the outcome of a year of strikes in which four workers were killed." },
    { type: "p", text: "By the following month the celebration had cooled. Factories supplying Indian, European and American brands began cutting the overtime that had made up between a quarter and a third of a typical worker's take-home pay. Shifts that had run to twelve hours were cut to eight. The minimum had risen; the total, for many, had barely moved." },
    { type: "h2", text: "The brands' share" },
    { type: "p", text: "Factory owners argue that the buyers who publicly backed the wage rise have not raised the prices they pay per piece, leaving the increase to be absorbed on the factory floor. Two Indian retailers that source from Savar told this newsroom their contracts were \"under review\". Neither would say whether prices had moved." },
    { type: "image", src: img("1558769132-cb1aea458c5e"), caption: "Finished garments on a rail. Bangladesh's exports to India have doubled in five years; the wage floor for the workers who sew them has risen once.", alt: "Rows of clothes hanging on a rack in a shop" },
    { type: "quote", text: "They gave us the wage with one hand and took the hours with the other. My rent does not know the difference.", cite: "Sewing-machine operator, Savar" },
    { type: "p", text: "The unions have asked for the overtime cut to be treated as a violation of the board's intent and for a price floor to be negotiated with the buyers directly. The board has said it has no jurisdiction over buyers. The buyers have said they support fair wages." },
  ],
  /* ------------------------------------------------------------ p31 */
  p31: [
    { type: "p", text: "The agreement signed in Colombo last week runs to 140 pages, and the parts that matter are not on the first one. The headline — an Indian consortium takes a 35-year concession on the West Container Terminal — was known a year ago. What the document adds is a debt-restructuring arrangement, a set of rules about which navies may dock where, and a clause on data that neither side has explained." },
    { type: "p", text: "Here is what each party gets, and keeps." },
    { type: "h2", text: "What India gets" },
    { type: "list", items: ["A 35-year build-and-operate concession on a terminal that will handle 3.2 million containers a year, most of them Indian transshipment cargo that currently routes through Chinese-operated berths next door", "A commitment that Sri Lanka will consult India before permitting research or naval vessels of any third country to berth at Colombo or Hambantota", "A $600-million credit line, part of which converts existing Sri Lankan debt to India into equity in the terminal"] },
    { type: "h2", text: "What China keeps" },
    { type: "list", items: ["The Colombo International Container Terminal, the largest in the port, under a 35-year concession signed in 2011", "Hambantota port, on a 99-year lease that the agreement does not touch", "Priority repayment on its bilateral loans, which the debt-restructuring schedule leaves ahead of India's"] },
    { type: "image", src: img("1578575437130-527eed3abbec"), caption: "A container vessel under way. Colombo handles more Indian cargo than any Indian port on the east coast; the new terminal is designed to keep it that way.", alt: "A large cargo ship loaded with shipping containers at sea" },
    { type: "quote", text: "This is not India replacing China in Colombo. It is India getting a berth of its own next to China's. That is a real gain and a smaller one than the speeches suggest.", cite: "Former Indian ambassador to Sri Lanka" },
    { type: "p", text: "The clause to watch is on data: port operations at the new terminal will run on a system whose servers are to be located \"in a jurisdiction agreed by both parties\". Neither government has said which. The Chinese terminal next door runs on servers in Shenzhen." },
  ],
  /* ------------------------------------------------------------ p32 */
  p32: [
    { type: "p", text: "Nepal's second international airport opened in April to a ceremony, a delegation and one scheduled flight a day. Five months later the number is three. The terminal, built for six million passengers a year at a cost the government puts at $350 million, handles on an ordinary weekday fewer people than a bus stand in the same town." },
    { type: "p", text: "This film visits the airport, the tourism board that promised it would fill, and the Indian and Chinese airlines that were expected to do the filling. Their reasons for staying away are practical — no fuel supplier, no night landing, a runway approach that pilots describe carefully — and they were known before the runway was poured." },
    { type: "image", src: img("1500595046743-cd271d694d30"), caption: "Hill villages under the Himalaya. The new airport was meant to open the western trekking regions to direct flights from Delhi and Chengdu.", alt: "Terraced hillsides and a village beneath snow-covered mountains" },
    { type: "p", text: "The film ends at the old Tribhuvan airport in Kathmandu, where the morning queue for Delhi stretches out of the terminal, and where everybody we asked had heard of the new one and nobody had flown from it." },
  ],
  /* ------------------------------------------------------------ p33 */
  p33: [
    { type: "p", text: "The queue outside the exchange house on Al Maktoum Hospital road used to start at nine on a Friday night and end, some weeks, after midnight. Kerala nurses, Bihari construction workers, Punjabi drivers, each with a folded slip of paper and a wad of dirhams, waiting for a teller to type the details of a bank account in a village that most of them would see once a year." },
    { type: "p", text: "This September the queue is shorter and the tellers are fewer. In their place, along one wall, stand six machines that read an Emirates ID, ask for a UPI handle, take cash or a card, and confirm — usually in under a minute — that the money has arrived. The exchange house calls them kiosks. The customers call them, not always affectionately, the robots." },
    { type: "h2", text: "What the machine changes" },
    { type: "p", text: "For the exchange houses, the kiosks cut the cost of a transaction by around 60 per cent and extend opening hours to the whole night. For the customer, the fee is the same and the wait is shorter. For the teller, who was very often from the same district as the customer, the change is more final." },
    { type: "image", src: img("1512453979798-5ea266f8880c"), caption: "Dubai after dark. Around 3.5 million Indians live in the UAE; their remittances home exceed $20 billion a year.", alt: "A city skyline of tall towers lit up at night" },
    { type: "quote", text: "The old teller asked about my mother. The machine asks for my UPI ID. Both of them send the money.", cite: "Customer, Deira" },
    { type: "p", text: "Two of the largest exchange houses plan to have kiosks in every branch by next year. The tellers' jobs, they say, will be \"redeployed\". One teller we spoke to, who has redeployed herself to a kiosk company as a technician, said the machines break most on Friday nights." },
  ],
  /* ------------------------------------------------------------ p34 */
  p34: [
    { type: "p", text: "In October the Election Commission issued a guideline that it had been threatening for three years: parties contesting the six state elections due this winter must state, for each manifesto promise with a fiscal cost, how much it would cost and how it would be paid for. The guideline is not law. It carries no penalty. The Commission described it as \"a standard of disclosure\"." },
    { type: "p", text: "We read all 41 manifestos filed so far under it. Four contain costings that a public-finance economist would recognise. Eleven contain a number without a source. The rest contain the word \"adequate\"." },
    { type: "h2", text: "The four that did the maths" },
    { type: "p", text: "The four costed manifestos share a feature: they were produced by parties that expect to lose. Costing a promise is a way of making it credible; parties that expect to win have discovered that credibility is not what wins. The two largest parties in the largest state each promise a monthly cash transfer to women, each declines to cost it, and each has told reporters privately that the number is around ₹18,000 crore a year." },
    { type: "list", items: ["Manifestos filed: 41 across six states", "With a full costing and a funding source: 4", "With a figure but no source: 11", "Using the word 'adequate' or equivalent in place of a figure: 26"] },
    { type: "image", src: img("1450101499163-c8848c66ca85"), caption: "Signing off. The Commission's guideline asks parties to attach a costing annexure; most attached a paragraph.", alt: "Close-up of hands signing a document with a pen" },
    { type: "quote", text: "A guideline without a consequence is a suggestion. The Commission has made a very good suggestion.", cite: "Former Chief Election Commissioner" },
    { type: "p", text: "The Commission says it will publish a comparison of costings after the polls. Whether it will name the parties that did not provide one is, a spokesperson said, under consideration." },
  ],
  /* ------------------------------------------------------------ p35 */
  p35: [
    { type: "p", text: "The men who play professional kabaddi in India mostly learned the game in a mud pit behind a school in Haryana or western Uttar Pradesh. This week the league they play in signed a five-year broadcast and streaming deal worth ₹1,100 crore — a figure that, per season, exceeds the equivalent for hockey and puts kabaddi second only to cricket among Indian team sports." },
    { type: "p", text: "The money will go to the league's operating company and its twelve franchises, whose owners include two film studios, a cement company and a former cricketer. The players, under the current salary structure, are bought at an auction with a cap of ₹5 crore per team. The top player last season earned ₹1.2 crore. The median earned ₹14 lakh, for a season that lasts four months." },
    { type: "h2", text: "Where the money goes" },
    { type: "list", items: ["Broadcast deal: ₹1,100 crore over five seasons", "Per-team salary cap: ₹5 crore, unchanged for three seasons", "Highest player salary last season: ₹1.2 crore; median: ₹14 lakh", "Franchises: 12; franchises reporting a profit: 3"] },
    { type: "image", src: img("1461896836934-ffe607ba8211"), caption: "A packed stand under floodlights. The league's television audience last season was put at 220 million — behind only the IPL.", alt: "A stadium crowd cheering under bright lights" },
    { type: "quote", text: "They sold the rights to our matches for eleven hundred crore. The cap on what they can pay us did not change by a rupee.", cite: "Raider, franchise unnamed" },
    { type: "p", text: "The players' association, formed two seasons ago and not yet recognised by the league, has asked for the salary cap to rise in line with the rights fee. The league has said the cap will be \"reviewed\". The next auction is in December." },
  ],
  /* ------------------------------------------------------------ p36 */
  p36: [
    { type: "p", text: "The Indore half-marathon sold its 12,000 places in nine days. Kochi's went in a week. Dehradun's, in its second year, added a 10K to absorb the waiting list and then filled that. Something has happened to running in the cities outside the four big ones, and it has happened faster than anyone selling shoes, timing chips or physiotherapy expected." },
    { type: "p", text: "The shoe companies have caught up. The physiotherapists have not. A search of the registered sports-medicine practitioners in Madhya Pradesh returns eleven names, eight of them in Indore. Kerala has more, most of them attached to football clubs. Uttarakhand has, by the count of the association, three." },
    { type: "h2", text: "What a running boom breaks" },
    { type: "p", text: "The injuries are the ordinary ones — shin splints, runner's knee, stress fractures in people who went from zero to twenty kilometres a week in a month — and they are ordinary precisely because nobody is telling first-time runners how to avoid them. Race organisers provide a medical tent on the day. The eleven weeks of training before it are unsupervised." },
    { type: "image", src: img("1552674605-db6ffd4facb5"), caption: "Early miles. The typical first-time half-marathoner in a tier-2 city is 34, trains alone and has never had a gait assessed.", alt: "A runner on an open road at sunrise" },
    { type: "quote", text: "I see the same knee twenty times a week. It belongs to a different person every time, and every one of them found the race on Instagram.", cite: "Physiotherapist, Indore" },
    { type: "p", text: "Two of the race organisers have begun offering a twelve-week coached programme with the entry fee. Uptake, they say, is about a fifth of the field. The other four-fifths will be at the start line in January, and a predictable fraction of them at the physio's in February." },
  ],
};
